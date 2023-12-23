module.exports = (MARSModules) => {
with (MARSModules) {
 let getAvatar = `http://226d123.e2.mars-hosting.com/api/ava_ser/avatars`
 
 let leaderboardQuery2 = `
SELECT 
  c.cat_id,
  c.cat_name,
  CONCAT('[', GROUP_CONCAT(
    JSON_OBJECT(
      'usr_id', avs.usr_id,
      'usr_username', u.usr_username,
      'ave_AverageScore', avs.ave_AverageScore
    ) ORDER BY avs.ave_AverageScore DESC SEPARATOR ',' LIMIT 10
  ), ']') as userScores
FROM categories AS c
LEFT JOIN averageScores as avs 
ON avs.cat_id = c.cat_id
LEFT JOIN users as u
ON avs.usr_id = u.usr_id
GROUP BY c.cat_id
ORDER BY u.usr_id IS NULL ASC,c.cat_name ASC
`

let leaderboardQuery = `
SELECT 
  c.cat_id,
  c.cat_name,
  CONCAT('[', GROUP_CONCAT(
    JSON_OBJECT(
    'ava_id',a.ava_id,
    'ava_img',concat('${getAvatar}/',a.ava_id),
      'usr_id', avs.usr_id,
      'usr_username', u.usr_username,
      'ave_AverageScore', avs.ave_AverageScore
    ) ORDER BY avs.ave_AverageScore DESC SEPARATOR ',' LIMIT 10
  ), ']') as userScores
FROM categories AS c
LEFT JOIN averageScores as avs 
ON avs.cat_id = c.cat_id
LEFT JOIN users as u
ON avs.usr_id = u.usr_id
LEFT JOIN avatars AS a 
ON u.ava_id = a.ava_id
GROUP BY c.cat_id
ORDER BY u.usr_id IS NULL ASC,c.cat_name ASC
`

//vraca sve kategorije (i one koje nemaju igrace,na prvom mestu redja kategorije koje imaju bar jednog igraca a na drugom vraca sver prazne kategorije i sortira ih po imenu) ,10 najboljih igraca za konkretnu kategoriju ,njegov score

let leaderboardDB = db.query(leaderboardQuery);
write('msg', 'dssdd');



if(leaderboardDB.length>0) {
  let parsedleaderboard =[];
   let row_num = 1;
  for(let i = 0;i<leaderboardDB.length;i++){
    let pleaderboard = {
       
      cat_id:leaderboardDB[i].cat_id,
      cat_name:leaderboardDB[i].cat_name,
        userScores:JSON.parse(leaderboardDB[i].userScores),
       
  }
    
  parsedleaderboard.push(pleaderboard);
 }
  response.status(200)
  write('message', 'Return Leaderboards for all categories');
  write('leaderboard', parsedleaderboard);
} else {
 response.status(204)
write('message', 'No leaderboard data avalable');
}

}
}