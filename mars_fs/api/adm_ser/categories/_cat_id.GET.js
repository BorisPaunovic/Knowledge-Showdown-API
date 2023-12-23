module.exports = (MARSModules) => {
with (MARSModules) {
let cat_id = param("cat_id", null)
let getCategory = `http://226d123.e2.mars-hosting.com/api/adm_ser/categories/cat_id_img`
//vraca kategoriju po id (za admina i superadmina)
let perId = 11



let allCategoriesQuery = `SELECT cat_id,cat_name,cat_description,cat_is_deleted,concat('${getCategory}/',cat_id)AS cat_img FROM categories WHERE cat_id = ? `
 
 
const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);

 


  let category = db.query(allCategoriesQuery, cat_id);
  if(category.length>0){
     response.status(200)
    write('message', 'Sucsessful request returns one category');
    write('category', category); 
  } else{
    response.status(204)
    write('message', 'No categories avalable');
  }


}
}