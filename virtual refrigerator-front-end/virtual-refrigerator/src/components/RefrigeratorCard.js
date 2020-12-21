import React from "react";
//import backendAPI from '../Utils/backendAPI' 
import { Card} from 'react-bootstrap';
import { MDBIcon} from 'mdbreact';
import 'bootstrap/dist/css/bootstrap.css'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import backendAPI from '../Utils/backendAPI' 

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US');

export default class RefrigeratorCard extends React.Component{
   constructor(props){
       super(props);
       this.state = {
           refrigerator : props.refrigerator,
           showModal : false
       }
   } 
    deleteRefrigerator = async () =>{
       //send data to delete
       const id = this.state.refrigerator.id;
       const response = await backendAPI.deleteRefrigerator(id);
       if(response.statusCode === 200){    
          this.props.updateRef();
       }
   }
   render(){
     
    const t = Date.parse(this.state.refrigerator["CreatedOn"]);

    // Apply each element to the Date function
    const d = new Date(t);
       return(<Card style={{ width: '18rem' }}>
       <Card.Body onClick = {()=>{this.props.handleClick(this.state.refrigerator["id"])}}>
         <Card.Title>{this.state.refrigerator["refrigerator_name"]} </Card.Title>
         <Card.Text>
           Created {timeAgo.format(d)}  
         </Card.Text>
       </Card.Body>
      
       <Card.Body>
           <MDBIcon onClick ={this.deleteRefrigerator} icon="trash-alt" className='mr-5' >
         <Card.Link > Delete</Card.Link>
         </MDBIcon>
         <MDBIcon icon="pencil-alt" >
         <Card.Link onClick ={()=>{console.log("s")}}> Update</Card.Link>
         </MDBIcon>
       </Card.Body>
     </Card>);
   }
}