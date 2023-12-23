module.exports = (MARSModules) => {
with (MARSModules) {
 let ava_id = param("ava_id",null);

let avaImgQuery = `	SELECT ava_img
    FROM avatars
    WHERE ava_id =?`

//vraca avatara po id

let avaImgDB = db.query(avaImgQuery,ava_id);

if(avaImgDB.rows==0)
{
  response.status(404);
  write('message', 'Avatar not found');
  exit();
}


write(avaImgDB[0].ava_img);
}
}