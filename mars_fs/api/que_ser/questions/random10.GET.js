module.exports = (MARSModules) => {
with (MARSModules) {
 let cat_id = param("cat_id",null);
let usr_id = param("usr_id",null);
 
 /*
// write('sid', value);
let header = request.header('X-MARS-SID');
write('header', header);
let user = session('user')
write("user session", user)
*/

// vrati svih 10 pitanja ali vrati ih kao da su ono iz que_id


//Ovo je korak 1
//Vraca id igre
// Vraca 10 nasumicnih pitanja za datu kategoriju i pravi novu igru u tabelu games
//ovde sam stavio da prihvata query parametre  a ne path params******************************************************************
//dali da prihvati vreme sa frionta ili ne zato sto baza moze da ima razlicito vreme of trenutnog korisnioka
//Ovde i vraca trenutni gam_id trebace nam za unos u responses to radimo u questions/post
 
let random10QuestionsQuerry = `SELECT 
q.que_id ,
  q.que_text,
  q.que_points,
 CONCAT('[', GROUP_CONCAT(
    DISTINCT JSON_OBJECT(
      'ans_id', a.ans_id,
      'ans_text', a.ans_text
    ) ORDER BY RAND() SEPARATOR ','
  ), ']') as answers
FROM questions as q
LEFT JOIN 	 answers as a
ON q.que_id = a.que_id
LEFT JOIN categories_questions as cq
ON q.que_id = cq.que_id
LEFT JOIN categories as c
ON cq.cat_id = c.cat_id
WHERE c.cat_id = :cat_id AND q.que_is_deleted IS NULL
GROUP BY q.que_id
ORDER BY RAND()
LIMIT 10`
 
let addNewGameQuery ='INSERT INTO games(usr_id,cat_id) VALUES(:usr_id,:cat_id)'
let getLastGameIdQuery = 'SELECT LAST_INSERT_ID() as lastId'
let perId = 22;

 const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);


let cat_gam_Params = {
  cat_id : cat_id,
  usr_id:usr_id
}

 
//ovde validacija za trenutnog usera


if(cat_id && cat_id.trim() !== '' &&  usr_id && usr_id.trim() !== '')
{

let newGameDB = db.query(addNewGameQuery,cat_gam_Params);
let gameId = db.query(getLastGameIdQuery);

let randomQuestions10DB = db.query(random10QuestionsQuerry,cat_gam_Params);

if(randomQuestions10DB.length>0) {
  let parsedQuestion =[];

  for(let i = 0;i<randomQuestions10DB.length;i++){
    let parsedQUestion = {
        que_id:randomQuestions10DB[i].que_id,
        que_text:randomQuestions10DB[i].que_text,
        que_points:randomQuestions10DB[i].que_points,
        answers:JSON.parse(randomQuestions10DB[i].answers),
       
  }
  parsedQuestion.push(parsedQUestion);
 }
  response.status(200)
  write('message', 'Sucsessful request returns 10 random questions');
  write('gameId', gameId[0].lastId);
  write('question', parsedQuestion);
} else {
 response.status(204)
write('message', 'No questions avalable');
}

}
else
{
  write('message',"Bad parameters");
 response.status(400)
}
}
}