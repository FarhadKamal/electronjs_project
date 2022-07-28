
const {dialog} = require('electron')

function getConnectionString(){
  const conJSON= {
    'host'     : 'localhost',
    'user'     : 'root',
    'password' : null,
    'database' : 'wood'} 

    return conJSON
  }

 function dblost(){

  dialog.showErrorBox('Database Connection', 'Plesae check the database connection!')
 } 

module.exports = { getConnectionString,dblost};  