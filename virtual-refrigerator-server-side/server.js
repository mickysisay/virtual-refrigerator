const app = require('./controllers/personalItems')
const cron = require('node-cron');
const commonQueries = require('./mysql/commonQueries')
app.listen(5000,  ()=>{
    cron.schedule('* * * * *',async () => {
          await commonQueries.changeStatusOfExpiredItems()
      });
    console.log("server started on port 5000")});