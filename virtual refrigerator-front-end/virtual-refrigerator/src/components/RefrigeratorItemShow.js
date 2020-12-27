import React from "react";
import backendAPI from '../Utils/backendAPI'
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import './login.css'
import { Card} from 'react-bootstrap';
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
        return (
            <Card className = "refrigerator-item" style={{ width: '13vw' }}  onClick = {(e)=>{console.log("whole")}}>
            <Card.Body>
                <Card.Title>{this.state.item_name} </Card.Title>
            </Card.Body>

            <Card.Body className="either-end">
            <MDBIcon  onClick={(e)=>{e.stopPropagation();console.log("trash")}} icon="trash-alt" className='mr-5' >
                </MDBIcon>
                <MDBIcon onClick={(e)=>{e.stopPropagation();console.log("pencil")}} icon="pencil-alt" className='mr-4' >
                </MDBIcon>
            </Card.Body>
        </Card>
        );
    }
}