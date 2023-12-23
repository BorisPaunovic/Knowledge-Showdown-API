module.exports = (MARSModules) => {
with (MARSModules) {
//daje ili sklanja titulu deleted sa nekog korisnika
let usr_id = param("usr_id",null);
let deleteUserQuery= 'UPDATE users SET usr_is_deleted = now() WHERE usr_id =:usr_id;'
let restoreUserQuery= 'UPDATE users SET usr_is_deleted = null WHERE usr_id =:usr_id;'
let getUserFromDbQuery = 'SELECT usr_id, usr_username , usr_is_deleted FROM users  Where usr_id = :usr_id'
let deleteParameter = 
{
  usr_id : usr_id
}
let perId = 7;


const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);


write('testUserId', usr_id);
let userFromDb = db.query(getUserFromDbQuery,deleteParameter);

 
if(userFromDb[0].usr_is_deleted === null )
{
 
let deleteQuery = db.query(deleteUserQuery,deleteParameter);
response.status(200)
write('message', "User is deleted");

}
else
{
 
let deleteQuery = db.query(restoreUserQuery,deleteParameter);
response.status(200)
 write('message', 'User is restored');

}




 




 
}
}