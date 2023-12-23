module.exports = (MARSModules) => {
with (MARSModules) {
 //radi proveru koliko je ostalo vremena (10 min) tako sto uporedjujes kreirano vreme na games i ako je proslo 10 min ti izbaci poruku 
// na kraju kviza vrati ukupno vreme izrade kviza
//na kraju svake igre uradi avg score svih igara za datog usera i datu kategoriju

let  que_id = param("que_id",null);
let ans_id = param("ans_id",null);
let gam_id = param("gam_id",null);
let perId = 22;

 const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);

//Korak 3
// proverava dali je zadati odgovor na pitanje tacan ili ne. U oba slucaja vraca poruku i stausni kod
//unosi odgovore u responses
let game_finished = false;
let parsedQuestion ;
let numOfAnswerdQuestions = 0;
   
let checkForAverageScoreQuery = 'SELECT usr_id,cat_id,ave_AverageScore FROM averageScores WHERE ave_is_deleted IS NULL AND usr_id = :usr_id  AND cat_id = :cat_id'
let insertNewAverageScoreQuery =  'INSERT INTO averageScores(usr_id,cat_id,ave_AverageScore) VALUES(:usr_id,:cat_id,:ave_AverageScore)'
let updateAverageScoreQuery = 'UPDATE averageScores SET ave_AverageScore = :ave_AverageScore WHERE usr_id =:usr_id AND cat_id =:cat_id'
let getUserIdCatIdFromGameQuery= 'SELECT usr_id,cat_id FROM games WHERE gam_id =:gam_id'
let getAverageScoreQuery = 'select AVG(gam_score) as ave_AverageScore from games WHERE usr_id =:usr_id	'


let gameTimeLength = `SELECT TIMEDIFF(NOW(), g.game_created) as gameTime
FROM games AS g
WHERE g.gam_id = :gam_id`

let numOfAnswerdQuestionsQuery = `SELECT COUNT(r.gam_id) as numOfQuestions
FROM responses AS r
WHERE r.gam_id = :gam_id
`

let avgScore = ''

let numOfCorrectAnswersQuery = `SELECT Count(a.ans_correct) AS corrAnsNum
FROM games as g
LEFT JOIN responses AS r
ON g.gam_id = r.gam_id
LEFT JOIN answers AS a
ON r.ans_id = a.ans_id
WHERE g.gam_id =:gam_id AND a.ans_correct = 1`

let questionQuery = `SELECT 
  q.que_id ,
  q.que_text,
  q.que_points,
  q.que_is_deleted,
  CONCAT('[', GROUP_CONCAT(
    DISTINCT JSON_OBJECT(
      'ans_id', a.ans_id,
      'ans_text', a.ans_text,
      'ans_correct', a.ans_correct,
      'ans_is_deleted', a.ans_is_deleted
    ) ORDER BY a.ans_correct DESC SEPARATOR ','
  ), ']') as answers
FROM questions q
LEFT JOIN answers a ON q.que_id = a.que_id
WHERE 	q.que_id =:que_id
GROUP BY q.que_id
ORDER BY q.que_id;`
 
 let newResponseQuery = 'INSERT INTO responses (ans_id,que_id,gam_id) VALUES(:ans_id,:que_id,:gam_id)'

let finishGameQuery = 'UPDATE games SET gam_status = 1, gam_finished = NOW(), gam_score = :gam_score WHERE gam_id = :gam_id;'


let queParams = {
  que_id:que_id,
  ans_id:ans_id,
  gam_id:gam_id
}

let gameTime = db.query(gameTimeLength,queParams);
write('gameTime', gameTime[0].gameTime);

if(gameTime[0].gameTime>"00:10:00"){
  game_finished = null;
  response.status(408);
  write('game_finished', game_finished);
  write('FinishedGameMessage','Time`s up GAME OVER');
  exit();
}

if(que_id && ans_id && gam_id){

  let responseDB = db.query(newResponseQuery,queParams);
  let question = db.query(questionQuery,queParams);

  if(question.length>0) {
    for(let i = 0;i<question.length;i++){
      let parsedQUestion = {
          que_id:question[i].que_id,
          que_text:question[i].que_text,
          que_points:question[i].que_points,
          answers:JSON.parse(question[i].answers),
        
      }
      parsedQuestion=parsedQUestion;}
    } else {
    response.status(204)
    write('message', 'No question avalable for that id');
    exit();
    }

    let ansIsCorrect = false;
    let correctId = null;
  

  for(let i = 0; i<parsedQuestion.answers.length; i++){
    if(parsedQuestion.answers[i].ans_correct === 1){
      correctId = parsedQuestion.answers[i].ans_id;
      if(parsedQuestion.answers[i].ans_id === ans_id){
        ansIsCorrect = true;
        response.status(200)
        write("correctId", correctId)
        write("messageIsCorrect", "Correct answer provided.");
        write("IsCorrect", true);   
     }
    }
  } 
  
  if(ansIsCorrect==false){  
    response.status(200)
     write("correctId", correctId)
    write("messageIsCorrect", "Incorrect answer provided.");
    write("IsCorrect", false);
  }
} else {
  response.status(400)
  write("message", "Bad Parameters");
  exit();
}


 numOfAnswerdQuestions = db.query(numOfAnswerdQuestionsQuery,queParams);
 numOfAnswerdQuestions = numOfAnswerdQuestions[0].numOfQuestions;
 write('numOfAnswerdQuestions', numOfAnswerdQuestions);

//ako je kraj kviza
 if(numOfAnswerdQuestions===10){
  gam_finished=true;

  let gameParameters={
    gam_id:gam_id 
  }
  let numOfCorrectAnswers = db.query(numOfCorrectAnswersQuery,gameParameters);
  numOfCorrectAnswers = numOfCorrectAnswers[0].corrAnsNum;
  let finalScore = (numOfCorrectAnswers/10)*100;

  let gameParams={
  gam_id:gam_id,
  gam_score:finalScore
  }
  

  let finishGameDB = db.query(finishGameQuery,gameParams);
  game_finished=true
  response.status(200)
  write('score', finalScore);
  write("numOfCorrectAnswers", numOfCorrectAnswers)
  write('is_game_finished', game_finished);
  write('is_FinishedGameMessage', "Game is done");

  let usrIdcatId = db.query(getUserIdCatIdFromGameQuery,gameParams);
  let usr_id = usrIdcatId[0].usr_id;
  let cat_id = usrIdcatId[0].cat_id;

  let usrId = {
     usr_id:usr_id
  }

  let ave_AverageScore = db.query(getAverageScoreQuery,usrId);
  ave_AverageScore = ave_AverageScore[0].ave_AverageScore;

  let averageScoreParams = {
    usr_id:usr_id,
    cat_id:cat_id,
    ave_AverageScore:ave_AverageScore,
    gam_id:gam_id
  }
 
  let checkForAversageScore = db.query(checkForAverageScoreQuery,averageScoreParams);

  if(checkForAversageScore.length>0){
  let updateAverageScoreDB = db.query(updateAverageScoreQuery,averageScoreParams);
  } else {
   let  insertNewAverageScore = db.query(insertNewAverageScoreQuery,averageScoreParams);
  }
 }











}
}