const jwt = require('jsonwebtoken');
const constants = require('./constants');
const bcrypt = require('bcrypt');
const { v1: uuidv1 } = require('uuid');
const commonQueries = require('./mysql/commonQueries');
const moment = require('moment');

class BasicUtils {

   static randomNumGenerator(min,max){
        return Math.floor(Math.random()*(max-min+1))+min;
    }
    static async verifyToken(req,res,next){
       const bearerHeader = req.headers['authorization'];
       if(typeof bearerHeader!== 'undefined'){
       const token = bearerHeader.split(" ")[1];
       req.token = token;
       try{
         await jwt.verify(token,constants.SECRETKEY);
       }catch(e){
           res.status(401).json({success:false,message:e});
           return;
       }
       next(); 
       }else{
           res.status(401).json({success:false,message:"token doesn't exist"});
           return;
       }
   } 
    static async getInfoFromToken(req){
     return jwt.verify(req.token,constants.SECRETKEY,(err,data)=>{
           if(err){
               return false;
           }else{
               return data;
           }
       })
    }
    static async hashPassword(password){
       
    }
    static async usernameExists(username){
    
    const res =  await commonQueries.doesUsernameExist(username) 
        return res;  
    }
    static async emailExists(email){
     const res =  await commonQueries.doesEmailExist(email) 
        return res;  
    }

     static async verifySignUpInformation(req){
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;
        if(username != null){
            if(username.trim().length < 6){
                return {status:false , message:"username too short"}
            }
            if( await this.usernameExists(username)){
                return {status:false, message: "username exists"}
            }
        }else{
            return {status : false, message : "need username"};
        }
        if(password != null){
            if(password.trim().length <6){
                return {status:false, message : "password too short"};
            }
        }else{
            return {status : false, message : "need password"};
        }
        if(email != null){
            if( await this.emailExists(email.trim())){
                return {status:false, message: "email already exists"}
            }
            if(email.trim().substring(email.trim().length - 4) !==".com"){
               return {status : false, message: "not a valid email"};
           }
        }else{
            return {status : false, message : "need email address"};
        }
        return {status : true , message: "user data is valid"}
    }
    static createUniqueId(){
        return uuidv1();
    }
    static async findByUsernameAndPassword(username,password){
        const res = await commonQueries.findByUsername(username);
        if(res){
            const passwordMatches  =await bcrypt.compareSync(password, res.password);
            if(passwordMatches){
               return {status : true, user : res}
            }else{
                return {status:false,message:"incorrect password"};
            }
        }else{
            return {status:false,message:"No users found with that username"};
        }
       
    }
    static async getRefrigeratorFromUserIdAndRefrigeratorId(req,res){
        const id = req.params.id;
        if(id === undefined){
            res.status(400).json({status:false,message:"can't find id"});
            return;
        }
        let data = await this.getInfoFromToken(req);
        if(!data.user){
            res.status(400).json({status:false,message:"no user found with that jwt token"});
            return;
        }
        const userId = data.user.id;
        const response = await commonQueries.getRefrigeratorByUserIdAndRefrigeratorId(userId,id);
        if(response.length === 0){
            res.status(404).json({status:false,message:"no refrigerator found"});
            return;
        }
        res.json({status:true,message:response});
    }
    static async getRefrigeratorFromUserId(req,res){
        let data = await this.getInfoFromToken(req);
        if(!data.user){
            res.status(400).json({status:false,message:"no user found with that jwt token"});
            return;
        }
        const userId = data.user.id;
        const response = await commonQueries.getAllRefrigeratorsByUserId(userId);
        res.json(response);
    }
    static async addRefirgerator(req,res){
        const refrigeratorData = req.body;
        const data = await this.getInfoFromToken(req);
        if(!data.user){
            res.status(400).json({status:false,message:"no user found with that jwt token"});
            return;
        }
        if(refrigeratorData.refrigeratorName === undefined){
            res.status(400).json({status:false,message:"refrigerator name doesn't exist"});
            return;
        }
         
        if(refrigeratorData.refrigeratorName.trim() === ""){
            res.status(400).json({status:false,message:"refrigerator name is empty"})
            return;
        }
        const id = this.createUniqueId();
        const userId = data.user.id;
        const refrigeratorName = refrigeratorData.refrigeratorName;
        const refData = {
            id:id,
            refrigeratorName : refrigeratorName,
            ownerId: userId
        };
        await commonQueries.addRefrigerator(refData);
        res.status(200).json({status:true, refrigerator : refData});
    }
    static async updateRefrigerator(req,res){
        const id = req.params.id;
        if(id === undefined){
            res.status(400).json({status:false,message:"can't find id"});
            return;
        }
        const data = await this.getInfoFromToken(req);
        if(!data.user){
            res.status(400).json({status:false,message:"no user found with that jwt token"});
            return;
        }
        const userId = data.user.id;
        const refrigeratorName = req.body.refrigeratorName;
        if(refrigeratorName === undefined){
            res.status(400).json({status:false,message:"refrigerator name doesn't exist"});
            return;
        }
         
        if(refrigeratorName.trim() === ""){
            res.status(400).json({status:false,message:"refrigerator name is empty"})
            return;
        }
        const result = await commonQueries.updateRefrigeratorByUserIdAndRefrigerator(userId,id,refrigeratorName);
        if(result.affectedRows === 0){
            res.status(400).json({status:false,message:"no refrigerator found with that id"});
            return;
        }else{
            res.status(200).json({status:true,message:"refrigerator edited Succesfully"});
        }
    }
    static async deleteRefrigerator(req,res){
        const id = req.params.id;
        if(id === undefined){
            res.status(400).json({status:false,message:"can't find id"});
            return;
        }
        const data = await this.getInfoFromToken(req);
        if(!data.user){
            res.status(400).json({status:false,message:"no user found with that jwt token"});
            return;
        }
        const userId = data.user.id;
        const result = await commonQueries.deleteRefrigeratorByUserIdAndRefrigeratorId(userId,id);
        if(result.affectedRows === 0){
            res.status(400).json({status:false,message:"no refrigerator found with that id"});
            return;
        }else{
            res.status(200).json({status:true,message:"refrigerator deleted succesfully"});
        }  
    }
    static async addItemToRefrigerator(req,res){
        const data = await this.getInfoFromToken(req);
        if(!data.user){
            res.status(400).json({status:false,message:"no user found with that jwt token"});
            return;
        }
        const itemInformation = req.body;
        if(typeof itemInformation["item_name"]!== "string" ){
            res.status(400).json({status:false,message:"item name doesn't exist"});
            return;
        }
        if(itemInformation["item_name"].trim() === ""){
            res.status(400).json({status:false,message  : "item name can't be empty"});
            return;
        }
        if(itemInformation["expiration_date"]){
            //check if its a number
            if(typeof itemInformation["expiration_date"] !== 'number'){
                res.status(400).json({status:false,message:"expiration date is not a number"});
                return;
            }
            //check if date is after today
            if(Date.now() >= itemInformation["expiration_date"]){
                res.status(400).json({status:false,message:"expiration date should be older than today"});
                return;
            }
            itemInformation["expiration_date"] =  moment(itemInformation["expiration_date"]).format();
        }
        if(typeof itemInformation["quantity"]=== "number"){
            if(itemInformation["quantity"] <=0){
                res.status(400).json({status : false, message:"quantity can't be less than 1"});
                return
            }
        }else{
            itemInformation["quantity"] = 1;
        }
        const userId = data.user.id;
        const refrigeratorId = itemInformation["refrigerator_id"];
        const canUserAdd = await this.canUserAddToRefrigerator(userId,refrigeratorId);
        if(!canUserAdd){
            res.status(403).json({status:false, message:"User doesn't have access to refrigeratpr"});
            return;
        }
        itemInformation["id"] = this.createUniqueId();
        const response = await commonQueries.addNewItem(itemInformation);
        res.json({status:true, message: response.response});
    }
    static async deleteItem(req,res){
        const data = await this.getInfoFromToken(req);
        if(!data.user){
            res.status(400).json({status:false,message:"no user found with that jwt token"});
            return;
        }
        const userId = data.user.id;
        const itemId = req.body["id"];
        const refrigeratorId = req.body["refrigerator_id"];
        if(typeof itemId !== "string" || typeof refrigeratorId !== "string"){
            res.status(400).json({status:false, message : "item id or refrigerator id is not valid"});
            return;
        }
        //check if user has access to refrigerator
        const hasAccess = this.canUserAddToRefrigerator(userId,refrigeratorId);
        if(!hasAccess){
            res.status(403).json({status:false,message:"User doesn't have access to refrigerator"});
            return;
        }
        const deleteResponse = await commonQueries.deleteItem(itemId,refrigeratorId);
        if(!deleteResponse.success){
            res.status(400).json({status:false,message:"item not valid"});
            return;
        }
        res.json({status:true,message:deleteResponse.response});
    }
    static async getAllItems(req,res){
        const data = await this.getInfoFromToken(req);
        if(!data.user){
            res.status(400).json({status:false,message:"no user found with that jwt token"});
            return;
        }
        const refrigeratorId = req.params.id;;
        const userId= data.user.id;
        const hasAccess = await this.canUserAddToRefrigerator(userId,refrigeratorId);
        if(!hasAccess){
            res.status(403).json({status:false, message:"User doesnot have access to refrigerator"});
            return;
        }
        const response = await commonQueries.getAllItemsInRefrigerator(refrigeratorId);
        res.json({status:true,message:response});
    }
    static async addPersonalItem (req,res){
        const data = await this.getInfoFromToken(req);
        if(!data.user){
            res.status(400).json({status:false,message:"no user found with that jwt token"});
            return;
        }
        const personalItemInfo = req.body;
        if(typeof personalItemInfo["item_name"] !== "string"){
            res.status(400).json({status:false,message:"item name doesn't exist"});
            return;
        }
        if(personalItemInfo["item_name"].trim() ===""){
            res.status(400).json({status:false,message:"item name doesn't exist"});
            return;
        }
        if(typeof personalItemInfo["bar_code"] === "string"){
        const personalItem = await commonQueries.getPersonalItemByOwnerIdAndbarCode(data.user.id,personalItemInfo["bar_code"]);
            if(personalItem.length !=0){
                res.status(402).json({status:false,message:"item already exists"});
                return;
            }
        }
        personalItemInfo["owner_id"]= data.user.id;
        personalItemInfo["id"] = this.createUniqueId();
        const response = await commonQueries.addPersonalItem(personalItemInfo);
        res.json({status:response.success,message:response.response});
    }
    static async deletePersonalItem(req,res){
        const data = await this.getInfoFromToken(req);
        if(!data.user){
            res.status(400).json({status:false,message:"no user found with that jwt token"});
            return;
        }
        const personalItemId = req.body["id"];
        const response  = await commonQueries.deletePersonalItem(personalItemId, data.user.id);
        if(!response.success){
            res.status(404).json({status:false,message:"no personal item found"});
            return;
        }
        res.json({status:response.success,message:response.response});

    }
    static async getPersonalItem(req,res){
        const data = await this.getInfoFromToken(req);
        if(!data.user){
            res.status(400).json({status:false,message:"no user found with that jwt token"});
            return;
        }
        const barCode = req.body["bar_code"];
        const response = await commonQueries.getPersonalItemByOwnerIdAndbarCode(data.user.id,barCode);
        if(response.length === 0){
            res.status(404).json({status:false,message:"no personal item found"});
            return;
        }
        res.json({status:true,message:response[0]});
    }
    static async canUserAddToRefrigerator(userId,refrigeratorId){
      //check if user is an owner of refrigerator
        const response =await commonQueries.getRefrigeratorByUserIdAndRefrigeratorId(userId,refrigeratorId);
        return response.length !==0;
    }
}

module.exports = BasicUtils;