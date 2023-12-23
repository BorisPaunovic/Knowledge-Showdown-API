module.exports = (MARSModules) => {
with (MARSModules) {
let email = param('email', null)
let password = param('password', null)
let fullname = param('fullname', null)
let username = param('username', null)
let cou_id = param('cou_id',null);


//unos novog korisnika

write('email', email);
write('password', password);
write('fullname', fullname);
write('username', username);
write('cou_id', cou_id);

if(!email || !password || !fullname || !username||!cou_id){
  write("msg", "Parameter is missing")
  exit();
}

let sql = 'SELECT u.usr_id, u.usr_email FROM users u WHERE u.usr_email = ?'
let getUserbyEmailQuery = db.query(sql, email)

if(getUserbyEmailQuery.rows > 0){ //provera da li email vec postoji
  response.status(401);
  write("err", "Email already taken")
  exit() 
}

let sql2 = 'SELECT u.usr_id FROM users u WHERE u.usr_username = ?'
let getUserByUsernameQuery = db.query(sql2, username)

if(getUserByUsernameQuery.rows > 0){ //provera da li username vec postoji
  response.status(402);
  write("err", "Username already taken")
  exit() 
}

let avaIdQuery = 'SELECT ava_id FROM avatars ORDER BY RAND() LIMIT 1'
let avaIdDB = db.query(avaIdQuery);


let couIdQuery = 'SELECT cou_id FROM countries where cou_id = ?'
let couIdDB = db.query(couIdQuery,cou_id);

if(couIdDB.rows==0)
{
  write('error', "Country does not exist");
  exit();
}


let insertSql = `INSERT INTO users (usr_fullname, usr_email,
 usr_password, usr_username,ava_id,cou_id ) 
 VALUES (:usr_fullname, :usr_email, :usr_password, :usr_username,:ava_id,:cou_id )`


 let insertParams = {
  usr_fullname: fullname.trim(),
  usr_email: email.trim(),
  usr_password: bcrypt(password),
  usr_username: username.trim(),
  ava_id : avaIdDB[0].ava_id,
  cou_id:cou_id
 }
 
 let insertQuery = db.query(insertSql, insertParams)

 let newId = insertQuery[0].id

let userRoleQuery = db.query(`INSERT INTO users_roles SET usr_id = ?`, newId)

 write('usr_id', newId)
 write('ok', 'success')

 
}
}