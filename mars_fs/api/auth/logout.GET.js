module.exports = (MARSModules) => {
with (MARSModules) {
let sessionUser = session('user');

//logout korisnika

if(!sessionUser){
  write('msg', 'not logged in');
  exit();
}

session.close();
write('msg', 'logged out successfully');

}
}