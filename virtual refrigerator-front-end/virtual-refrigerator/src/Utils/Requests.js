import axios from 'axios';
import {APPURL} from './Constants'

export default class Requests {

    static async loginPost(state){
       const endpoint = APPURL+"login"; 
       //state should have username and password
       const data = {
           "username": state.username,
           "password" : state.password
       }
    
      //send axios request to url
       try{
          const resp = await axios.post(endpoint,data);
          
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
}