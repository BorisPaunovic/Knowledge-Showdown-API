module.exports = (MARSModules) => {
with (MARSModules) {
//vraca sve kategorije (za admina i super admina) 

let getCategory = `http://226d123.e2.mars-hosting.com/api/adm_ser/categories/cat_id_img`
let allCategoriesQuery = `SELECT cat_id,cat_name,cat_description,cat_is_deleted,concat('${getCategory}/',cat_id)AS cat_img FROM categories `
let perId = 10;

const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);
 

let categories = db.query(allCategoriesQuery);
if(categories.length>0)
{

response.status(200)
write('message', 'Sucsessful request returns all categories');
write('categories', categories);
}

else{
 response.status(204)
write('message', 'No categories avalable');
}




}
}