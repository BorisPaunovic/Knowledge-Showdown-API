module.exports = (MARSModules) => {
with (MARSModules) {
let usr_id = param("usr_id",null);
let usr_password_old = param("usr_password_old",null);
let usr_password_new = param("usr_password_new",null);
let user_session = session('user')

let oldPasswordQuery = `SELECT usr_password FROM users WHERE usr_id =?`
let updatePasswordQuery = `UPDATE users SET usr_password =:usr_password WHERE usr_id=:usr_id`

const validate = include(".shared/validate")

let perId = 44;

 const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);
if(usr_id != user_session.usr_id ){
   response.status(403);
   write('message', 'Forbidden action');
   exit();
}


let oldUserPasswordDB = db.query(oldPasswordQuery,usr_id);
let checkUserDB = db.query('SELECT usr_id FROM users WHERE usr_id = ?',usr_id);

if(checkUserDB.rows ==0)
{
  response.status(404);
  write('message', 'User not found');
  exit();
}

let compareOldPasswords = bcrypt(usr_password_old,oldUserPasswordDB[0].usr_password);
let checkPassword = validate.password(usr_password_new);




if(usr_id==-1)
{
   response.status(400);
  write('message', 'Bad parameters');
  exit();
}

let passwordParams = {
  usr_id:usr_id,
  usr_password : bcrypt(usr_password_new.trim())
}



if(oldUserPasswordDB.rows==0)
{
  response.status(404);
  write('message', 'User not found');
  exit();
}
if(checkPassword)
{
  response.status(405);
  write('message', 'Password not sufficient');
  write('pMessage', checkPassword);
  exit();
}
if(compareOldPasswords==false)
{
  response.status(402);
  write('message', ' Provided `Old` password does not match true old pasword');
  exit();
}

let compareNewPassword = bcrypt(usr_password_new,oldUserPasswordDB[0].usr_password);
//write('dsad', compareNewPassword);
if(compareNewPassword==true)
{
  response.status(406);
  write('message', 'New password can`t match old password');
  exit();
}


let updatePasswordBD = db.query(updatePasswordQuery,passwordParams);
  response.status(200);
write('message', "Password is succsessfully updated");





}
}