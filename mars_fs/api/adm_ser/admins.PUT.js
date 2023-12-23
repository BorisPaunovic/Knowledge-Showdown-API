module.exports = (MARSModules) => {
with (MARSModules) {
 // daje ili uzima privilegiju admina nekom korisniku

//  Primer iz dokumentacije kako se proverava  da li je user ulogovan, 
// to dodajemo u sve api pozive gde treba da bude ulogovan. 
let usr_id = param("usr_id",null);
let perId = 8




//sve to kad prodje onda proverava da li user sa tim id-jem vec postoji u tabeli users_roles
// ako ga nema: dodajemo novi red
// ako ga ima: menjam taj red tako sto dodeljujemo obicnog usera rol_id =7
 

let demoteUserFromAdminQuery= 'UPDATE users_roles SET rol_id = 7 WHERE usr_id = :usr_id;'
let promoteUserToAdminQuery= 'UPDATE users_roles SET rol_id = 6 WHERE usr_id = :usr_id;'
let getUserFromDbQuery = `
SELECT u.usr_id,u.usr_username,u.usr_is_deleted,r.rol_id, r.rol_name,r.rol_is_deleted 
 FROM users as u 
LEFT JOIN users_roles as ur
 on u.usr_id = ur.usr_id 
  left join roles as r
  on ur.rol_id = r.rol_id 
 Where u.usr_id = :usr_id`


const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);


 let adminParameter = 
 {
   usr_id : usr_id 
   
 }
let mappedData =[];

let userFromDb = db.query(getUserFromDbQuery,adminParameter);

 if(userFromDb[0].rol_id !==7)
 {
 let adminQuery = db.query(demoteUserFromAdminQuery,adminParameter);
 response.status(200)
 write('message', "User is demoted from admin");
 }
 else
 {
 let adminQuery = db.query(promoteUserToAdminQuery,adminParameter);
  response.status(200)
 write('message', 'User is promoted to admin');
 }








}
}