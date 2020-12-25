import React from "react";
//import backendAPI from '../Utils/backendAPI' 
import GetItemBarCode from './GetItemBarCode'
import { confirmAlert } from 'react-confirm-alert';
import AddPersonalItem from './AddPersonalItem';
import { Button} from 'react-bootstrap';
export default class ShowRefrigerator extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: props.match.params.id
        }
    }
    componentDidMount(){
      
    }

    createAddItemModal = () =>{
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div>
                     <AddPersonalItem onClose = {onClose}/>
                   </div>
                );
            }
        });
    }
    render(){
        console.log(this.state.id);
        return(
        <div>
            <Button onClick = {()=>{this.createAddItemModal()}}>Add personal Item</Button>
            {/* <GetItemBarCode /> */}
        </div>);
    }
}