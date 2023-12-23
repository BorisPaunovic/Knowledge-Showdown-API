module.exports = (MARSModules) => {
with (MARSModules) {


let getCountry = `http://226d123.e2.mars-hosting.com/api/cou_ser/countries`

let countriesQuery = `SELECT cou_id,cou_name,concat('${getCountry}/',cou_id)AS cou_imge FROM countries`

//vraca sve zemlje

let countriesDB = db.query(countriesQuery);

if(countriesDB.rows==0)
{
  response.status(404);
  write('message', 'No countries avalable');
  exit();
}
write('countries',countriesDB);

}
}