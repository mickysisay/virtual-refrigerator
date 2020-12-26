import React from "react";
import backendAPI from '../Utils/backendAPI'
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import './login.css'
import { MDBIcon } from 'mdbreact';
export default class RefrigeratorItemShow extends React.Component {
    constructor(props){      
        super(props)
        const info = this.props.item;
        this.state = {
          id: info["id"],
          item_name : info["item_name"],
          status : info["status"],
          expiration_date : info["expiration_date"] ,
          CreatedOn : info["CreatedOn"],
          quantity : info["quantity"] 
        }  
    }
    render(){
        return (<div className = "personal-Item"  onClick = {(e)=>{console.log("whole")}}>
            <div className="left">
            {this.state.item_name}
            </div>
            <div className="right">
            <MDBIcon onClick={(e)=>{e.stopPropagation();console.log("trash")}} icon="trash-alt" className='mr-2' >
                </MDBIcon>
            <MDBIcon onClick={(e)=>{e.stopPropagation();console.log("pencil")}} icon="pencil-alt" className='mr-1' >
                </MDBIcon>
             </div>
        </div>);
    }
}