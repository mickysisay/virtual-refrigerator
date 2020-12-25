import React from "react";
import backendAPI from '../Utils/backendAPI' 
import 'bootstrap/dist/css/bootstrap.css'
import { Button,Modal} from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {Grid} from '@material-ui/core';
import { MDBInput } from "mdbreact";
import './login.css'

export default class AddRefrigeratorModal extends React.Component{
   constructor(props){
       super(props);
       this.state ={
           refrigeratorName : "",
       }
   }
   handleInput= (e) =>{
      
       this.setState({
           refrigeratorName : e.target.value
       }) 
   }
   createRefrigerator = async (close)=>{
      if(this.state.refrigeratorName.trim().length <5){
          return;
      } 
      const response = await backendAPI.addRefrigerator(this.state.refrigeratorName);
      if(response.statusCode === 200 ){
      close();
      this.props.updateRef();
      }else{
          //something
      }
   }
   addRefrigeratorModal = () =>{
    confirmAlert({
        customUI: ({ onClose }) => {
            return (
               
                 <Modal.Dialog data-testid = "addRefrigeratorModal">
                
    
                 <Modal.Header closeButton onClick = {onClose}>
                        <Modal.Title>Add Refrigerator</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                    <MDBInput
                    onChange = {this.handleInput}
                    label="Refrigerator name" />
                    </Modal.Body>

                     <Modal.Footer>
                         <Button variant="secondary" onClick= {onClose}>Cancel</Button>
                        <Button variant="primary" onClick={()=>{this.createRefrigerator(onClose);
                        }}>Create</Button>
                    </Modal.Footer>
                 </Modal.Dialog>
               
            );
        }
    });
   }
   render() {
 
       return (
        <Grid container direction="row" className='mt-5'>
       <Button data-testid="addRefrigeratorButton" variant="secondary" size="lg" block
        onClick = {this.addRefrigeratorModal}
       >
        Add Refrigerator
       </Button>
       </Grid>
       
       );
       }
}