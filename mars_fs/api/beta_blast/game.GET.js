module.exports = (MARSModules) => {
with (MARSModules) {
let randomQuestionsQuery= `SELECT 
c.cat_name,
q.que_id ,
  q.que_text,
  q.que_points,
 CONCAT('[', GROUP_CONCAT(
    DISTINCT JSON_OBJECT(
      'ans_id', a.ans_id,
      'ans_text', a.ans_text,
      'ans_correct',a.ans_correct
    ) ORDER BY RAND() SEPARATOR ','
  ), ']') as answers
FROM questions as q
LEFT JOIN 	 answers as a
ON q.que_id = a.que_id
LEFT JOIN categories_questions as cq
ON q.que_id = cq.que_id
LEFT JOIN categories as c
ON cq.cat_id = c.cat_id
WHERE  q.que_is_deleted IS NULL AND c.cat_id IS NOT NULL
GROUP BY q.que_id
ORDER BY RAND()
LIMIT 10`

// vraca 10 nasumicnih pitanja 
let randomQuestions = db.query(randomQuestionsQuery);



if(randomQuestions.length>0) {
  let parsedQuestions =[];

  for(let i = 0;i<randomQuestions.length;i++){
    let parsedQUestion = {
      cat_name:randomQuestions[i].cat_name,
        que_id:randomQuestions[i].que_id,
        que_text:randomQuestions[i].que_text,
        que_points:randomQuestions[i].que_points,
        answers:JSON.parse(randomQuestions[i].answers),
       
  }
  parsedQuestions.push(parsedQUestion);
 }
  response.status(200)
  write('message', 'Sucsessful request returns 10 random questions from random categories');
  write('questions', parsedQuestions);
} else {
 response.status(204)
write('message', 'No questions avalable');
}
}
}