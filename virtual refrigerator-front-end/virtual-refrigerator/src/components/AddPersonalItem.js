import React from "react";
import backendAPI from '../Utils/backendAPI'
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import ItemScanner from './ItemScanner'
import { MDBInput,MDBInputGroup } from "mdbreact";
import 'bootstrap/dist/css/bootstrap.css'
import { Button,Modal} from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';

export default class AddPersonalItem extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          itemName : "",
          barCode : "",
          isScannerOn :false
        }
     
    }
    setBarCode = async (code) =>{
       
        this.setState({
            barCode : code
        });
        console.log(this.state);
    }
    addPersonalItem = async () =>{
        const data = {
            "item_name" : this.state.itemName,
            "bar_code" : this.state.barCode
        }
        if(data["item_name"].trim().length === 0){
            NotificationManager.error('Error message', "item name cannot be empty", 1000, () => {
                alert('callback');
            }); 
            return;
        }
        const response = await backendAPI.addPersonalItem(data);
        console.log(response);
        if(response.statusCode === 200 ){
            NotificationManager.success('Success message', "personal item added succesfully", 1000, () => {
                alert('callback');
                this.props.onClose();
            });
        }else{
            NotificationManager.error('Error message', response.message.message, 1000, () => {
                alert('callback');
            });   
        }
        
    }
    handleInput = (e) =>{
        this.setState({
            itemName : e.target.value 
        });
    }
    startScanner = (e) =>{
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div onClick= {()=>{
                        console.log("close");
                        onClose()}} className="align-middle align-items-center justify-content-center mt-5">
                    <ItemScanner setBarCode = {this.setBarCode}/>      
                   </div>
                );
            }
        });
    }
    changeisScannerOn = (bool) =>{
       
        this.setState({
            isScannerOn :bool
        });
    }
    render(){
        if(!this.state.isScannerOn){
        return(<div>
             <Modal.Dialog data-testid = "addRefrigeratorModal">
                
    
                <Modal.Header closeButton onClick = {this.props.onClose}>
                       <Modal.Title>Add Refrigerator</Modal.Title>
                   </Modal.Header>

                   <Modal.Body>
                   <MDBInput
                   onChange = {this.handleInput}
                   valueDefault= {this.state.itemName}
                   label="Item name" />
                    {/* <MDBInput
                   value={this.state.barCode}
                   label="bar Code"
                   disabled  /> */}
                    <MDBInputGroup
                        material
                        value={this.state.barCode}
                         hint="bar Code"
                         disabled
                        append={
                            <Button variant="secondary" onClick = {()=>{this.changeisScannerOn(true)}}>Scan</Button>
                          }
                      />
                   
                   </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick= {this.props.onClose}>Cancel</Button>
                       <Button variant="primary" onClick={()=>{this.addPersonalItem();
                       }}>Add Item</Button>
                   </Modal.Footer>
                </Modal.Dialog>
              
            {/* <ItemScanner setBarCode = {this.setBarCode}/> */}
            <NotificationContainer /></div>);
        }else{
            return( <div  className="align-middle align-items-center justify-content-center mt-5">
           <Button onClick = {()=>{
                console.log("close");
                this.clickChild()
                this.changeisScannerOn(false)}}>Cancel</Button>    
            <ItemScanner setCloseCamera = {(e)=>{
                console.log(e);
                this.clickChild = e} }  setBarCode = {this.setBarCode} changeisScannerOn = 
                {this.changeisScannerOn}/> 
                 
           </div>);
        }
    }

}