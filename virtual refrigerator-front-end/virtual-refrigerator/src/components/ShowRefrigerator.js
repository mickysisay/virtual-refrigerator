import React from "react";
import backendAPI from '../Utils/backendAPI' 
import Sidebar from "react-sidebar";
import { confirmAlert } from 'react-confirm-alert';
import AddPersonalItem from './AddPersonalItem';
import { Button} from 'react-bootstrap';
import PersonalItemShow from "./PersonalItemShow";
import {Grid} from '@material-ui/core';
import './login.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBIcon,MDBFormInline } from 'mdbreact';
import RefrigeratorItemShow from "./RefrigeratorItemShow"
import AddRefrigeratorItem from "./AddRefrigeratorItem"
import { Navbar as Navigationbar, Nav as Navigation, Form } from 'react-bootstrap';

export default class ShowRefrigerator extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: props.match.params.id,
            personalItems : [],
            allItems:[],
            filteredPersonalItems : [],
            filteredAllItems : [],
            sidebarOpen : false
        }
    }
    componentDidMount(){
      this.getAllPersonalItems();
      this.getAllItems();
    }
    onSetSidebarOpen=(open)=> {
        this.setState({ sidebarOpen: open });
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
    createRefrigeratorItemModal = () =>{
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div>
                     <AddRefrigeratorItem refrigeratorId={this.state.id} itemInfo ={{}} setRefrigeratorItems ={this.setRefrigeratorItems} onClose = {onClose}/>
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
            <Sidebar
            sidebarClassName="side-bar"
        sidebar={<div><div className="home-button"><a href="/">Home</a></div>
    
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
              <PersonalItemShow key={e["id"]} setItem={this.setRefrigeratorItems} 
               setPersonalItems ={this.setPersonalItems} personalItem = {e} refrigeratorId={this.state.id} />
              )
          }): <div>No items found</div>}
          
         </div>
         </div>
        }
        open={this.state.sidebarOpen}
        onSetOpen={this.onSetSidebarOpen}
        styles={{ sidebar: { background: "white" } }}

        children = {
            <div>

        <Navigationbar bg="dark" variant="dark">
        <Navigationbar.Brand style={{cursor:"pointer"}} onClick={() => this.onSetSidebarOpen(true)}>Sidebar</Navigationbar.Brand>  
        
        <Navigation className="mr-auto">
        <Navigation.Link data-testid="homeButton" href="/">Home</Navigation.Link>
        </Navigation>
        <Form inline>
          <Navigation className="mr-auto">
            <Navigation.Link href="/logout">Logout</Navigation.Link> 
          </Navigation>
        </Form>
       </Navigationbar>  

       
            <div className = "refrigerator-items">
            <MDBFormInline className="md-form">
         <MDBIcon icon="search" />
             <input className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search Refrigerator Items"
          aria-label="Search"
          onChange = {this.filterAllItems} />
         </MDBFormInline>
         <Button block className="add-buttons"  onClick = {()=>{this.createRefrigeratorItemModal()}}>Add Refrigerator Item</Button>
         <Grid
                    container
                    direction="row"
                    justify="center"
                    spacing={32}
                    className='mt-4'
                    >
            {this.state.filteredAllItems.length !== 0 ?
            
            this.state.filteredAllItems.map((e)=>{ 
                 return (
                    <Grid key={e["id"]} >
                 <RefrigeratorItemShow  setItem ={this.setRefrigeratorItems} item = {e} />
                </Grid>                 )
             }): <div>No items found</div>}
             </Grid>
            </div>
            </div>
        }
      >
       
        </Sidebar>


        


         
          
            
            {/* <GetItemBarCode /> */}
            
        </div>);
    }
}