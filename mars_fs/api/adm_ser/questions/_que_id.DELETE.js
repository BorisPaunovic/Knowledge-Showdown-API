module.exports = (MARSModules) => {
with (MARSModules) {
let que_id = param("que_id",null);
let perId = 19;
 

//brise pitanje

let deleteQuestionQuery= 'UPDATE questions SET que_is_deleted = now() WHERE que_id =:que_id;'
let restoreQuestionQuery= 'UPDATE questions SET que_is_deleted = null WHERE que_id =:que_id;'


let getQuestionFromDbQuery = 'SELECT que_id, que_text ,que_points, que_is_deleted FROM questions  Where que_id = :que_id'
let deleteParameter = 
{
  que_id : que_id
}
 
const permissionValidations = include(".shared/permissionValidations")
 
permissionValidations.checkPermissions(perId);


 

let questionFromDb =  db.query(getQuestionFromDbQuery,deleteParameter);


 
if(questionFromDb[0].que_is_deleted === null )
{
 
let deleteQuery = db.query(deleteQuestionQuery,deleteParameter);
response.status(200)
write('message', "Question is deleted");

}
else
{
 
let deleteQuery = db.query(restoreQuestionQuery,deleteParameter);
response.status(200)
 write('message', 'Question is restored');

}



}
}