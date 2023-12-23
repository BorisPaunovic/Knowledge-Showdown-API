module.exports = (MARSModules) => {
with (MARSModules) {
let usr_id = param("usr_id",null);
let usr_username = param("usr_username",null);
let usr_fullname = param("usr_fullname",null);
 
let cou_id = param("cou_id",null);
let ava_id = param("ava_id",null);

//user profile servis
 //update svog profila

let validate = include('.shared/validate');

let perId = 9;

 const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);

let user_session = session("user")

if(usr_id != user_session.usr_id ){
   response.status(403);
   write('message', 'Forbidden action');
   exit();
}


let updateUserQuery = `UPDATE users
SET usr_username =:usr_username ,usr_fullname =:usr_fullname,cou_id =:cou_id,ava_id =:ava_id
WHERE usr_id =:usr_id`
let countryQuery = 'SELECT cou_id FROM countries WHERE cou_id = ?';
let avatarQuery = 'SELECT ava_id FROM avatars  WHERE ava_id = ?';
let userQuery = 'SELECT usr_id FROM users  WHERE usr_id = ?';

let updateUserParams ={
  usr_id:usr_id,
  usr_username:usr_username.trim(),
  usr_fullname:usr_fullname.trim(),
  cou_id:cou_id,
  ava_id:ava_id
}

let countryDB = db.query(countryQuery,cou_id);
let avatarDB = db.query(avatarQuery,ava_id);
let userDB = db.query(userQuery,usr_id);


let usernameCheck = validate.username(usr_username);
let nameCheck =validate.name(usr_fullname);



if(userDB.rows == 0)
{
  response.status(404)
  write('uMessage', 'User does not exist');
  exit();
}
if(countryDB.rows == 0)
{
  response.status(404)
  write('uMessage', 'Country does not exist');
  exit();
}
if(avatarDB.rows == 0)
{
  response.status(404)
  write('uMessage', 'Avatar does not exist');
  exit();
}

if(usernameCheck||nameCheck)
{
  write('usernameCheck', usernameCheck);
    write('nameCheck', nameCheck);
   
  response.status(400)
  write('uMessage', 'Bad parameters');
  exit();
}


let updateUserDB = db.query(updateUserQuery,updateUserParams);


//retrieving all the data - I need it for front

let getAvatar = `http://226d123.e2.mars-hosting.com/api/ava_ser/avatars`
let getCountry = `http://226d123.e2.mars-hosting.com/api/cou_ser/countries`
let editedUserQuery =   `
SELECT  u.usr_username,u.usr_fullname,u.usr_email,a.ava_id,a.ava_name,concat('${getAvatar}/',
u.ava_id)AS ava_imge,c.cou_id,c.cou_name,concat('${getCountry}/',u.cou_id)AS cou_imge
FROM users AS u 
LEFT JOIN countries AS c
ON u.cou_id = c.cou_id
LEFT JOIN avatars AS a
ON u.ava_id = a.ava_id
WHERE u.usr_id =:usr_id`

let userParams = {
 usr_id:usr_id
}

if(usr_id>-1)
{
  let editedUserDB = db.query(editedUserQuery,userParams);
  
  if(editedUserDB.rows==0)
  {
    write('message', 'User not found');
    exit();
  }
 
  write('user', editedUserDB);
  response.status(200);
write('updateSuccess', 'Update successful');
}











}
}