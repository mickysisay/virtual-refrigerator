const request= require('supertest');
const app = require('../controllers/items');
const commonQueries = require('../mysql/commonQueries')
const { test, expect,describe } = require('@jest/globals');
const BasicUtils = require('../utils');
const { response } = require('express');
const endPoint = "/api/item/";
const users = [];
const userInfos = [{
    "username" : "someuser111",
    "password" : "12345678",
    "email": "something111@email.com"
},{
    "username" : "someuser222",
    "password" : "12345678",
    "email": "something222@email.com"
},{
    "username" : "someuser333",
    "password" : "12345678",
    "email": "something333@email.com"
},{
    "username" : "someuser444",
    "password" : "12345678",
    "email": "something444@email.com"
}];
const refrigerators = [];
beforeAll(async ()=>{
    //TODO: create 4 users 
    for(let i=0;i<userInfos.length; i++){
        const response = await request(app).post("/api/signup").send(userInfos[i]);
        users.push(response.body.user);
    }
    //login and add jwt to users array
    for(let i=0; i <users.length; i++){
        const response = await request(app).post("/api/login").send({
            "username" : userInfos[i].username,
            "password" : userInfos[i].password
        });
        const jwt = "bearer "+response.body.token;
        users[i].jwtToken = jwt; 
    }
   //create refrigerator
   const respons = await request(app).post("/api/refrigerator/add")
   .send({"refrigeratorName":"something"})
   .set("authorization", users[0].jwtToken);
   //add it to refrigerators array
   refrigerators.push(respons.body.refrigerator);
});

describe('item path test', () =>{
 

    test('should return a 401 error if no jwt is present when trying to add/remove item', async ()=>{
        const response = await request(app).post(endPoint+"add");
        expect(response.statusCode).toBe(401);    
     });
     test('should return a 400 error if name is missing when adding item', async ()=>{
        const response = await request(app).post(endPoint+"add").set("authorization", users[0].jwtToken);
        expect(response.statusCode).toBe(400);    
     });
     test('should return a 403 error if refrigerator doesn\'t exist when adding item', async ()=>{
        const response = await request(app).post(endPoint+"add").set("authorization", users[0].jwtToken)
        .send({
            "refrigerator_id" : "non-existant",
            "item_name" : "something"
        });
        expect(response.statusCode).toBe(403);    
     });
     test('should return a 400 error if refrigerator doesn\'t exist when removing item', async ()=>{
        const response = await request(app).post(endPoint+"remove").set("authorization", users[0].jwtToken)
        .send({
            "refrigerator_id" : "non-existant",
            "item_id" : "some_id"
        });
        expect(response.statusCode).toBe(400);    
     });
     test('should return a 400 error if item id isn\'t valid exist when removing item', async ()=>{
        const response = await request(app).post(endPoint+"remove").set("authorization", users[0].jwtToken)
        .send({
            "refrigerator_id" : refrigerators[0].id,
            "item_id" : "some_id"
        });
        expect(response.statusCode).toBe(400);    
     });
     test('should return a 403 error if user doesn\'t have access to refrigerator when adding item' , async ()=>{
        const response = await request(app).post(endPoint+"add").set("authorization", users[1].jwtToken)
        .send({
            "refrigerator_id" : refrigerators[0].id,
            "item_name" : "something"
        });
        expect(response.statusCode).toBe(403);    
     });
     test('should return a 400 error if user doesn\'t have access to refrigerator when removing item' , async ()=>{
        const response = await request(app).post(endPoint+"remove").set("authorization", users[1].jwtToken)
        .send({
            "refrigerator_id" : refrigerators[0].id,
            "item_name" : "something"
        });
        expect(response.statusCode).toBe(400);    
     });
     test('should return a 200 sucess if everything is fine when adding item' , async ()=>{
        const response = await request(app).post(endPoint+"add").set("authorization", users[0].jwtToken)
        .send({
            "refrigerator_id" : refrigerators[0].id,
            "item_name" : "somethingggggg"
        });
        refrigerators[0]["items"] = response.body.message;
        expect(response.statusCode).toBe(200);    
     });
     test('should return a 200 sucess if everything is fine when removing item' , async ()=>{
        const response = await request(app).post(endPoint+"remove").set("authorization", users[0].jwtToken)
        .send({
            "refrigerator_id" : refrigerators[0].id,
            "id" : refrigerators[0].items[0].id
        });
        
        expect(response.statusCode).toBe(200);    
     });


});


afterAll(async done => {
    //remove all newly created users
    for(let i=0; i<users.length; i++){
     await commonQueries.deleteByUserId(users[i].id);
    }   
     await commonQueries.deleteRefrigeratorByUserIdAndRefrigeratorId(users[0].id,refrigerators[0].id);

     done();
 });
