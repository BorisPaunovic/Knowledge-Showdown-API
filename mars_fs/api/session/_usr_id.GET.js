module.exports = (MARSModules) => {
with (MARSModules) {
let usr_id = param("usr_id",null);
 
//proverava sessiju

let findUserQuery = `SELECT
  u.usr_id,
  u.usr_username,
  u.usr_password,
  u.usr_fullname,
  u.usr_email,
  u.cou_id,
  u.ava_id,
  u.usr_is_deleted,
  r.rol_id,
  r.rol_name,
  CONCAT('[', GROUP_CONCAT(
    DISTINCT JSON_OBJECT(
      'per_id', p.per_id,
      'per_name', p.per_name
    ) ORDER BY pu.per_id SEPARATOR ','
  ), ',', GROUP_CONCAT(
    DISTINCT JSON_OBJECT(
      'per_id', pu.per_id,
      'per_name', pu.per_name
    ) ORDER BY p.per_id SEPARATOR ','
  ), ']') as permissions
FROM
  users u
LEFT JOIN
  users_roles ur ON ur.usr_id = u.usr_id 
LEFT JOIN
  roles r ON r.rol_id = ur.rol_id
LEFT JOIN
  roles_permissions rp ON r.rol_id = rp.rol_id
LEFT JOIN
  permissions p ON rp.per_id = p.per_id
LEFT JOIN
  users_permissions up ON  u.usr_id = up.usr_id 
LEFT JOIN
  permissions pu ON up.per_id = pu.per_id
WHERE
  u.usr_id =:usr_id
GROUP BY
  u.usr_id`


  let sqlParams = {
  usr_id:usr_id
}


var user_data = session("user");
write("user data", user_data)
if(user_data === null){
  write('message', 'user not logged in');
  response.status(401)
  exit();
}




let findUserDB = db.query(findUserQuery,sqlParams);

if(findUserDB.rows== 0)
{
  write('message','No user for that id');
  response.status(401)
  exit();
}

let dbUser = findUserDB[0];

if(dbUser.usr_is_deleted !== null){
  write("msg", "Forbidden to login! Please contact support!")
  response.status(403);
  exit();
}



  let sessionUser= {
      "usr_id":dbUser.usr_id,
      "usr_username":dbUser.usr_username,
      "usr_fullname":dbUser.usr_fullname,
      "usr_email":dbUser.usr_email,
      "cou_id":dbUser.cou_id,
      "ava_id":dbUser.ava_id,
      "is_deleted":dbUser.is_deleted,
      "rol_id":dbUser.rol_id,
      "rol_name":dbUser.rol_name,
      "permissions":JSON.parse(dbUser.permissions)
      
 }


 

let sid = session();

session("user", sessionUser)
write('status', 200)
write("msg", "Session renewal successfully done.");
write("sid", sid)
write('sessionUser', sessionUser)


}
}