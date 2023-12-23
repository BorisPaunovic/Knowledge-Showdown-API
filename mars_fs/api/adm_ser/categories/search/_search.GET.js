module.exports = (MARSModules) => {
with (MARSModules) {
let search =  param("search",null);
// radi pretragu svih kategorija(za admina i super admina)
let getCategory = `http://226d123.e2.mars-hosting.com/api/adm_ser/categories/cat_id_img`
let searchQuery = `SELECT cat_id,cat_name,cat_description,cat_is_deleted,concat('${getCategory}/',cat_id)AS cat_img FROM categories  WHERE cat_name LIKE :search`
 
 let perId = 12;

const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);


let searchParam = {
    
    search: '%'+search+'%' 

}

let searchDB = db.query(searchQuery,searchParam);
write("searchDB", searchDB);




}
}