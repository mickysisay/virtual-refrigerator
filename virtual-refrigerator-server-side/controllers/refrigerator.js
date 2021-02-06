const app = require('./app')
const basicUtils = require('../utils');

//get all refrigerators by userId
app.get("/api/refrigerator",basicUtils.verifyToken,async (req,res)=>{
   await basicUtils.getRefrigeratorFromUserId(req,res);
});

//get individial refrigerator
app.get("/api/refrigerator/:id",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.getRefrigeratorFromUserIdAndRefrigeratorId(req,res);
 });
//add refrigerator
app.post("/api/refrigerator/add", basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.addRefirgerator(req,res);
});
//remove refrigerator using id
app.post("/api/refrigerator/remove/:id",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.deleteRefrigerator(req,res);
})
//edit refrigerator
app.post("/api/refrigerator/update/:id",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.updateRefrigerator(req,res);
})

module.exports = app;