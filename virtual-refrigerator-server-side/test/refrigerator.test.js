const { TestScheduler } = require('jest');
const request= require('supertest');
const app = require('../app');
const commonQueries = require('../mysql/commonQueries')
const { test, expect,describe } = require('@jest/globals');
const BasicUtils = require('../utils');
const endPoint = "/api/refrigerator/";
const idOfRefrigerator = "";
const users = [];
const userInfos = [{
    "username" : "someuser1",
    "password" : "12345678",
    "email": "something1@email.com"
},{
    "username" : "someuser2",
    "password" : "12345678",
    "email": "something2@email.com"
},{
    "username" : "someuser3",
    "password" : "12345678",
    "email": "something3@email.com"
},{
    "username" : "someuser4",
    "password" : "12345678",
    "email": "something4@email.com"
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

});

describe('refrigerator add/remove tests', ()=>{
    test('should return a 401 error if no jwt is present when trying to add refrigerator', async ()=>{
       const response = await request(app).post(endPoint+"add");
       expect(response.statusCode).toBe(401);    
    });
    test('should return a 401 error if no jwt is present when trying to remove refrigerator', async ()=>{
        const response = await request(app).post(endPoint+"remove/"+idOfRefrigerator);
        expect(response.statusCode).toBe(401);    
     });
     test('should return a 401 error if no jwt is present when trying to get refrigerator', async ()=>{
        const response = await request(app).get(endPoint+idOfRefrigerator);
        expect(response.statusCode).toBe(401);    
     });
     test('should return a 400 error if name is missing when creating refrigerator', async ()=>{
        const response = await request(app).post(endPoint+"add").set("authorization", users[0].jwtToken);
        expect(response.statusCode).toBe(400);    
     });
     test('should return a 200 ok message if name and jwt token exist when creating refrigerator', async ()=>{
        const response = await request(app).post(endPoint+"add")
        .send({"name":"something"})
        .set("authorization", users[0].jwtToken);
        refrigerators.push(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.creator).toBeDefined();    
     });

     test('should return a 404 error if refrigerator id is not valid when getting refrigerator ', async ()=>{
        const response = await request(app).get(endPoint).set("authorization", users[0].jwtToken);
        expect(response.statusCode).toBe(404);    
     });
     test('should return a 404 error if refrigerator id is not valid when deleting refrigerator ', async ()=>{
        const response = await request(app).post(endPoint).set("authorization", users[0].jwtToken);
        expect(response.statusCode).toBe(404);    
     });
     test('should return a 403 error if user doesn\'t have access to refrigerator when trying to get it ', async ()=>{
        const response = await request(app).get(endPoint + refrigerators[0].id).set("authorization", users[1].jwtToken);
        expect(response.statusCode).toBe(403);    
     });
     test('should return a 403 error if user doesn\'t have access to refrigerator when trying to delete it ', async ()=>{
        const response = await request(app).post(endPoint+"remove/" + refrigerators[0].id).set("authorization", users[1].jwtToken);
        expect(response.statusCode).toBe(403);    
     });


     test('should return a 200 ok message if user has access to refrigerator when trying to get it ', async ()=>{
        const response = await request(app).get(endPoint+ refrigerators[0].id).set("authorization", users[0].jwtToken);
        expect(response.statusCode).toBe(200);    
     });
     //should be last test = removing the test refrigerator
     test('should return a 200 ok message if user has access to refrigerator when trying to delete it ', async ()=>{
        const response = await request(app).post(endPoint+"remove/" + refrigerators[0].id).set("authorization", users[0].jwtToken);
        expect(response.statusCode).toBe(200);    
     });

});

afterAll(async done => {
   //remove all newly created users
   for(let i=0; i<users.length; i++){
    await commonQueries.deleteByUserId(users[i].id);
   }    
    done();
});