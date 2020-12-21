import React from "react";
import backendAPI from '../Utils/backendAPI' 
import 'bootstrap/dist/css/bootstrap.css'
import { Button,Modal} from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { MDBInput,MDBIcon,Card } from "mdbreact";
import './login.css'

export default class EditRefrigratorModal extends React.Component{
//    constructor(props){
//         super(props);
//     //    const reff = props.refrigerator;
//     //    reff.refrigeratorName = reff["refrigerator_name"];
//     //    this.state ={
//     //        refrigerator :reff
//     //    }
//    }
//    handleInput= (e) =>{
//       const refrigerator = this.state.refrigerator;
//       refrigerator.refrigeratorName = e.target.value;
//        this.setState({
//            refrigeratorName : refrigerator
//        }) 
//    }
//    UpdateRefrigerator = async (close)=>{
//       if(this.state.refrigerator.refrigeratorName.trim().length <5){
//           return;
//       } 
//       const response = await backendAPI.updateRefrigerator(this.state.refrigerator.refrigeratorName,this.state.refrigerator.id);
//       if(response.statusCode === 200 ){
//       close();
//       this.props.updateRef();
//       }else{
//           //something
//       }
//    }
//    updateRefrigeratorModal = () =>{
//     confirmAlert({
//         customUI: ({ onClose }) => {
//             return (
               
//                  <Modal.Dialog>
                
    
//                  <Modal.Header closeButton onClick = {onClose}>
//                         <Modal.Title>Edit Refrigerator</Modal.Title>
//                     </Modal.Header>

//                     <Modal.Body>
//                     <MDBInput
//                     value = {this.state.refrigerator.refrigeratorName}
//                     onChange = {this.handleInput}
//                     label="Refrigerator name" />
//                     </Modal.Body>

//                      <Modal.Footer>
//                          <Button variant="secondary" onClick= {onClose}>Cancel</Button>
//                         <Button variant="primary" onClick={()=>{this.updateRefrigerator(onClose);
//                         }}>Update</Button>
//                     </Modal.Footer>
//                  </Modal.Dialog>
               
//             );
//         }
//     });
//    }
   render() {

       return (
        <Card.Body>
        <MDBIcon onClick={this.confirmDelete} icon="trash-alt" className='mr-5' >
        <Card.Link > Delete</Card.Link>
       </MDBIcon>
        <MDBIcon icon="pencil-alt" >
                <Card.Link onClick={() => { console.log("s") }}> Update</Card.Link>
        </MDBIcon>
        </Card.Body>
        
       );
       }
}