const app = require('./controllers/access')
const cron = require('node-cron');
const sendEmail = require('./EmailUtils')
const commonQueries = require('./mysql/commonQueries')
app.listen(5000,  ()=>{
    cron.schedule('*/59 * * * *',async () => {
         sendEmail.sendEmails();
          //await commonQueries.changeStatusOfExpiredItems()
      });
    console.log("server started on port 5000")});