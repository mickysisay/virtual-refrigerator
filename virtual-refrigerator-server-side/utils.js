const jwt = require('jsonwebtoken');
const constants = require('./constants');
const bcrypt = require('bcrypt');
const { v1: uuidv1 } = require('uuid');
const commonQueries = require('./mysql/commonQueries');


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
}

module.exports = BasicUtils;