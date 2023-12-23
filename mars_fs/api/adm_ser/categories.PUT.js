module.exports = (MARSModules) => {
with (MARSModules) {
let updatecategoryQuery = `UPDATE categories SET cat_name =:cat_name, cat_description=:cat_description WHERE cat_id = :cat_id  `
let getCategoryFromDb = 'SELECT cat_id,cat_name,cat_description,cat_is_deleted FROM categories WHERE cat_id = :cat_id'
let updateCategoryImgQuery = 'UPDATE categories SET cat_img=:cat_img WHERE cat_id = :cat_id  '

// radi izmenu kategorije
let cat_name = param("cat_name",null);
let cat_description = param("cat_description",null);
let cat_id = param("cat_id",null);
let File = param("file",null);

write('file', File );


let perId = 14;

const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);


let updateParams={

  cat_name:cat_name.trim(),
  cat_description:cat_description.trim(),   
  cat_id :cat_id,
 cat_img:File
}


let categoryFromDb = db.query(getCategoryFromDb,updateParams);
 const validate = include(".shared/validate")

 let catImgCheck = validate.checkImage(File);

let catNameCheck = validate.cat_name(cat_name);
let catDescriptionCheck = validate.cat_description(cat_description);
if(categoryFromDb.length > 0 && !catNameCheck && !catDescriptionCheck ){
  
  if(catImgCheck!='Not a image')
  {
    let updateCategoryImgDb= db.query(updateCategoryImgQuery,updateParams);
 response.status(200) 
write('ImgMessage', "You've successfuly updated  category image");
  }

let updateCategoryDb= db.query(updatecategoryQuery,updateParams);
 response.status(200) 
write('message', "You've successfuly updated  category");

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