import React from "react";
import backendAPI from "../Utils/backendAPI";
import "react-notifications/lib/notifications.css";
import { NotificationManager } from "react-notifications";
import ItemScanner from "./ItemScanner";
import { MDBInput, MDBInputGroup } from "mdbreact";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Modal } from "react-bootstrap";
import "./login.css";

export default class AddPersonalItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: "",
      barCode: "",
      image: null,
      isScannerOn: false,
    };
  }
  setBarCode = async (code) => {
    //code = "009800895250";
    const response = await backendAPI.getBarCodeInfo(code);
    console.log(response);
    if(response.statusCode === 200){
      const data = response.message.message;
       this.setState({
         itemName : data.name,
         barCode : data.barcode,
         image : data.image
       })
       NotificationManager.success(
        "Success message",
        "Item found succesfully",
        3000
      );
    }else{
      this.setState({
        barCode: code,
      });
      NotificationManager.error(
        "Error message",
        "No item found,please insert info manually",
        3000
      );  
    }
    
  };
  addPersonalItem = async () => {
    const data = {
      item_name: this.state.itemName,
      bar_code: this.state.barCode,
    };
    if (data["item_name"].trim().length === 0) {
      NotificationManager.error(
        "Error message",
        "item name cannot be empty",
        1000
      );
      return;
    }
    const response = await backendAPI.addPersonalItem(data);
    if (response.statusCode === 200) {
      NotificationManager.success(
        "Success message",
        "personal item added succesfully",
        1000
      );
      this.props.setPersonalItems(response.message.message);
      setTimeout(() => {
        this.props.onClose();
      }, 1000);
    } else {
      NotificationManager.error(
        "Error message",
        response.message.message || "something went wrong",
        1000,
        () => {
          alert("callback");
        }
      );
    }
  };
  handleInput = (e) => {
    this.setState({
      itemName: e.target.value,
    });
  };

  changeisScannerOn = (bool) => {
    this.setState({
      isScannerOn: bool,
    });
  };
  render() {
    if (!this.state.isScannerOn) {
      return (
        <div>
          <Modal.Dialog>
            <Modal.Header closeButton onClick={this.props.onClose}>
              <Modal.Title>Add Personal Item</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <MDBInput
                onChange={this.handleInput}
                value={this.state.itemName}
                label="Item name"
                data-testid="personal-item-name"
              />
              <MDBInputGroup
                material
                value={this.state.barCode}
                hint="bar Code"
                disabled
                append={
                  <Button
                    data-testid="scan-personal-item"
                    variant="secondary"
                    onClick={() => {
                      this.changeisScannerOn(true);
                    }}
                  >
                    Scan
                  </Button>
                }
              />
            </Modal.Body>

            <Modal.Footer>
              <Button
                data-testid="cancel-personal-item-modal"
                variant="secondary"
                onClick={this.props.onClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  this.addPersonalItem();
                }}
                data-testid="add-personal-item"
              >
                Add Item
              </Button>
            </Modal.Footer>
          </Modal.Dialog>

          {/* <ItemScanner setBarCode = {this.setBarCode}/> */}
        </div>
      );
    } else {
      return (
        <div id="outPopUp">
          <Button
            variant="primary"
            onClick={() => {
              this.clickChild();
              this.changeisScannerOn(false);
            }}
          >
            Cancel
          </Button>
          <ItemScanner
            setCloseCamera={(e) => {
              this.clickChild = e;
            }}
            setBarCode={this.setBarCode}
            changeisScannerOn={this.changeisScannerOn}
          />
        </div>
      );
    }
  }
}
