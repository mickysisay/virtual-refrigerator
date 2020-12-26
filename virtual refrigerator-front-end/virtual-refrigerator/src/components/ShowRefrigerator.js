import React from "react";
import backendAPI from '../Utils/backendAPI' 
import GetItemBarCode from './GetItemBarCode'
import { confirmAlert } from 'react-confirm-alert';
import AddPersonalItem from './AddPersonalItem';
import { Button} from 'react-bootstrap';
import PersonalItemShow from "./PersonalItemShow";
import './login.css'
import { MDBIcon,MDBFormInline } from 'mdbreact';
import RefrigeratorItemShow from "./RefrigeratorItemShow"
export default class ShowRefrigerator extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: props.match.params.id,
            personalItems : [],
            allItems:[],
            filteredPersonalItems : [],
            filteredAllItems : []
        }
    }
    componentDidMount(){
      this.getAllPersonalItems();
      this.getAllItems();
    }
    getAllItems = async ()=>{
        const response = await backendAPI.getAllItemsInRefrigerator(this.state.id);
        console.log("response",response.message.message);
        if(response.statusCode === 200){
            this.setState({
                allItems : response.message.message,
                filteredAllItems : response.message.message
            });
        }else{
            this.props.history.push("/");
        }
    }
    setPersonalItems = (personalItems) =>{
        this.setState({
            personalItems : personalItems,
            filteredPersonalItems : personalItems
        });
    }
    setRefrigeratorItems = (item)=>{
        this.setState({
            allItems : item,
            filteredAllItems: item
        });
    }
    getAllPersonalItems =async () =>{
      const response = await backendAPI.getAllPersonalItems();
      if(response.statusCode === 200){
          this.setState({
              personalItems : response.message.message,
              filteredPersonalItems : response.message.message
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
    filterPersonalItems = (e) => {
      const val = e.target.value.toLowerCase();
      const newArray = this.state.personalItems.filter((e)=>{ 
        return e["item_name"].toLowerCase().includes(val);
      });
      this.setState({
          filteredPersonalItems : newArray
      });
    }
    filterAllItems = (e) => {
        const val = e.target.value.toLowerCase();
        const newArray = this.state.allItems.filter((e)=>{ 
          return e["item_name"].toLowerCase().includes(val);
        });
        this.setState({
            filteredAllItems : newArray
        });
      }
    render(){
        return(
        <div>
            
          <div className= "personal-Items"> 
          <MDBFormInline className="md-form">
        <MDBIcon icon="search" />
        <input className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search personal Items"
         aria-label="Search"
         onChange = {this.filterPersonalItems} />
      </MDBFormInline>
          <Button block className="add-buttons"  onClick = {()=>{this.createAddItemModal()}}>Add Personal Item</Button>
            {
            this.state.filteredPersonalItems.length !== 0 ?
            this.state.filteredPersonalItems.map((e)=>{ 
                return (
                <PersonalItemShow key={e["id"]}  setPersonalItems ={this.setPersonalItems} personalItem = {e} />
                )
            }): <div>No items found</div>}
            
           </div>
           <div className = "refrigerator-items">
           <MDBFormInline className="md-form">
        <MDBIcon icon="search" />
            <input className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search Refrigerator Items"
         aria-label="Search"
         onChange = {this.filterAllItems} />
        </MDBFormInline>

           {this.state.filteredAllItems.length !== 0 ?
           this.state.filteredAllItems.map((e)=>{ 
                return (
                <RefrigeratorItemShow key={e["id"]}  setItem ={this.setItem} item = {e} />
                )
            }): <div>No items found</div>}
           </div>
            
            {/* <GetItemBarCode /> */}
        </div>);
    }
}