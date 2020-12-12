const { test, expect,describe } = require('@jest/globals');
const { response } = require('express');
const request= require('supertest');
const app = require('../app');
const commonQueries = require('../mysql/commonQueries')
const users = {
   inValid : {
       "username" : "simthing",
       "password" : "abcdefgh"
   },
   valid : {
    "username" : "sumthing",
    "password" : "12345678" 
    }
}
const userRegistrationData = {
    missingUsername : {
        "password":"12345678",
        "email" : "something@email.com"
    },
    missingPassword : {
       "username" : "someuser",
       "email" : "something@email.com"
    },
    missingEmail : {
        "username" : "someuser",
        "password" : "12345678"
    },
    emptyData : {
        "username" : "",
        "password" : "",
        "email" : ""
    },
    validData : {
        "username" : "someuser",
        "password" : "12345678",
        "email": "something@email.com"
    },
    existingUserName : {
        "username":"sumthing",
        "password": "12345678",
        "email" : "somethingg.com"
    },
    existingEmail : {
        "username":"sumthingg",
        "password": "12345678",
        "email" : "something.com"
    }
}


describe('Test login path', () =>{
 

    test("it should send 400 error if username is missing" ,async () =>{
       const response = await request(app).post("/api/login").send({"username" : "something"});
       expect(response.statusCode).toBe(400);
       expect(response.body.status).toBe(false);
    });
    test("it should send 400 error if password is missing",async () =>{
        const response = await request(app).post("/api/login").send({"password": "123455"});
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
        
    })
    test("it should send error message if credentials are not right", async ()=>{
        const response = await request(app).post("/api/login").send(users.InValid);
        expect(response.body.status).toBe(false);
        expect(response.statusCode).toBe(400);
        
    })
    test("it should send jwt token and 200 message if credentials are right" , async ()=>{
        const response = await request(app).post("/api/login").send(users.valid);
       expect(response.body.type).toBe("bearer");
        expect(response.statusCode).toBe(200);
    });
});

describe('test signup path', () =>{
    test('it should return 400 error if any username is missing',async ()=>{
        const response = await request(app).post("/api/signup").send(userRegistrationData.missingUsername);
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
    });
    test('it should return 400 error if any email is missing',async ()=>{
        const response = await request(app).post("/api/signup").send(userRegistrationData.missingEmail);
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
    });
    test('it should return 400 error if any password is missing',async ()=>{
        const response = await request(app).post("/api/signup").send(userRegistrationData.missingPassword);
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
    });
    test('it should return 400 error if any userdata is empty',async ()=>{
        const response = await request(app).post("/api/signup").send(userRegistrationData.emptyData);
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
    });
    test('it should return 400 error if any username is taken',async ()=>{
        const response = await request(app).post("/api/signup").send(userRegistrationData.existingUserName);
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
    });
    test('it should return 400 error if any email is taken',async ()=>{
        const response = await request(app).post("/api/signup").send(userRegistrationData.missingEmail);
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
    });
    test('it should return 200 success with userdata if userdata is valid',async ()=>{
        const response = await request(app).post("/api/signup").send(userRegistrationData.validData);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.user).toBeDefined();
        //delete created user
        await commonQueries.deleteByUserId(response.body.user.id);
    });
});

afterAll(async done => {
       
    done();
});