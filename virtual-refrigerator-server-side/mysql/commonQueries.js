const { query } = require('express');
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
const doesUserExistById = async (id) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT `username` FROM `users` WHERE `id` = ?  ',
        timeout: 40000,
        values:[id]
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
        sql : 'SELECT r.*, u.username FROM `refrigerators` r INNER JOIN `users` u  ON u.id = r.owner_id AND r.owner_id = ?  ',
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
const getRefrigeratorById = async (id) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT * FROM `refrigerators` WHERE `id` = ?  ',
        timeout: 40000,
        values:[id]
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
    const status = itemInformation["status"] || 'NORMAL';
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
const updateItemQuantity = async (itemId,refrigeratorId,quantity) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'UPDATE `items` SET `quantity` = ?  ' +
        'WHERE `refrigerator_id` = ? AND `id` = ?  ',
        timeout: 40000,
        values:[quantity,refrigeratorId,itemId]
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
const editItem  = async (itemInformation) =>{
    const id = itemInformation["id"];
    const itemName = itemInformation["item_name"];
    const expirationDate = itemInformation["expiration_date"];
    const quantity = itemInformation["quantity"] ? itemInformation["quantity"] : 1;
    const status = itemInformation["status"];
    const refrigeratorId = itemInformation["refrigerator_id"];
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'UPDATE `items` SET `item_name` = ? , `expiration_date` = ? , `quantity` = ? , `status` = ? ' +
         'WHERE `refrigerator_id` = ? AND `id` = ?  ',
        timeout: 40000,
        values:[itemName,expirationDate,quantity,status,refrigeratorId,id]
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
const getItemByRefrigeratorIdAndBarCode = async (refrigeratorId,barCode) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT * FROM `items` WHERE `refrigerator_id` = ? AND `bar_code` = ?',
        timeout: 40000,
        values:[refrigeratorId, barCode]
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
const getItemByRefrigeratorIdAndId = async (id,refrigeratorId)=>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT * FROM `items` WHERE `refrigerator_id` = ? AND `id` = ?',
        timeout: 40000,
        values:[refrigeratorId, id]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);
    return result;
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
const changeStatusOfExpiredItems = async () =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const normal ="NORMAL";
    const expired = "EXPIRED";
    const query = util.promisify(connection.query).bind(connection);
    let expiredRefrigerators = await query({
        sql : 'SELECT * from `items` WHERE `expiration_date`  <=  NOW() AND `status` = ?',
        timeout : 10000,
        values : [normal]
    })
    let result = await query({
        sql : 'UPDATE `items` SET  `status` = ? ' +
        'WHERE `expiration_date`  <=  NOW() AND `status` = ?',
        timeout: 10000,
        values:[expired,normal]
    });
    let results2 = await query({
        sql : 'UPDATE `items` SET  `status` = ? ' +
        'WHERE `expiration_date`  > NOW() AND `status` = ?',
        timeout: 10000,
        values:[normal,expired]
    }); 
    
    connection.end();
    expiredRefrigerators = JSON.stringify(expiredRefrigerators);
    expiredRefrigerators = JSON.parse(expiredRefrigerators);
    return expiredRefrigerators; 
}
const doesUserHasAccessToRefrigerator = async(userId,refrigeratorId) => {
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT * from `users_access` where `refrigerator_id`' +
         ' = ? AND `user_id` = ?' ,
        timeout: 40000,
        values:[refrigeratorId,userId]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);
    return result.length !==0;
}
const getRefrigeratorsWithAccess = async (userId) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT r.*,us.username from  `refrigerators` r inner JOIN `users_access`'
        +' u ON u.user_id = ? AND r.id = u.refrigerator_id iNNER JOIN `users` us ON r.owner_id = us.id' ,
        timeout: 40000,
        values:[userId]
    });
     connection.end();
     result = JSON.stringify(result);
     result = JSON.parse(result);
    return result;
}
const getUsersWithAccess = async (query ,refrigeratorId ) =>{
    let result = await query({
        sql : 'SELECT u.id,u.username,u.email from `users` u INNER JOIN `users_access` a '+
        'ON a.refrigerator_id = ? AND u.id = a.user_id' ,
        timeout: 40000,
        values:[refrigeratorId]
    });
    result = JSON.stringify(result);
    result = JSON.parse(result);
    return result;
}
const getAllUsersWithAccess = async (refrigeratorId) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    const result = await getUsersWithAccess(query,refrigeratorId);
    return result;
}
const takeAccessAway  = async (userId,refrigeratorId) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'DELETE FROM `users_access` where `refrigerator_id` = ? AND `user_id` = ?' ,
        timeout: 40000,
        values:[refrigeratorId,userId]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);
    return result.affectedRows !==0;
}
const giveUserAccessToRefrigerator = async (addedUserId,refrigeratorId) => {
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'INSERT INTO `users_access` (`refrigerator_id`,`user_id`) values (?,?)' ,
        timeout: 40000,
        values:[refrigeratorId,addedUserId]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);
    return result.affectedRows !==0;
}
const searchUsers = async (name) =>{
    const newName = `%${name}%`
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const num = 4
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT `id`,`username`,`email` from `users` WHERE `username` LIKE ?'+
        'ORDER BY `username` asc LIMIT ?  ',
        timeout: 40000,
        values:[newName,num]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);
    return result;
}
const getUserIdsFromRefrigeratorIds = async (refArray) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT `id`,`refrigerator_name`,`owner_id` from `refrigerators` WHERE `id` IN (?)',
        timeout: 40000,
        values:[refArray]
    });
    let result2 = await query({
        sql : 'SELECT `refrigerator_id`,`user_id` from `users_access` WHERE `refrigerator_id` IN (?)',
        timeout: 40000,
        values:[refArray]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);
    result2 = JSON.stringify(result2);
    result2 = JSON.parse(result2);
    return [...result,...result2];
}
const getUserEmailsFromUserIds =async (idArray) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT `email` from `users` WHERE `id` IN (?)',
        timeout: 40000,
        values:[idArray]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);
    return result;
}
const lookForItemWithBarcodeInAllItems = async (barcode) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'SELECT * from `all_items` WHERE `barcode` = ?',
        timeout: 40000,
        values:[barcode]
    });
    connection.end();
    result = JSON.stringify(result);
    result = JSON.parse(result);
    return result;
}
const addItemToAllItems = async (item) =>{
    let connection = openConnection();
    if(!connection){
        console.log();
        return;
    }
    const name = item.name;
    const image = item.image;
    const barcode = item.barcode;
    const query = util.promisify(connection.query).bind(connection);
    let result = await query({
        sql : 'INSERT INTO `all_items` (`name`,`barcode`,`image`) values (?,?,?)' ,
        timeout: 40000,
        values:[name,barcode,image]
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
    doesUserExistById:doesUserExistById,
    findByUsername : findByUsername,
    deleteByUserId : deleteByUserId,
    getAllRefrigeratorsByUserId:getAllRefrigeratorsByUserId,
    addRefrigerator:addRefrigerator,
    getRefrigeratorByUserIdAndRefrigeratorId:getRefrigeratorByUserIdAndRefrigeratorId,
    getRefrigeratorById : getRefrigeratorById,
    deleteRefrigeratorByUserIdAndRefrigeratorId :deleteRefrigeratorByUserIdAndRefrigeratorId,
    updateRefrigeratorByUserIdAndRefrigerator : updateRefrigeratorByUserIdAndRefrigerator,
    addNewItem : addNewItem,
    deleteItem : deleteItem,
    getAllItemsInRefrigerator : getAllItemsInRefrigerator,
    getPersonalItemByOwnerIdAndbarCode:getPersonalItemByOwnerIdAndbarCode,
    getAllPersonalItemsByOwnerId:getAllPersonalItemsByOwnerId,
    addPersonalItem:addPersonalItem,
    deletePersonalItem:deletePersonalItem,
    editItem: editItem,
    getItemByRefrigeratorIdAndBarCode : getItemByRefrigeratorIdAndBarCode,
    getItemByRefrigeratorIdAndId : getItemByRefrigeratorIdAndId,
    updateItemQuantity : updateItemQuantity,
    changeStatusOfExpiredItems : changeStatusOfExpiredItems,
    doesUserHasAccessToRefrigerator : doesUserHasAccessToRefrigerator,
    giveUserAccessToRefrigerator : giveUserAccessToRefrigerator,
    takeAccessAway : takeAccessAway,
    searchUsers : searchUsers,
    getRefrigeratorsWithAccess : getRefrigeratorsWithAccess,
    getAllUsersWithAccess : getAllUsersWithAccess,
    getUserIdsFromRefrigeratorIds,
    getUserEmailsFromUserIds,
    lookForItemWithBarcodeInAllItems,
    addItemToAllItems
}
