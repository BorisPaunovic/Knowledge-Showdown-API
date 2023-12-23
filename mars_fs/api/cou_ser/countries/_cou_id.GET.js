module.exports = (MARSModules) => {
with (MARSModules) {
let cou_id = param("cou_id",null);

let couImgQuery = `	SELECT cou_img
    FROM countries
    WHERE cou_id =?`


//vraca zemlju po id

let couImgDB = db.query(couImgQuery,cou_id);

if(couImgDB.rows==0)
{
  response.status(404);
  write('message', 'Country not found');
  exit();
}


write(couImgDB[0].cou_img);
}
}