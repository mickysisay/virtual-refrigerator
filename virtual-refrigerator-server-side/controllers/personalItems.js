const app = require('./items')
const basicUtils = require('../utils');


//add personal item
app.post("/api/personal_item/add",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.addPersonalItem(req,res);
});

app.get("/api/personal_item/lookup",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.getBarCodeInfo(req,res);
})
//delete personal item
app.post("/api/personal_item/remove",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.deletePersonalItem(req,res);
});
//get personal item using id

app.get("/api/personal_item",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.getPersonalItem(req,res);
});

//get all personal items
app.get("/api/personal_item/all",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.getAllPersonalItems(req,res);
});

module.exports = app;