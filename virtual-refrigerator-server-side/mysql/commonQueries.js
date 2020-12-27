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
const getAllRefrigeratorsByUserId = async (userId) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT * FROM `refrigerators` WHERE `owner_id` = ?  ',
        timeout: 40000,
        values:[userId]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);  
    return result;
}
const addRefrigerator = async (refrigeratorData) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql:'INSERT INTO `refrigerators` (`id`,`refrigerator_name`,`owner_id`) VALUES (?,?,?)',
        timeout : 40000,
        values:[refrigeratorData.id,refrigeratorData.refrigeratorName,refrigeratorData.ownerId]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);  
    return result.length;
}
const getRefrigeratorByUserIdAndRefrigeratorId = async (userId,refrigeratorId) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT * FROM `refrigerators` WHERE `owner_id` = ? AND `id` = ?  ',
        timeout: 40000,
        values:[userId,refrigeratorId]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);  
    return result;
}
const deleteRefrigeratorByUserIdAndRefrigeratorId = async (userId,refrigeratorId) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'DELETE FROM `refrigerators` WHERE `owner_id` = ? AND `id` = ?  ',
        timeout: 40000,
        values:[userId,refrigeratorId]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);  
    return result;
}
const updateRefrigeratorByUserIdAndRefrigerator = async (userId,refrigeratorId,refrigeratorName)=>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'UPDATE `refrigerators` SET `refrigerator_name` = ? WHERE `owner_id` = ? AND `id` = ?  ',
        timeout: 40000,
        values:[refrigeratorName,userId,refrigeratorId]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);  
    return result;
}
const addNewItem = async (itemInformation) =>{
    const id = itemInformation["id"];
    const itemName = itemInformation["item_name"];
    const expirationDate = itemInformation["expiration_date"];
    const quantity = itemInformation["quantity"] ? itemInformation["quantity"] : 1;
    const status = 'NORMAL';
    const refrigeratorId = itemInformation["refrigerator_id"];
    const barCode = itemInformation["bar_code"];
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql:'INSERT INTO `items` (`id`,`item_name`,`expiration_date`,`quantity`,`status`,`refrigerator_id`,`bar_code`) VALUES (?,?,?,?,?,?,?)',
        timeout : 40000,
        values:[id,itemName,expirationDate,quantity,status,refrigeratorId,barCode]
    });
    let resultItems = await query({
        sql : 'SELECT * FROM `items` WHERE `refrigerator_id` = ?  ',
        timeout: 40000,
        values:[refrigeratorId]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);
    resultItems = JSON.stringify(resultItems);
    resultItems = JSON.parse(resultItems);  
    return {success:result.length,response : resultItems};
}
const deleteItem = async (itemId,refrigeratorId) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'DELETE FROM `items` WHERE `id` = ? AND `refrigerator_id` = ? ',
        timeout: 40000,
        values:[itemId,refrigeratorId]
    });
   
    result = JSON.stringify(result);
    result = JSON.parse(result); 
    let resultItems=[];
    if(result.affectedRows !== 0){
         resultItems = await query({
            sql : 'SELECT * FROM `items` WHERE `refrigerator_id` = ?  ',
            timeout: 40000,
            values:[refrigeratorId]
        });
        resultItems = JSON.stringify(resultItems);
        resultItems = JSON.parse(resultItems);  
    } 
    connection.end();
    return {success:result.affectedRows !== 0,response : resultItems};
}
const getAllItemsInRefrigerator = async (refrigeratorId)=>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT * FROM `items` WHERE `refrigerator_id` = ?  ',
        timeout: 40000,
        values:[refrigeratorId]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);
    return result;
}
const getPersonalItemByOwnerIdAndbarCode = async (ownerId,barCode)=>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT * FROM `personal_items` WHERE `owner_id` = ? AND `bar_code` = ?  ',
        timeout: 40000,
        values:[ownerId,barCode]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);
    return result;
}
const getAllPersonalItemsByOwnerId = async (ownerId) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT * FROM `personal_items` WHERE `owner_id` = ?',
        timeout: 40000,
        values:[ownerId]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);
    return result;
}
const addPersonalItem = async (personalItemInformation) =>{
    const id = personalItemInformation["id"];
    const itemName = personalItemInformation["item_name"];
    const ownerId = personalItemInformation["owner_id"];
    const barCode = personalItemInformation["bar_code"];
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql:'INSERT INTO `personal_items` (`id`,`item_name`,`owner_id`,`bar_code`) VALUES (?,?,?,?)',
        timeout : 40000,
        values:[id,itemName,ownerId,barCode]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);
    const resultItems = await getAllPersonalItemsByOwnerId(ownerId);
    console.log(result);
    return {success:result.affectedRows !==0, response:resultItems};
}
const deletePersonalItem = async (personalItemId, ownerId) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'DELETE FROM `personal_items` WHERE `id` = ? AND `owner_id` = ? ',
        timeout: 40000,
        values:[personalItemId,ownerId]
    });
   
    result = JSON.stringify(result);
    result = JSON.parse(result); 
    let resultItems=[];
    if(result.affectedRows !== 0){
         resultItems = await query({
            sql : 'SELECT * FROM `personal_items` WHERE `owner_id` = ?  ',
            timeout: 40000,
            values:[ownerId]
        });
        resultItems = JSON.stringify(resultItems);
        resultItems = JSON.parse(resultItems);  
    } 
    connection.end();
    return {success:result.affectedRows !== 0,response : resultItems};
}
module.exports = {
    addUserToDatabase: addUserToDatabase,
    doesUsernameExist : doesUsernameExist,
    doesEmailExist : doesEmailExist,
    findByUsername : findByUsername,
    deleteByUserId : deleteByUserId,
    getAllRefrigeratorsByUserId:getAllRefrigeratorsByUserId,
    addRefrigerator:addRefrigerator,
    getRefrigeratorByUserIdAndRefrigeratorId:getRefrigeratorByUserIdAndRefrigeratorId,
    deleteRefrigeratorByUserIdAndRefrigeratorId :deleteRefrigeratorByUserIdAndRefrigeratorId,
    updateRefrigeratorByUserIdAndRefrigerator : updateRefrigeratorByUserIdAndRefrigerator,
    addNewItem : addNewItem,
    deleteItem : deleteItem,
    getAllItemsInRefrigerator : getAllItemsInRefrigerator,
    getPersonalItemByOwnerIdAndbarCode:getPersonalItemByOwnerIdAndbarCode,
    getAllPersonalItemsByOwnerId:getAllPersonalItemsByOwnerId,
    addPersonalItem:addPersonalItem,
    deletePersonalItem:deletePersonalItem
}
