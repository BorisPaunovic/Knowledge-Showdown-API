module.exports = (MARSModules) => {
with (MARSModules) {
let categories = param("categories",null); //stize niz id-jeva
let que_text = param("que_text",null);
let answer_correct = param("answer_correct",null);
let answer_false1 = param("answer_false1",null);
let answer_false2 = param("answer_false2",null);
let answer_false3 = param("answer_false3",null);

//unosi novo pitanje sa odgovorima

let mixCategoryId = 23;
categories.push(mixCategoryId);

let perId = 21;
const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);


 const validate = include(".shared/validate")


let data = param("data",null);

let addNewQuestionQuery='INSERT INTO questions(que_text) VALUES (:que_text) '
let questionFromDbQuerry = 'SELECT que_id FROM questions where que_text = :que_text'
let getLastQuestionIdQuery = 'select last_insert_id() as lastInsertedId '
let addNewAnswersQuery = 'INSERT INTO answers (que_id, ans_text, ans_correct) VALUES (:que_id,:answer_correct, 1),(:que_id,:answer_false1, 0),(:que_id,:answer_false2, 0),(:que_id,:answer_false3, 0)'
let addNewCategoriQuestionsQuery='INSERT INTO categories_questions(cat_id,que_id) VALUES(:cat_id,:que_id)';

let questionParams = {
que_text:que_text

}

let questionFromDb= db.query(questionFromDbQuerry,questionParams);

let queTextCheck = validate.question(que_text);
let ansCorrectTextCheck = validate.answer(answer_correct);
let ansFalse1TextCheck = validate.answer(answer_false1);
let ansFalse2TextCheck = validate.answer(answer_false2);
let ansFalse3TextCheck = validate.answer(answer_false3);

 


if(questionFromDb.length > 0) {
  response.status(409)
  write('message','Question already exists');
  exit();
} 
else if(!queTextCheck && !ansCorrectTextCheck && !ansFalse1TextCheck && !ansFalse2TextCheck && !ansFalse3TextCheck )
{
  write('testMessage', "sve validacije su ok");
  
let addNewQuestion = db.query(addNewQuestionQuery,questionParams);

let newQuestionId = db.query(getLastQuestionIdQuery);  
write('Qmessage','Question added');
  response.status(200) 

let answersParams = {
 
  que_id:newQuestionId[0].lastInsertedId,
  answer_correct:answer_correct.trim(),
  answer_false1:answer_false1.trim(),
  answer_false2:answer_false2.trim(),
  answer_false3:answer_false3.trim()
}
let addNewAnswers = db.query(addNewAnswersQuery,answersParams);
 response.status(200) 
write('Amessage','Answers added');

if(categories){
  for(let i = 0;i<categories.length;i++){
      let categoriesQuestionsParams = {
      cat_id:categories[i],
      que_id:newQuestionId[0].lastInsertedId
      }

      let addNewCategoriQuestions = db.query(addNewCategoriQuestionsQuery,categoriesQuestionsParams);
      write(i,addNewCategoriQuestions);
  }
}
 response.status(200) 
write('message','everithing is ok');  
}
else
{
 response.status(400);
 write('message', 'Invalid parameters'); 
}







}
}