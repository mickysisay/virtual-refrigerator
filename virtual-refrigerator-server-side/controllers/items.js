const app = require('./refrigerator')
const basicUtils = require('../utils');

//add item to refrigertator
app.post("/api/item/add",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.addItemToRefrigerator(req,res);
});
//remove item using id
app.post("/api/item/remove",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.deleteItem(req,res);
});
//get all Items in refrigerator
app.get("/api/item/:id",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.getAllItems(req,res);
});
//edit item name ,status,quantity,expiration_date
app.post("/api/item/edit",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.editItem(req,res);
});
//get item in refrigerator using refrigeratorId and barCode (?refrigerator_id=''&barCode='')
app.get("/api/item/",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.getItemUsingRefrigeratorIdAndBarCode(req,res);
});
//subtract item qunatity using refrigeratorId, itemId and quantity
app.post("/api/item/take",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.takeItemOutOfRefrigerator(req,res);
});
module.exports = app;