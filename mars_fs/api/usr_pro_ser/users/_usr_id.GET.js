module.exports = (MARSModules) => {
with (MARSModules) {
let usr_id = param("usr_id",-1);
let getAvatar = `http://226d123.e2.mars-hosting.com/api/ava_ser/avatars`
let getCountry = `http://226d123.e2.mars-hosting.com/api/cou_ser/countries`

//user profile servis

let userQuery =   `
SELECT  u.usr_username,u.usr_fullname,u.usr_email,a.ava_id,a.ava_name,concat('${getAvatar}/',
u.ava_id)AS ava_imge,c.cou_id,c.cou_name,concat('${getCountry}/',u.cou_id)AS cou_imge
FROM users AS u 
LEFT JOIN countries AS c
ON u.cou_id = c.cou_id
LEFT JOIN avatars AS a
ON u.ava_id = a.ava_id
WHERE u.usr_id =:usr_id`


let userRankQuery = `
SELECT 
    userRanks.cat_name, 
    userRanks.ave_AverageScore, 
    userRanks.rank
FROM (
    SELECT 
        c.cat_name, 
        avs.ave_AverageScore, 
        RANK() OVER (PARTITION BY c.cat_id ORDER BY avs.ave_AverageScore DESC) as rank,
        avs.usr_id
    FROM 
        categories AS c
    LEFT JOIN 
        averageScores AS avs ON c.cat_id = avs.cat_id
) as userRanks
WHERE 
    userRanks.usr_id = :usr_id
ORDER BY 
    userRanks.ave_AverageScore DESC;


`

let userGamesQuery = `SELECT g.game_created,c.cat_name,g.gam_status,TIMEDIFF(g.gam_finished,g.game_created) AS Duration,g.gam_score
FROM  games AS g
LEFT JOIN categories AS c
ON g.cat_id = c.cat_id
WHERE g.usr_id = :usr_id
ORDER BY g.game_created DESC`

let perId = 43;

 const permissionValidations = include(".shared/permissionValidations")
permissionValidations.checkIsLoggedIn();
permissionValidations.checkPermissions(perId);


let userParams = {
 usr_id:usr_id
}

if(usr_id>-1)
{
  
  let userDB = db.query(userQuery,userParams);
  let userRankDB = db.query(userRankQuery,userParams);
  let userGamesDB = db.query(userGamesQuery,userParams);
  
  if(userDB.rows==0)
  {
    write('message', 'User not found');
    exit();
  }
 
  write('user', userDB);
  write('userRank', userRankDB);
  write('userGames', userGamesDB);  
}

else
{
  write('message', 'Bad params');
  exit();
}


}
}