module.exports = (MARSModules) => {
with (MARSModules) {
let search =  param("search",null);

//radi pretragu pitanja

let searchQuery = `    
SELECT 
  q.que_id,
  q.que_text ,
  q.que_points,
  q.que_is_deleted,
 CONCAT('[', GROUP_CONCAT(
    DISTINCT JSON_OBJECT(
      'cat_id', c.cat_id,
      'cat_name', c.cat_name,
      'cat_description',c.cat_description,
      'cat_is_deleted', c.cat_is_deleted
    ) ORDER BY  c.cat_name DESC SEPARATOR ','
  ), ']') as categories,
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
LEFT JOIN categories_questions cq ON q.que_id = cq.que_id
LEFT JOIN categories c ON cq.cat_id = c.cat_id
WHERE 	q.que_text LIKE :search
GROUP BY q.que_id
ORDER BY q.que_id;
`

let perId = 18;

const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);

let searchParam = {
    
    search: '%'+search+'%' 

}

 
let questions = db.query(searchQuery,searchParam);


if( questions && questions.length>0) {
  let parsedQuestions =[];

  for(let i = 0;i<questions.length;i++){
    let parsedQUestion = {
        que_id:questions[i].que_id,
        que_text:questions[i].que_text,
        que_points:questions[i].que_points,
        que_is_deleted:questions[i].que_is_deleted,
        answers:JSON.parse(questions[i].answers),
        categories:JSON.parse(questions[i].categories)
  }
  parsedQuestions.push(parsedQUestion);
 }
  response.status(200)
  write('message', 'Sucsessful request returns all questions');
  write('question', parsedQuestions);
} else {
 response.status(204)
write('message', 'No questions avalable');
}


}
}