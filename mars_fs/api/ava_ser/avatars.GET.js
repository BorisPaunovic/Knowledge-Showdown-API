module.exports = (MARSModules) => {
with (MARSModules) {
//vraca sve avatare 

let getAvatar = `http://226d123.e2.mars-hosting.com/api/ava_ser/avatars`

let avatarsQuery = `SELECT ava_id,ava_name,concat('${getAvatar}/',ava_id)AS ava_imge FROM avatars`
	let perId = 37;

  const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);


let avatarsDB = db.query(avatarsQuery);

if(avatarsDB.rows==0)
{
  response.status(404);
  write('message', 'No avatars avalable');
  exit();
}
write('avatars',avatarsDB);



}
}