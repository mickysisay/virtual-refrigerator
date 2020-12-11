const express = require('express');
const jwt = require('jsonwebtoken');
const basicUtils = require('./utils');
const bodyParser = require('body-parser');
const constants = require('./constants');
const bcrypt = require('bcrypt');
const { hashPassword } = require('./utils');
const commonQueries = require('./mysql/commonQueries')
//const SECRETKEY= "secret";


const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
 
 //app.use(express.static(environmentRoot + ''));

app.get("/api",(req,res)=>{
    res.json({
        message:"welcome to virtual refridgrator"
    });
});

app.use(bodyParser.json())

//login

app.post("/api/login",async (req,res)=>{
    //get signup information
    
    const username = req.body.username;
    const password = req.body.password;
    if(username == null || password == null){
        res.status(400).send({status : false, message:"username or password is missing"});
    }else{
    const userInfo = await basicUtils.findByUsernameAndPassword(username,password); 
    if(!userInfo.status){
        res.status(400).send(userInfo);
        return;
    }  
    delete userInfo.user.password;
    jwt.sign({user: userInfo.user},
    constants.SECRETKEY,{expiresIn : constants.EXPIRATIONTIME },(err,token)=>{
        res.json({
            type:"bearer",
            token : token
        });   
    });
    }
});

//get all users for testing
app.get("/api/users/all",(req,res)=>{
    res.json(constants.mockUsers);
})

//signup

app.post("/api/signup", async (req,res)=>{
    //check if user data is valid
    const dataVerification = await basicUtils.verifySignUpInformation(req);
    if(!dataVerification.status){
        res.status(400).json(dataVerification);
    }else{
    const id = basicUtils.createUniqueId();
    const hashedPass =await bcrypt.hash(req.body.password, constants.SALTROUNDS);
    const userData = {
        id:id,
        username : req.body.username,
        password : hashedPass,
        email : req.body.email.trim(),
    }
    //push this to mockUpUSer
    commonQueries.addUserToDatabase(userData);
    //constants.mockUsers.push(userData);
    res.json({success:true, message: "user signed up succesfully"});
    } 
})

//protected route

app.post("/api/create/vr",basicUtils.verifyToken,async (req,res)=>{

    let data = await basicUtils.getInfoFromToken(req);
    res.json(data);

});

module.exports = app;
