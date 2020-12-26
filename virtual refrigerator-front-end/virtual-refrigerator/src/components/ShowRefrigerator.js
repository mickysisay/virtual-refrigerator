import React from "react";
import backendAPI from '../Utils/backendAPI' 
import GetItemBarCode from './GetItemBarCode'
import { confirmAlert } from 'react-confirm-alert';
import AddPersonalItem from './AddPersonalItem';
import { Button} from 'react-bootstrap';
import PersonalItemShow from "./PersonalItemShow";
import './login.css'
export default class ShowRefrigerator extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: props.match.params.id,
            personalItems : []
        }
    }
    componentDidMount(){
      this.getAllPersonalItems();
    }
    setPersonalItems = (personalItems) =>{
        this.setState({
            personalItems : personalItems
        });
    }
    getAllPersonalItems =async () =>{
      const response = await backendAPI.getAllPersonalItems();
      console.log("response",response);
      if(response.statusCode === 200){
          this.setState({
              personalItems : response.message.message
          });
      }
    }

   
    createAddItemModal = () =>{
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div>
                     <AddPersonalItem setPersonalItems ={this.setPersonalItems} onClose = {onClose}/>
                   </div>
                );
            }
        });
    }
    render(){
        console.log(this.state.id);
        return(
        <div>
            
          <div className= "personal-Items"> 
          <Button onClick = {()=>{this.createAddItemModal()}}>Add personal Item</Button>
            {this.state.personalItems.map((e)=>{
                
                return (
               
                <PersonalItemShow key={e["id"]}  setPersonalItems ={this.setPersonalItems} personalItem = {e} />
                )
            })}
            
           </div>
            
            {/* <GetItemBarCode /> */}
        </div>);
    }
}