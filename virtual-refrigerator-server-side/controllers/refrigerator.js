const app = require('./app')
const basicUtils = require('../utils');

app.get("/api/refrigerator",basicUtils.verifyToken,async (req,res)=>{
   await basicUtils.getRefrigeratorFromUserId(req,res);
});
app.get("/api/refrigerator/:id",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.getRefrigeratorFromUserIdAndRefrigeratorId(req,res);
 });

app.post("/api/refrigerator/add", basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.addRefirgerator(req,res);
});
app.post("/api/refrigerator/remove/:id",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.deleteRefrigerator(req,res);
})
app.post("/api/refrigerator/update/:id",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.updateRefrigerator(req,res);
})

module.exports = app;