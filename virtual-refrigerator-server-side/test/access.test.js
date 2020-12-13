const request= require('supertest');
const app = require('../app');
const commonQueries = require('../mysql/commonQueries')
const { test, expect,describe } = require('@jest/globals');
const BasicUtils = require('../utils');
const endPoint = "/api/access";
const users = [];
const userInfos = [{
    "username" : "someuser11",
    "password" : "12345678",
    "email": "something11@email.com"
},{
    "username" : "someuser22",
    "password" : "12345678",
    "email": "something22@email.com"
},{
    "username" : "someuser33",
    "password" : "12345678",
    "email": "something33@email.com"
},{
    "username" : "someuser44",
    "password" : "12345678",
    "email": "something44@email.com"
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
        const response = await request(app).post("/api/signup").send({
            "username" : userInfos[i].username,
            "password" : userInfos[i].password
        });
        const jwt = "bearer "+response.body.token;
        users[i].jwtToken = jwt; 
    }
   //create refrigerator
   const response = await request(app).post("/api/refrigerator/add")
   .send({"name":"something"})
   .set("authorization", users[0].jwtToken);
   //add it to refrigerators array
   refrigerators.push(response.body);
});

describe('give/remove access tests', ()=>{
    test('should return a 401 error if no jwt is present when trying to give access', async ()=>{
        const response = await request(app).post(endPoint+"give");
        expect(response.statusCode).toBe(401);    
     });
     test('should return a 401 error if no jwt is present when trying to remove access', async ()=>{
        const response = await request(app).post(endPoint+"remove");
        expect(response.statusCode).toBe(401);    
     });
     test('should return a 400 error if refrigerator id doesn\'t exist when trying to give access', async ()=>{
        const response = await request(app).post(endPoint+"give").set("authorization", users[0].jwtToken)
        .send({"refrigerator_id" : "non-existant","user_id":users[1].id});
        expect(response.statusCode).toBe(400);    
     });
     test('should return a 400 error if refrigerator id doesn\'t exist when trying to rmeove access', async ()=>{
        const response = await request(app).post(endPoint+"remove").set("authorization", users[0].jwtToken)
        .send({"refrigerator_id" : "non-existant","user_id":users[1].id});
        expect(response.statusCode).toBe(400);    
     });
     test('should return a 400 error if user doesn\'t exist when trying to give access', async ()=>{
        const response = await request(app).post(endPoint+"give").set("authorization", users[0].jwtToken)
        .send({"refrigerator_id" : refrigerators[0].id,"user_id":"non-existant"});
        expect(response.statusCode).toBe(400);    
     });
     test('should return a 400 error if user doesn\'t exist when trying to remove access', async ()=>{
        const response = await request(app).post(endPoint+"remove").set("authorization", users[0].jwtToken)
        .send({"refrigerator_id" : refrigerators[0].id,"user_id":"non-existant"});
        expect(response.statusCode).toBe(400);    
     });
     test('should return a 403 error if trying to give access to refrigerator you dont own', async ()=>{
        const response = await request(app).post(endPoint+"give").set("authorization", users[1].jwtToken)
        .send({"refrigerator_id" : refrigerators[0].id,"user_id": users[2].id});
        expect(response.statusCode).toBe(403);    
     });
     test('should return a 403 error if trying to remove access from refrigerator you dont own', async ()=>{
        const response = await request(app).post(endPoint+"remove").set("authorization", users[1].jwtToken)
        .send({"refrigerator_id" : refrigerators[0].id,"user_id": users[2].id});
        expect(response.statusCode).toBe(403);    
     });
     test('should return a 400 error if trying to give access to yourself', async ()=>{
        const response = await request(app).post(endPoint+"give").set("authorization", users[0].jwtToken)
        .send({"refrigerator_id" : refrigerators[0].id,"user_id": users[0].id});
        expect(response.statusCode).toBe(400);    
     });
     test('should return a 400 error if trying to remove access from yourself', async ()=>{
        const response = await request(app).post(endPoint+"remove").set("authorization", users[0].jwtToken)
        .send({"refrigerator_id" : refrigerators[0].id,"user_id": users[0].id});
        expect(response.statusCode).toBe(400);    
     });
     test('should return a 200 ok statuscode if everything else if correct giving access', async ()=>{
        const response = await request(app).post(endPoint+"give").set("authorization", users[0].jwtToken)
        .send({"refrigerator_id" : refrigerators[0].id,"user_id": users[1].id});
        expect(response.statusCode).toBe(200);    
     });
     test('should return a 400 error when trying to give access to someone with access', async ()=>{
        const response = await request(app).post(endPoint+"give").set("authorization", users[0].jwtToken)
        .send({"refrigerator_id" : refrigerators[0].id,"user_id": users[1].id});
        expect(response.statusCode).toBe(400);    
     });
     test('should return a 400 error when trying to remove access from someone who doesn\'t have access', async ()=>{
        const response = await request(app).post(endPoint+"remove").set("authorization", users[0].jwtToken)
        .send({"refrigerator_id" : refrigerators[0].id,"user_id": users[2].id});
        expect(response.statusCode).toBe(400);    
     });

     //end
     test('should return a 200 ok statuscode if everything else if correct when removing access', async ()=>{
        const response = await request(app).post(endPoint+"remove").set("authorization", users[0].jwtToken)
        .send({"refrigerator_id" : refrigerators[0].id,"user_id": users[1].id});
        expect(response.statusCode).toBe(200);    
     });
});

afterAll(async done => {
    //remove all newly created users
    for(let i=0; i<users.length; i++){
     await commonQueries.deleteByUserId(users[i].id);
    }   
    const response = await request(app).post("api/refrigerator/remove/" + refrigerators[0].id).set("authorization", users[0].jwtToken); 
     done();
 });
