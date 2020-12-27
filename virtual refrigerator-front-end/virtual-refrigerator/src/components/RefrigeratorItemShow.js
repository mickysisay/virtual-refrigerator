import React from "react";
import backendAPI from '../Utils/backendAPI'
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import './login.css'
import { Card, Button,Modal } from 'react-bootstrap';
import { MDBIcon,MDBInput } from 'mdbreact';
import { confirmAlert } from 'react-confirm-alert';
import DateTimePicker from 'react-datetime-picker';
import EditRefrigeratorItem from './EditRefrigeratorItem'


export default class RefrigeratorItemShow extends React.Component {
    constructor(props){      
        super(props)
        const info = this.props.item;
        if(typeof info["expiration_date"] === "string"){
            info["expiration_date"] = new Date(Date.parse(info["expiration_date"]));
        }
        this.state = {
          id: info["id"],
          item_name : info["item_name"],
          status : info["status"],
          expiration_date : info["expiration_date"] ,
          CreatedOn : info["CreatedOn"],
          quantity : info["quantity"],
          refrigerator_id : info["refrigerator_id"], 
          bar_code : info["bar_code"],
          info : info
        } 
    }
    componentWillReceiveProps(props){
       const info = props.item;
        if(typeof info["expiration_date"] === "string"){
            info["expiration_date"] = new Date(Date.parse(info["expiration_date"]));
        }
        this.setState({
            id: info["id"],
            item_name : info["item_name"],
            status : info["status"],
            expiration_date : info["expiration_date"] ,
            CreatedOn : info["CreatedOn"],
            quantity : info["quantity"],
            refrigerator_id : info["refrigerator_id"], 
            bar_code : info["bar_code"],
            info:info
        });
    }
    deleteItem =async (onClose) =>{
        //this.props.setItem
        const data = {
            "id" : this.state.id,
            "refrigerator_id" : this.state.refrigerator_id
        }
        const response = await backendAPI.deleteItemFromRefrigerator(data);
        if(response.statusCode === 200 ){
            this.props.setItem(response.message.message);
        }
        onClose();

    }
   
    editItem = () =>{
       
        //console.log("state",this.state);
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                <EditRefrigeratorItem onClose = {onClose} setItem = {this.props.setItem} item={this.state.info} />     
                );
            }
        });
    }

    confirmDelete = () => {
        
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div>
                     <Modal.Dialog>
                     <Modal.Header closeButton onClick = {onClose}>
                            <Modal.Title>Delete Item</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                <p>Are you sure you want to delete "{this.state.item_name}"?</p>
                        </Modal.Body>

                         <Modal.Footer>
                             <Button variant="primary" onClick= {onClose}>No</Button>
                            <Button variant="danger" onClick={()=>{this.deleteItem(onClose)}}>Delete</Button>
                        </Modal.Footer>
                     </Modal.Dialog>
                    </div>
                );
            }
        });
    }
    
    render(){
        return (
            <div>
            <Card className = "refrigerator-item" style={{ width: '13vw' }}  onClick = {(e)=>{console.log("whole")}}>
            <Card.Body>
                <Card.Title className="refrigerator-item-title">{this.state.item_name} </Card.Title>
            </Card.Body>

            <Card.Body className="either-end">
            <MDBIcon  onClick={(e)=>{e.stopPropagation();this.confirmDelete()}} icon="trash-alt" className='mr-1' >
                </MDBIcon>
                <MDBIcon onClick={(e)=>{e.stopPropagation();this.editItem()}} icon="pencil-alt" className='mr-1' >
                </MDBIcon>
            </Card.Body>
        </Card>
        </div>
        );
    }
}