const jwt = require('jsonwebtoken');
const constants = require('./constants');
const bcrypt = require('bcrypt');
const { v1: uuidv1 } = require('uuid');
const commonQueries = require('./mysql/commonQueries');


class BasicUtils {

   static randomNumGenerator(min,max){
        return Math.floor(Math.random()*(max-min+1))+min;
    }
   static verifyToken(req,res,next){
       const bearerHeader = req.headers['authorization'];
       if(typeof bearerHeader!== 'undefined'){
       const token = bearerHeader.split(" ")[1];
       req.token = token;
       next(); 
       }else{
           res.sendStatus(403);
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
        //temporary array search
        const arr = constants.mockUsers;
        let userInfo = {status:false,message:"bad username or password"};
       
        for(let ex in arr){
            if(arr[ex].username === username){
                 const passwordMatches  =await bcrypt.compareSync(password, arr[ex].password);
               if(passwordMatches){ 
                userInfo =  {status: true, user : arr[ex].username};
               }
            } 
        }
        
        return userInfo;
    }
}

module.exports = BasicUtils;