import React from "react";
import backendAPI from '../Utils/backendAPI'
import 'react-notifications/lib/notifications.css';
import {  NotificationManager } from 'react-notifications';
import ItemScanner from './ItemScanner'

export default class getItemBarCode extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          item :""
        }

    }

    setBarCode =async (code)=>{
        this.getItemFromBackend(code);    
    }

    getItemFromBackend = async (code) =>{
        const response = await backendAPI.getPersonalItemWithBarcode(code);
        console.log(response);
        if(response.statusCode === 200){
            this.setState({
              item : response.message.message 
            });
            NotificationManager.success('Success message', "item retrieved succesfully", 1000, () => {
                alert('callback');
            });
         }else{
            NotificationManager.error('Error message', response.message.message, 3000, () => {
                alert('callback');
            });
         }
    }
    render(){
        return(<div>
            <ItemScanner setBarCode = {this.setBarCode}/>
           </div>);
    }
}