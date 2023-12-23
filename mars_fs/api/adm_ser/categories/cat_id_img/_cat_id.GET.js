module.exports = (MARSModules) => {
with (MARSModules) {
let cat_id = param("cat_id",null);
// Sluzi za dohvatanje slike po url

let catImgQuery = `	SELECT cat_img
    FROM categories
    WHERE cat_id =?`


let catImgDB = db.query(catImgQuery,cat_id);

if(catImgDB.rows==0)
{
  response.status(404);
  write('message', 'Category not found');
  exit();
}


write(catImgDB[0].cat_img);
}
}