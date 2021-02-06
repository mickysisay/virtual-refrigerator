const app = require('./controllers/access')
const cron = require('node-cron');
const sendEmail = require('./EmailUtils')
app.listen(5000,  ()=>{
    cron.schedule('*/60 * * * *',async () => {
         sendEmail.sendEmails();
      });
    console.log("server started on port 5000")});