import React from "react";
import backendAPI from '../Utils/backendAPI'
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import './login.css'
import { Button,Modal } from 'react-bootstrap';
import { MDBInput } from 'mdbreact';
import DateTimePicker from 'react-datetime-picker';


export default class TakeItem extends React.Component {
    constructor(props){      
        super(props)
        const info = this.props.item;
        //this.props.setItem
        //this.props.onClose
        this.state = {
          id: info["id"],
          item_name : info["item_name"],
          status : info["status"],
          expiration_date : info["expiration_date"] ,
          CreatedOn : info["CreatedOn"],
          quantity : info["quantity"],
          quantity_taken : 1,
          refrigerator_id : info["refrigerator_id"], 
          bar_code : info["bar_code"],
        } 
    }
    componentWillReceiveProps(props){
        const info = props.item;
        this.setState({
            id: info["id"],
            item_name : info["item_name"],
            status : info["status"],
            expiration_date : info["expiration_date"] ,
            CreatedOn : info["CreatedOn"],
            quantity : info["quantity"],
            quantity_taken : 1,
            refrigerator_id : info["refrigerator_id"], 
            bar_code : info["bar_code"],
        })

    }
    takeItem =async (onClose) =>{
        if(typeof this.state.quantity_taken !== 'number'){
            NotificationManager.error('Error message', "quantity can't be empty", 1000, () => {
                alert('callback');
            }); 
            return;
        }
        const data = {
            "refrigerator_id" : this.state.refrigerator_id,
            "id" : this.state.id,
            "quantity" : this.state.quantity_taken 
        }
        const response = await backendAPI.takeItemOutOFRefrigerator(data);
        if(response.statusCode === 200 ){
            NotificationManager.success('Success message', "succesfully took item out", 1000, () => {
                alert('callback');  
            });
            this.props.setItem(response.message.message);
            setTimeout(()=>{onClose()},1000);
        }else{
            NotificationManager.error('Error message', response.message.message, 1000, () => {
                alert('callback');
            });   
        }
        
    }
    handleInputQuantity = (e) =>{
        const numValue = Number(e.target.value);
        if(numValue === 0){
            this.setState({
                quantity_taken : ""
            })
            return;
        }
        if(typeof numValue === "number" && numValue <=this.state.quantity){
          this.setState({
             quantity_taken : numValue
          });
        }
      }
    render(){
        const labelQuantity = `Quantity you're taking (max = ${this.state.quantity})`;
      
        return(<div>
            <Modal.Dialog data-testid = "take-item">
              
  
                    <Modal.Header closeButton onClick = {this.props.onClose}>
                           <Modal.Title>Take Item</Modal.Title>
                       </Modal.Header>
      
                       <Modal.Body>
                           <h5>Please put quantity in</h5>
                       <MDBInput
                       onChange = {this.handleInputQuantity}
                       value= {this.state.quantity_taken}
                       label={labelQuantity}/>
                       <MDBInput
                       value= {this.state.item_name}
                       disabled
                       label="Item name" />
                        <MDBInput
                       value= {this.state.status}
                       disabled
                       label="Status" />
                        
                        
                       <div>Expiration Date &nbsp;&nbsp;
                       <DateTimePicker
                         value = {this.state.expiration_date} 
                          />
                              </div>
                        <MDBInput
                            value={this.state.bar_code}
                             label = "bar code"
                             disabled
                          />
                       
                       </Modal.Body>
      
                        <Modal.Footer>
                            <Button variant="secondary" onClick= {this.props.onClose}>Cancel</Button>
                           <Button variant="primary" onClick={()=>{this.takeItem(this.props.onClose)
                           }}>Take Item</Button>
                       </Modal.Footer>
                    </Modal.Dialog><NotificationContainer /></div> 
        );
    }
}