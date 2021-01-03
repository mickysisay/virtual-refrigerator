const app = require('./personalItems')
const basicUtils = require('../utils');

app.get("/api/access/",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.getAllUsersWithAccess(req,res);
});

app.post("/api/access/give",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.giveUserAccess(req,res);
});

app.post("/api/access/remove",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.takeAccessAway(req,res);
});

module.exports = app;