const mysql = require('mysql');
const util = require('util');

function openConnection(){
    const connection = mysql.createConnection({
        host     : '127.0.0.1',
        port:'3306',
        user     : 'virtual-refrigerator',
        password : 'mickysisay',
        database:'virtual-refrigerator'
      });
      connection.connect(function(err) {
        if (err) {
         // console.error('error connecting: ' + err.stack);
          return;
        }
       
       // console.log('connected as id ' + connection.threadId);
      });
     return connection; 
}

const addUserToDatabase = async (userInfo)=> {
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql:'INSERT INTO `users` (`id`,`username`,`password`,`email`) VALUES (?,?,?,?)',
        timeout : 40000,
        values:[userInfo.id,userInfo.username,userInfo.password,userInfo.email.trim()]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);  
    return result.length;
}
const doesUsernameExist = async (username) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT `username` FROM `users` WHERE `username` = ?  ',
        timeout: 40000,
        values:[username]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);  
    return result.length!==0;
}
const doesEmailExist = async (email) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT `username` FROM `users` WHERE `email` = ?  ',
        timeout: 40000,
        values:[email]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);  
    return result.length!==0;
}
const findByUsername = async (username) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT * FROM `users` WHERE `username` = ?  ',
        timeout: 40000,
        values:[username]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);  
    return result[0];
}
const deleteByUserId = async (userId) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'DELETE FROM `users` WHERE `id` = ?  ',
        timeout: 40000,
        values:[userId]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);  
    return result;
}
module.exports = {
    addUserToDatabase: addUserToDatabase,
    doesUsernameExist : doesUsernameExist,
    doesEmailExist : doesEmailExist,
    findByUsername : findByUsername,
    deleteByUserId : deleteByUserId
}