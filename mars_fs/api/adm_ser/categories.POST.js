module.exports = (MARSModules) => {
with (MARSModules) {
let addNewCategoryQuery = "INSERT INTO categories(cat_name,cat_description,cat_img) VALUES(:cat_name,:cat_description,:cat_img)"
let catFromDbQuerry = `SELECT cat_id,cat_name,cat_description,cat_is_deleted FROM categories WHERE cat_name = :cat_name`

//unos nove kategorije


let cat_name = param("cat_name",null);
let cat_description = param("cat_description",null);
let File = param("file",null);

write('cat_name', cat_name);
write('cat_description', cat_description);
write('file', File );

let catId = 15;
const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(catId);


let categoryParams={
  cat_name: cat_name.trim(),
  cat_description: cat_description.trim(),
  cat_img:File
}
const validate = include(".shared/validate")
//dodaje novu kategoriju bez uvezivanja sa pitanjima 
let catFromDb = db.query(catFromDbQuerry,categoryParams);



 


let catNameCheck = validate.cat_name(cat_name);
let catDescriptionCheck = validate.cat_description(cat_description);
let catImgCheck = validate.checkImage(File);
write('catImgCheck', catImgCheck);

if(catFromDb.length === 0 && !catNameCheck && !catDescriptionCheck && !catImgCheck){
  

 let addNewCategoryDb= db.query(addNewCategoryQuery,categoryParams);
 response.status(200) 
 write('message', "You've successfuly added new category");

exit();

}
 else
 {
    response.status(400) 
 write('message', 'Bad request, invalid parameters');
 exit();
 }
 


}
}