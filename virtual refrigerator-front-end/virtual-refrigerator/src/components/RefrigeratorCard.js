import React from "react";
//import backendAPI from '../Utils/backendAPI' 
import { Card, Button,Modal } from 'react-bootstrap';
import { MDBIcon,MDBInput } from 'mdbreact';
import 'bootstrap/dist/css/bootstrap.css'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import backendAPI from '../Utils/backendAPI'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import  EditRefrigratorModal from './EditRefrigeratorModal'

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US');

export default class RefrigeratorCard extends React.Component {
    editedRefrigerator = "";
    
    constructor(props) {
        super(props);
        this.state = {
            refrigerator: props.refrigerator,
            changeState:true
            
        }
        this.editedRefrigerator = props.refrigerator["refrigerator_name"];

    }
   
    deleteRefrigerator = async () => {
        //send data to delete
        const id = this.state.refrigerator.id;
        const response = await backendAPI.deleteRefrigerator(id);
        if (response.statusCode === 200) {
            this.props.updateRef();
        }
    }
    UpdateRefrigerator = async (close)=>{
        if(this.editedRefrigerator.trim().length <5){
            return;
        } 
        const response = await backendAPI.updateRefrigerator(this.editedRefrigerator,this.state.refrigerator.id);
        if(response.statusCode === 200 ){
            this.setState({
                changeState : this.state.changeState ? false :true
            })
            this.props.updateRef();
            close();
        
        }else{
            //something
        }
     }
    handleInput= (e) =>{
         this.editedRefrigerator = e.target.value;
     }
     updateRefrigeratorModal = () =>{
         
      
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                   
                     <Modal.Dialog>
                    
        
                     <Modal.Header closeButton onClick = {()=>{onClose()
                         this.editedRefrigerator = this.state.refrigerator["refrigerator_name"]
                      }}>
                            <Modal.Title>Edit Refrigerator</Modal.Title>
                        </Modal.Header>
    
                        <Modal.Body>
                        <MDBInput
                       valueDefault = {this.editedRefrigerator}
                        onChange = {this.handleInput}
                        label="Refrigerator name" />
                        </Modal.Body>
    
                         <Modal.Footer>
                             <Button variant="secondary" onClick = {()=>{onClose()
                         this.editedRefrigerator = this.state.refrigerator["refrigerator_name"]
                      }}>Cancel</Button>
                            <Button variant="primary" onClick={()=>{this.UpdateRefrigerator(onClose);
                            }}>Update</Button>
                        </Modal.Footer>
                     </Modal.Dialog>
                   
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
                            <Modal.Title>Delete Refrigerator</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                <p>Are you sure you want to delete "{this.state.refrigerator["refrigerator_name"]}"?</p>
                        </Modal.Body>

                         <Modal.Footer>
                             <Button variant="primary" onClick= {onClose}>No</Button>
                            <Button variant="danger" onClick={()=>{this.deleteRefrigerator()
                            onClose()}}>Delete</Button>
                        </Modal.Footer>
                     </Modal.Dialog>
                    </div>
                );
            }
        });
    }
    render() {
        console.log(this.state.refrigerator);
        const t = Date.parse(this.state.refrigerator["CreatedOn"]);

        // Apply each element to the Date function
        const d = new Date(t);
        
        return (
        <Card style={{ width: '18rem' }}>
            <Card.Body onClick={() => { this.props.handleClick(this.state.refrigerator["id"]) }}>
                <Card.Title>{this.editedRefrigerator} </Card.Title>
                <Card.Text>
                    Created {timeAgo.format(d)}
                </Card.Text>
            </Card.Body>

            <Card.Body>
                <MDBIcon onClick={this.confirmDelete} icon="trash-alt" className='mr-5' >
                    <Card.Link > Delete</Card.Link>
                </MDBIcon>
                <MDBIcon icon="pencil-alt" >
                <Card.Link onClick={() => { this.updateRefrigeratorModal()}}> Update</Card.Link>
             </MDBIcon>
            </Card.Body>
        </Card>);
    }
}