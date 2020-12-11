const { test, expect,describe } = require('@jest/globals');
const request= require('supertest');
const app = require('../app');

describe('Test login path', () =>{
    test("it should send 400 error if username is missing" ,async () =>{
       const response = await request(app).post("/api/login").send({"username" : "something"});
       expect(response.statusCode).toBe(400);
    });
   // test("it should send 400 error if password is missing")
});