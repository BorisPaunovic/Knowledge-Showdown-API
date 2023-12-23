module.exports = (MARSModules) => {
with (MARSModules) {
// vraca sve korisnike i njihove role osim super admina
let allUsersQuery = `SELECT u.usr_id, u.usr_username , u.usr_fullname, u.usr_email,
 u.cou_id, u.ava_id, u.usr_is_deleted, r.rol_name 
 FROM users u
LEFT JOIN users_roles ur ON ur.usr_id = u.usr_id 
LEFT JOIN roles r ON r.rol_id = ur.rol_id
WHERE ur.rol_id = 6 OR ur.rol_id = 7`
let perId = 5;
const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId)
let users = db.query(allUsersQuery);
write('users', users);
 
 


 
 



}
}