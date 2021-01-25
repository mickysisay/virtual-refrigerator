const commonQueries = require('./mysql/commonQueries')
const nodemailer = require("nodemailer");

async function main(text,emails) {
  
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "sisaymicky25@gmail.com", // generated ethereal user
        pass: "omabtjfuwpvlmbpb", // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Virtual Refrigerator" <sisaymicky25@gmail.com> ', // sender address
      to: emails, // list of receivers
      subject: "Expired Items", // Subject line
      text: "text", // plain text body
      html: `<b>${text}</b>`, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    
  }
  

function reduceItems(items){
    
    let obj ={};
    items.forEach(e => {
        if(obj[e.refrigerator_id]){
            obj[e.refrigerator_id]["items"].push(e.item_name);
        }else{
            obj[e.refrigerator_id] = {"items" : [e.item_name]};
        }
    });
    return obj;
}

async function getUserIds(obj){
   
   let allRefrigeratorIds =  Object.keys(obj);
   //get all users
   let results = await commonQueries.getUserIdsFromRefrigeratorIds(allRefrigeratorIds);
   
   results.forEach(e=>{
           const id = e.id || e.refrigerator_id;
           const user_id = e.user_id || e.owner_id; 
           if(e.refrigerator_name){
           obj[id].refrigerator_name = e.refrigerator_name;
           }
           if(typeof obj[id]["user_ids"] === 'object'){
               obj[id]["user_ids"].push(user_id);
           }else{
               obj[id]["user_ids"] = [user_id];
           }
   })
   return obj;
}

async function getUserEmails(obj){
    Object.keys(obj).forEach(async e=>{
          const emails = await commonQueries.getUserEmailsFromUserIds(obj[e]["user_ids"]);
          let allE = emails.map(e=>e.email)
          const items = obj[e]["items"];
          const string = `Hi, some Item/s has expired in your ${obj[e]['refrigerator_name']} ,please login and
          check them out. Here are the expired Items : ${items.join(' , ')}`
          const allEmails = allE.join(',')
          main(string,allEmails);
    })
}

 async function sendEmails (){
    const items = await commonQueries.changeStatusOfExpiredItems();
    if(items.length ===0){
        return
    }
    let obj = reduceItems(items);
    obj = await getUserIds(obj);
    getUserEmails(obj);
}
const sendEmail = {
    sendEmails
}
module.exports = sendEmail;