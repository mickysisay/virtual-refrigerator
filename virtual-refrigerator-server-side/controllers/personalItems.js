const app = require('./items')
const basicUtils = require('../utils');


//add personal item
app.post("/api/personal_item/add",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.addPersonalItem(req,res);
});

//delete personal item
app.post("/api/personal_item/remove",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.deletePersonalItem(req,res);
});
//get personal item

app.get("/api/personal_item",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.getPersonalItem(req,res);
});

module.exports = app;