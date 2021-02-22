import React from "react";
import backendAPI from '../Utils/backendAPI'
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';
import { Button, Modal } from 'react-bootstrap';
import './login.css'
import { MDBIcon } from 'mdbreact';
import { confirmAlert } from 'react-confirm-alert';
import AddRefrigeratorItem from './AddRefrigeratorItem'

export default class PersonalItemShow extends React.Component {
    constructor(props) {
        super(props)
        const info = this.props.personalItem;
        this.state = {
            id: info["id"],
            itemName: info["item_name"],
            barCode: info["bar_code"],
            info: info
        }
    }
    addToRefrigerator = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <AddRefrigeratorItem onClose={onClose} refrigeratorId={this.props.refrigeratorId} setRefrigeratorItems={this.props.setItem} itemInfo={this.state.info} />
                );
            }
        });
    }
    deleteItem = async (onClose) => {
        const data = {
            "id": this.state.id,
        }
        const response = await backendAPI.deletePersonalItem(data);
        if (response.statusCode === 200) {
            this.props.setPersonalItems(response.message.message);
            NotificationManager.success('Success message', "item Deleted Sucessfully", 3000, () => {
                alert('callback');
            });
        } else {
            NotificationManager.error('Error message', response.message.message, 3000, () => {
                alert('callback');
            });
        }
        onClose();
    }
    deletePersonalItem = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div>
                        <Modal.Dialog>
                            <Modal.Header closeButton onClick={onClose}>
                                <Modal.Title>Delete Item</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <p>Are you sure you want to delete "{this.state.itemName}"?</p>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="primary" onClick={onClose}>No</Button>
                                <Button variant="danger" onClick={() => { this.deleteItem(onClose) }}>Delete</Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </div>
                );
            }
        });
    }
    render() {
        return (<div
        style={{cursor:"default"}}
        title={this.state.itemName}
        className="personal-Item" onClick={(e) => { console.log("whole") }}>
            <div className="left">
                {this.state.itemName}
            </div>
            <div className="right">
                <MDBIcon onClick={(e) => { e.stopPropagation(); this.deletePersonalItem() }} icon="trash-alt" className='mr-2' >
                </MDBIcon>
                <MDBIcon onClick={(e) => { e.stopPropagation(); this.addToRefrigerator() }} icon="plus" className='mr-1' >
                </MDBIcon>
            </div>
        </div>);
    }
}