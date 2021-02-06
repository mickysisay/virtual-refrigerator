import React from "react";
import backendAPI from '../Utils/backendAPI'
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';
import './login.css'
import { Button, Modal } from 'react-bootstrap';
import { MDBInput } from 'mdbreact';
import DateTimePicker from 'react-datetime-picker';


export default class EditRefrigeratorItem extends React.Component {
    constructor(props) {
        super(props)
        const info = this.props.item;
        this.state = {
            id: info["id"],
            item_name: info["item_name"],
            status: info["status"],
            expiration_date: info["expiration_date"],
            CreatedOn: info["CreatedOn"],
            quantity: info["quantity"],
            refrigerator_id: info["refrigerator_id"],
            bar_code: info["bar_code"],
        }
    }

    editItemConfirm = async (onClose) => {
        const data = {
            "item_name": this.state.item_name,
            "id": this.state.id,
            "refrigerator_id": this.state.refrigerator_id,
            "quantity": this.state.quantity,
            "status": this.state.status,
        }
        if (typeof this.state.quantity !== 'number') {
            NotificationManager.error('Error message', "quantity can't be empty", 1000, () => {
                alert('callback');
            });
            return;
        }
        if (this.state.expiration_date !== null) {
            data["expiration_date"] = this.state.expiration_date.getTime();
        }

        if (data["item_name"].trim().length === 0) {

            NotificationManager.error('Error message', "item name cannot be empty", 1000, () => {
                alert('callback');
            });
            return;
        }
        const response = await backendAPI.editItemInRefrigerator(data);
        if (response.statusCode === 200) {
            NotificationManager.success('Success message', " item edited succesfully", 1000, () => {
                alert('callback');
            });
            this.props.setItem(response.message.message);
            setTimeout(() => { onClose() }, 1000);
        } else {
            NotificationManager.error('Error message', response.message.message, 1000, () => {
                alert('callback');
            });
        }
    }
    handleInputItemName = (e) => {
        this.setState({
            item_name: e.target.value
        });

    }
    handleInputQuantity = (e) => {
        const numValue = Number(e.target.value);
        if (numValue === 0) {
            this.setState({
                quantity: ""
            })
            return;
        }
        if (typeof numValue === "number" && numValue <= 100) {
            this.setState({
                quantity: numValue
            });
        }
    }
    handleExpirationDateChange = (e) => {

        this.setState({
            expiration_date: e
        });

    }

    render() {
        return (
            <div>
                <Modal.Dialog data-testid="addRefrigeratorModal">


                    <Modal.Header closeButton onClick={this.props.onClose}>
                        <Modal.Title>Edit Item</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <MDBInput
                            onChange={this.handleInputItemName}
                            value={this.state.item_name}
                            label="Item name" />
                        <MDBInput
                            onChange={this.handleInputQuantity}
                            value={this.state.quantity}
                            label="Quantity" />
                        {/* <MDBInput
                       value={this.state.barCode}
                       label="bar Code"
                       disabled  /> */}
                        <div>Expiration Date &nbsp;&nbsp;
                       <DateTimePicker
                                minDate={new Date()}
                                onChange={this.handleExpirationDateChange}
                                value={this.state.expiration_date}
                            />
                        </div>
                        <MDBInput
                            value={this.state.bar_code}
                            label="bar code"
                            disabled
                        />

                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.onClose}>Cancel</Button>
                        <Button variant="primary" onClick={() => {
                            this.editItemConfirm(this.props.onClose)
                        }}>edit Item</Button>
                    </Modal.Footer>
                </Modal.Dialog></div>

        );
    }
}