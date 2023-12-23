module.exports = (MARSModules) => {
with (MARSModules) {
/*
let deleteCategoryQuery = 'UPDATE categories SET cat_is_deleted = NOW() WHERE cat_id = :cat_id'
let restoreCategoryQuery = 'UPDATE categories SET cat_is_deleted = NULL WHERE cat_id = :cat_id'
let catFromDbQuery  = 'SELECT cat_id,cat_name,cat_description,cat_is_deleted  FROM categories WHERE cat_id = :cat_id'
let  cat_id = param("cat_id",null);

let perId = 13;

const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);


let catecategoryParams={
  cat_id:cat_id
}

let catFromDb= db.query(catFromDbQuery,catecategoryParams);

if(catFromDb.length>0)
{
 
 if(catFromDb[0].cat_is_deleted === null)
 {
  let categoryDb = db.query(deleteCategoryQuery,catecategoryParams);
write('message', "You've successfuly deleted category");
 response.status(200) 
 }
 else
 {
  let categoryDb = db.query(restoreCategoryQuery,catecategoryParams);
write('message', "You've successfuly restored category");
 response.status(200) 
 }

 
}
else
{
  response.status(500)
  write('message', 'There is no category with that id in database ');

}
*/
}
}