import React from "react";
import backendAPI from '../Utils/backendAPI'
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';
import ItemScanner from './ItemScanner'
import { MDBInput, MDBInputGroup } from "mdbreact";
import 'bootstrap/dist/css/bootstrap.css'
import { Button, Modal } from 'react-bootstrap';
import './login.css'
import DateTimePicker from 'react-datetime-picker';

export default class AddRefrigeratorItem extends React.Component {
  constructor(props) {
    super(props)
    const itemInfo = this.props.itemInfo;
    const itemName = typeof itemInfo["item_name"] !== "string" ? "" : itemInfo["item_name"];
    const barCode = typeof itemInfo["bar_code"] !== "string" ? "" : itemInfo["bar_code"];
    const refrigeratorId = this.props.refrigeratorId;
    this.state = {
      item_name: itemName,
      barCode: barCode,
      quantity: 1,
      expiration_date: null,
      isScannerOn: false,
      refrigeratorId: refrigeratorId
    }

  }
  changeisScannerOn = (bool) => {

    this.setState({
      isScannerOn: bool
    });
  }
  setBarCode = async (code) => {
    const response = await backendAPI.getPersonalItemWithBarcode(code);
    if (response.statusCode === 200) {
      const item = response.message.message;

      this.setState({
        item_name: item["item_name"],
        barCode: item["bar_code"]
      });
      NotificationManager.success('Success message', "item retrieved succesfully", 1000, () => {
        alert('callback');
      });
      console.log(this.state.item_name);
    } else {
      NotificationManager.error('Error message', response.message.message, 3000, () => {
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
  addRefrigeratorlItem = async () => {
    const data = {
      "item_name": this.state.item_name,
      "bar_code": this.state.barCode,
      "refrigerator_id": this.state.refrigeratorId,
      "quantity": this.state.quantity
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
    const response = await backendAPI.addRefrigeratorItem(data);
    if (response.statusCode === 200) {
      NotificationManager.success('Success message', " item added to refrigerator succesfully", 1000, () => {
        alert('callback');
      });
      this.props.setRefrigeratorItems(response.message.message);
      setTimeout(() => { this.props.onClose(); }, 1000);
    } else {
      NotificationManager.error('Error message', response.message.message, 1000, () => {
        alert('callback');
      });
    }

  }
  handleExpirationDateChange = (e) => {
    this.setState({
      expiration_date: e
    });
  }

  render() {
    if (!this.state.isScannerOn) {
      return (<div>
        <Modal.Dialog data-testid="addRefrigeratorModal">


          <Modal.Header closeButton onClick={this.props.onClose}>
            <Modal.Title>Add Item To Refigerator</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <MDBInput
              onChange={this.handleInputItemName}
              value={this.state.item_name}
              label="Item name" />
            <MDBInput
              onChange={this.handleInputQuantity}
              value={this.state.quantity}
              data-testid = "Quantity-item-add"
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
            <MDBInputGroup
              material
              value={this.state.barCode}
              hint="bar Code"
              disabled
              append={
                <Button variant="secondary" onClick={() => { this.changeisScannerOn(true) }}>Scan</Button>
              }
            />

          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.onClose}>Cancel</Button>
            <Button variant="primary" onClick={() => {
              this.addRefrigeratorlItem();
            }}>Add Item</Button>
          </Modal.Footer>
        </Modal.Dialog>

        {/* <ItemScanner setBarCode = {this.setBarCode}/> */}
      </div>);
    } else {
      return (<div id="outPopUp" >
        <Button variant="primary" onClick={() => {
          this.clickChild()
          this.changeisScannerOn(false)
        }}>Cancel</Button>
        <ItemScanner setCloseCamera={(e) => {
          this.clickChild = e
        }} setBarCode={this.setBarCode} changeisScannerOn=
          {this.changeisScannerOn} />

      </div>);
    }
  }
}