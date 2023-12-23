module.exports = (MARSModules) => {
with (MARSModules) {
//radi pretragu korisnika(za admina i super anmina)
let search =  param("search",null);
let perId=6
let searchQuery = `SELECT u.usr_id, u.usr_username , u.usr_fullname, u.usr_email,
 u.cou_id, u.ava_id, u.usr_is_deleted, r.rol_name 
 FROM users u 
 LEFT JOIN users_roles ur ON ur.usr_id = u.usr_id 
 LEFT JOIN roles r ON r.rol_id = ur.rol_id 
 WHERE usr_username LIKE :search OR usr_fullname LIKE :search OR usr_email LIKE :search`


const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);


let searchParam = {
    
    search: '%'+search+'%' 

}

let searchDB = db.query(searchQuery,searchParam);
write("searchDB", searchDB);





}
}