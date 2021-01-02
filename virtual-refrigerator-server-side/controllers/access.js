const app = require('./personalItems')
const basicUtils = require('../utils');

app.get("/api/access/",basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.getAllUsersWithAccess(req,res);
});

module.exports = app;