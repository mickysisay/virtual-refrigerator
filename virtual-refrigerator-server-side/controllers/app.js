const express = require('express');

const basicUtils = require('../utils');
const bodyParser = require('body-parser');

//const SECRETKEY= "secret";
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', 'https://vr.ngrok.io/');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(cors());
app.options('*', cors());
 //app.use(express.static(environmentRoot + ''));

app.get("/api",(req,res)=>{
    res.json({
        message:"welcome to virtual refridgrator"
    });
});

app.use(bodyParser.json())

//login

app.post("/api/login",async (req,res)=>{
   await basicUtils.login(req,res); 
});
app.post("/api/signup", async (req,res)=>{
    await basicUtils.signUp(req,res);
})

//protected route

app.post("/api/checkToken", basicUtils.verifyToken,async (req,res)=>{

   let data = await basicUtils.getInfoFromToken(req);
   res.json(data);

});
app.get("/api/users/search/", basicUtils.verifyToken,async (req,res)=>{
    await basicUtils.searchUsers(req,res); 
 });

module.exports = app;
