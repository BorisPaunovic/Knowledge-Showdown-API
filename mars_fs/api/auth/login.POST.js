module.exports = (MARSModules) => {
with (MARSModules) {
let email = param("email", null);
let password = param("password", null)

if(!email || !password){
  write("msg", "Parameter is missing")
  exit();
}
//logovanje korisnika
//validacija

let validate = include('.shared/validate')

let emailCheck = validate.email(email)
if(emailCheck){
  write("msg", emailCheck)
  exit();
}

let passCheck = validate.password(password)
if(passCheck){
  write("msg", passCheck)
  exit()
}



let sqlParams = {
  "email": email.trim(),
  "password": password.trim()
}
let getAvatar = `http://226d123.e2.mars-hosting.com/api/ava_ser/avatars`

let getCountry = `http://226d123.e2.mars-hosting.com/api/cou_ser/countries`

 

 
let findUser = db.query(`SELECT
  u.usr_id,
  u.usr_username, 
  u.usr_password,
  u.usr_fullname,
  u.usr_email,
  c.cou_id,
  c.cou_name,
  concat('${getCountry}/',c.cou_id)AS cou_imge,
  a.ava_id,
  a.ava_name,
  concat('${getAvatar}/',a.ava_id)AS ava_imge,
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
LEFT JOIN avatars AS a 
ON u.ava_id=a.ava_id
LEFT JOIN countries AS c
ON u.cou_id = c.cou_id  
WHERE
  u.usr_email =:email
GROUP BY
  u.usr_id`,sqlParams);




// check if user exists

if(findUser.rows === 0){
  write("msg", "Email or password is incorrect")
  response.status(401);
  exit();
}

let dbUser = findUser[0];


// provera za ukoliko je blocked/deleted vrati status code 403

if(dbUser.usr_is_deleted !== null){
  write("msg", "Forbidden to login! Please contact support!")
  response.status(403);
  exit();
}

let dbPass = dbUser.usr_password;
let passIsOk = bcrypt(password, dbPass);

if(!passIsOk){
  write("Email or password is incorrect")
    response.status(401);
  exit();
}




  
  let sessionUser= {
      "usr_id":dbUser.usr_id,
      "usr_username":dbUser.usr_username,
      "usr_fullname":dbUser.usr_fullname,
      "usr_email":dbUser.usr_email,
      "cou_id":dbUser.cou_id,
     "cou_name":dbUser.cou_name,
     "cou_imge":dbUser.cou_imge,
      "is_deleted":dbUser.is_deleted,
      "rol_id":dbUser.rol_id,
      "rol_name":dbUser.rol_name,
      "permissions":JSON.parse(dbUser.permissions),
      "ava_id":dbUser.ava_id,
      "ava_name":dbUser.ava_name,
      "ava_imge":dbUser.ava_imge
      
 }


let sid = session();

session("user", sessionUser)

let test = session("user")
write("testiram da li ima nesto u session", test)

write('status', 200)
write("msg", "Login successfully done.");
write("sid", sid)
write('sessionUser', sessionUser)



}
}