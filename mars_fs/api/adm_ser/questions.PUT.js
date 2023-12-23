module.exports = (MARSModules) => {
with (MARSModules) {

 //let category_IDs = param("category_IDs",null); // ovo je staro vise ne koristi
 let categories = param("categories",null);  
let question = param("question",null);
let answer_correct = param("answer_correct",null);
let answer_false1 = param("answer_false1",null);
let answer_false2 = param("answer_false2",null);
let answer_false3 = param("answer_false3",null);
let perId = 20;

//izmena pitanja i odgovora za to pitajne


const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);



write("categries", categories)
write("question", question)
write("answer", answer_correct)
write("ans false 1", answer_false1)
write("ams false 2", answer_false2)
write("and false 3", answer_false3)


 
let updateQuestionQuery= 'UPDATE questions SET que_text =:que_text WHERE que_id = :que_id';
let updateAnswerQuery = 'UPDATE answers SET ans_text =:ans_text WHERE ans_id = :ans_id'
let deleteQuestionsCategories = 'DELETE FROM categories_questions WHERE que_id = :que_id';
let updateQuestionCategory = " INSERT INTO categories_questions(cat_id,que_id) VALUES(:cat_id,:que_id)"
let oldCategoriesQuery = 'SELECT cat_id FROM categories_questions WHERE que_id = :que_id'

const validate = include(".shared/validate")
let isEqual = null;
let numOfElements=0;



let questionParam = {
que_text : question.que_text.trim(),
que_id:question.que_id
}


let answerCorrectParam = {
  ans_text:answer_correct.ans_text.trim(),
  ans_id : answer_correct.ans_id
}

let answerFalse1Param = {
  ans_text:answer_false1.ans_text.trim(),
  ans_id : answer_false1.ans_id
}

let answerFalse2Param = {
  ans_text:answer_false2.ans_text.trim(),
  ans_id : answer_false2.ans_id
}

let answerFalse3Param = {
  ans_text:answer_false3.ans_text.trim(),
  ans_id : answer_false3.ans_id
}


let queTextCheck = validate.question(question.que_text);
let ansCorrectTextCheck = validate.answer(answer_correct.ans_text);
let ansFalse1TextCheck = validate.answer(answer_false1.ans_text);
let ansFalse2TextCheck = validate.answer(answer_false2.ans_text);
let ansFalse3TextCheck = validate.answer(answer_false3.ans_text);



UpdateQuestion();
UpdateCorrectAnswer();
UpdateFalse1Answer();
UpdateFalse2Answer();
UpdateFalse3Answer();
CompareArrays();
UpdateCategoriesQuestions();


  
 


function UpdateFalse3Answer()
 {
  if(answer_false3 && !ansFalse3TextCheck)
  {
    let answerFalse3Db = db.query(updateAnswerQuery,answerFalse3Param);
    response.status(200)
  write('FA3message', "Answer is updated");
    return;
  }
   response.status(400)
  write('FA3message', "Answer not updated bad params");
 }

function UpdateFalse2Answer()
 {
  if(answer_false2 && !ansFalse2TextCheck)
  {
    let answerFalse2Db = db.query(updateAnswerQuery,answerFalse2Param);
    response.status(200)
  write('FA2message', "Answer is updated");
    return;
  }
  else
  {
     response.status(400)
  write('FA2message', "Answer not updated bad params");
  }
  
 }


function UpdateFalse1Answer()
 {
  if(answer_false1 && !ansFalse1TextCheck)
  {
   let answerFalse1Db = db.query(updateAnswerQuery,answerFalse1Param);
    response.status(200)
  write('FA1message', "Answer is updated");
    return;
  }
  else
  {
    response.status(400)
  write('FA1message', "Answer not updated bad params");
  }
   
 }


 function UpdateCorrectAnswer()
 {
  if(answer_correct && !ansCorrectTextCheck)
  {
   let answerCorrectDb = db.query(updateAnswerQuery,answerCorrectParam);
    response.status(200)
  write('CAmessage', "Answer is updated");
    return;
  }
  else
  {
    response.status(400)
  write('CAmessage', "Answer not updated bad params");
  }
   
 }


function UpdateQuestion()
{
  if(question && !queTextCheck)
  {
    let questionDb = db.query(updateQuestionQuery,questionParam);
    response.status(200)
  write('Qmessage', "Question is updated");
    return;
  }
  else
  {
    response.status(400)
  write('Qmessage', "Question not updated bad params");
  }
   

}







function CompareArrays()
{
let oldCategoriesDB = db.query(oldCategoriesQuery,questionParam);

if(oldCategoriesDB.length !== categories.length)
{
  isEqual= false;
  return;
}



  for(let i = 0 ; i < oldCategoriesDB.length; i++)
{
    
   for(let j = 0 ; j< categories.length; j++)
{
  
     
     if(oldCategoriesDB[i].cat_id === categories[j])
     {
      
      numOfElements++;
     }
  
}

}


if(oldCategoriesDB.length === numOfElements)
{
  isEqual= true;
}
else
{
  isEqual= false;
}



}


function UpdateCategoriesQuestions()
 {
 
if(isEqual === true)
{
  write('isEqual', "Not updated category already exist");
  exit();
}
else
{
   

let deletedRows = db.query(deleteQuestionsCategories,questionParam);

 
for(let i = 0;i<categories.length; i++)
{
  let insertCQParams={
    que_id:question.que_id ,
    cat_id:categories[i]
  }
 
  let newCQ = db.query(updateQuestionCategory,insertCQParams);

}
write('IsUpdated', "Update is successfull");

}

}




}
}