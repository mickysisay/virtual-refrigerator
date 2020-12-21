import axios from 'axios';
import {APPURL} from './Constants'



const postRequestsWithToken = async (endpoint, data )=>{
    try{
        const token = localStorage.getItem("token");
        const headers = {
            "Authorization" : token
        }
        const resp = await axios({
            method:"POST",
            url : endpoint,
            data : data,
            headers : headers
        }); 
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
const checkToken = async ()=>{
    try{
        const token = localStorage.getItem("token");
        const headers = {
            "Authorization" : token
        }
        console.log("token",token);
        const resp = await axios({
            method:"POST",
            url : APPURL + "checkToken",
            headers : headers
        }); ; 
        return {statusCode : 200, message : resp.data};
     }catch(e){
         
     const resp = e.response;
     if(resp.status === 401){
      localStorage.removeItem("token");
      window.location.reload();
     }
     return {statusCode : resp.status , message:"something wrong with token"}
     }
}

const getRequestsWithToken = async (endpoint,data = {}) =>{
    try{
        const token = localStorage.getItem("token");
        const headers = {
            "Authorization" : token
        }
        const resp = await axios({
            method:"GET",
            url : endpoint,
            data : data,
            headers : headers
        }); 
        return {statusCode : 200, message : resp.data};
     }catch(e){
        const resp = e.response;
        if(resp.status === 401){
          const responsee = await checkToken();
          return responsee;
        }
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
     if(response.statusCode === 200){
       const timeOut =  (response.message.info.exp - response.message.info.iat) * 1000;
       setTimeout(()=>{
           checkToken();
       },timeOut); 
     } 
     return response;
}
const getAllRefrigetors = async () =>{
    const endpoint = APPURL + "refrigerator";
    const response = await getRequestsWithToken(endpoint);
    return response;
}
const deleteRefrigerator = async (id) =>{
    const endpoint = APPURL + "refrigerator/remove/"+id;
    const response = await postRequestsWithToken(endpoint);
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
    signupRequest: signupRequest,
    checkToken:checkToken,
    getAllRefrigetors:getAllRefrigetors,
    deleteRefrigerator : deleteRefrigerator
}

export default backendAPI;