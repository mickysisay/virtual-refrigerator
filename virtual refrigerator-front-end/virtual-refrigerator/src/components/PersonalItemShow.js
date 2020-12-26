import React from "react";
import backendAPI from '../Utils/backendAPI'
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import './login.css'
import { MDBIcon } from 'mdbreact';
export default class PersonalItemShow extends React.Component {
    constructor(props){      
        super(props)
        const info = this.props.personalItem;
        this.state = {
          id: info["id"],
          itemName : info["item_name"],
          barCode : info["bar_code"]
        }  
    }
    render(){
        return (<div className = "personal-Item"  onClick = {(e)=>{console.log("whole")}}>
            <div className="left">
            {this.state.itemName}
            </div>
            <div className="right">
            <MDBIcon onClick={(e)=>{e.stopPropagation();console.log("trash")}} icon="trash-alt" className='mr-2' >
                </MDBIcon>
            <MDBIcon onClick={(e)=>{e.stopPropagation();console.log("plus")}} icon="plus" className='mr-1' >
                </MDBIcon>
             </div>
        </div>);
    }
}