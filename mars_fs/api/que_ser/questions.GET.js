module.exports = (MARSModules) => {
with (MARSModules) {

 

let gam_id = param("gam_id",null);

let gameTimeLength = `SELECT TIME_TO_SEC(TIMEDIFF(NOW(), g.game_created)) / 60 as gameTime
FROM games AS g
WHERE g.gam_id = :gam_id`
let gameTimeLength2 = `SELECT TIMEDIFF(NOW(), g.game_created) as gameTime
FROM games AS g
WHERE g.gam_id = :gam_id`

let perId = 16;
 const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);

let gTameParams = {
  
  gam_id:gam_id
}

if(gam_id===null)
{
   write('msg','Bad params');
  exit();
}

let gameTime = db.query(gameTimeLength2,gTameParams);
write('gameTime', gameTime[0].gameTime);

if(gameTime[0].gameTime>"00:10:00"){
 
  response.status(408);
  write('FinishedGameMessage','Time`s up GAME OVER');
 
}

}
}