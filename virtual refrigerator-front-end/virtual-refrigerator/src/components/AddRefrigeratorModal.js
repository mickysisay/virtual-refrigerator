import React from "react";
import backendAPI from '../Utils/backendAPI'
import 'bootstrap/dist/css/bootstrap.css'
import { Button, Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Grid } from '@material-ui/core';
import { MDBInput,MDBIcon } from "mdbreact";
import { Card } from 'react-bootstrap';
import './login.css'
import NotificationManager from "react-notifications/lib/NotificationManager";

export default class AddRefrigeratorModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refrigeratorName: "",
        }
    }
    handleInput = (e) => {

        this.setState({
            refrigeratorName: e.target.value
        })
    }
    createRefrigerator = async (close) => {
        console.log(this.state);
        if (this.state.refrigeratorName.trim().length < 2) {
            NotificationManager.error('Error message', "Refrigerator name should be atleast 2 characters long", 3000, () => {
                alert('callback');
            });
            return;
        }
        const response = await backendAPI.addRefrigerator(this.state.refrigeratorName);
        if (response.statusCode === 200) {
            close();
            this.props.updateRef();
        } else {
            //something
            NotificationManager.error('Error message', response.message.message, 3000, () => {
                alert('callback');
            });
        }
    }
    addRefrigeratorModal = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (

                    <Modal.Dialog data-testid="addRefrigeratorModal">


                        <Modal.Header closeButton onClick={onClose}>
                            <Modal.Title>Add Refrigerator</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <MDBInput
                                onChange={this.handleInput}
                                label="Refrigerator name" />
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={onClose}>Cancel</Button>
                            <Button variant="primary" onClick={() => {
                                this.createRefrigerator(onClose);
                            }}>Create</Button>
                        </Modal.Footer>
                    </Modal.Dialog>

                );
            }
        });
    }
    render() {

        return (

            <Card 
            className = "refrigerator-card"
            style={{ width: '18rem', height: '12rem' }}
            onClick={this.addRefrigeratorModal}>
                        <Card.Body>
                                <MDBIcon style={{marginLeft:"90px",marginTop:"-5px"}} icon="plus" size="5x" />
                                <Card.Text style={{fontSize : "30px",marginTop:"20px",marginLeft:"15px"}}>
                                  add refrigerator
                                </Card.Text>
                        </Card.Body>
             </Card>

  

        );
    }
}