import axios from 'axios';
import {APPURL} from './Constants'


const postRequestsWithToken = async (endpoint, data )=>{
    try{
        const token = localStorage.getItem("token");
        const headers = {
            "authorization" : token
        }
        const resp = await axios.post(endpoint,data,headers); 
        return {statusCode : 200, message : resp.data};
     }catch(e){
        const resp = e.response;
         try{
         return {statusCode : resp.status,message : resp.data};
         }catch(e){
             return {statusCode:500 , message:{status: false, message:"something wrong with the connection"}};
         }
     } 
}

const getRequestsWithToken = async (endpoint,data = {}) =>{
    try{
        const token = localStorage.getItem("token");
        const headers = {
            "authorization" : token
        }
        const resp = await axios.get(endpoint,data,headers); 
        return {statusCode : 200, message : resp.data};
     }catch(e){
        const resp = e.response;
         try{
         return {statusCode : resp.status,message : resp.data};
         }catch(e){
             return {statusCode:500 , message:{status: false, message:"something wrong with the connection"}};
         }
     } 
}
const loginRequest = async (state) =>{
    const endpoint = APPURL+"login"; 
       //state should have username and password
       const data = {
           "username": state.username,
           "password" : state.password
       }
     const response = await postRequestsWithToken(endpoint,data); 
     return response;
}
const signupRequest = async (state) =>{
    const endpoint = APPURL +"signup";
    const data = {
        "username" : state.username,
        "password" : state.password,
        "email" : state.email
    }
    const response = await postRequestsWithToken(endpoint,data);
    return response;
}
const backendAPI = {
    postRequestsWithToken : postRequestsWithToken,
    getRequestsWithToken : getRequestsWithToken,
    loginRequest : loginRequest,
    signupRequest: signupRequest
}

export default backendAPI;