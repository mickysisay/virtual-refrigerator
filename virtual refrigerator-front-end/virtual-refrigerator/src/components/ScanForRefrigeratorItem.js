import React from "react";
import backendAPI from '../Utils/backendAPI'
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import ItemScanner from './ItemScanner'
import 'bootstrap/dist/css/bootstrap.css'
import { Button,Modal} from 'react-bootstrap';
import './login.css'
import TakeItem from './TakeItem';

export default class ScanForRefrigeratorItem extends React.Component {
    constructor(props){
        super(props)
        //this.props.onClose
        //this.props.setItem
        
        this.state = {
            item:{},
            isScannerOn :true,
            refrigerator_id : this.props.refrigerator_id
        }
     
    }
    changeisScannerOn = (bool) =>{
       
      this.setState({
          isScannerOn :bool
      });
  }
  setBarCode = async (code) =>{
     const data = {
         "refrigerator_id": this.state.refrigerator_id,
         "bar_code" : code
     } 
     
    const response = await backendAPI.getItemByRefrigeratorIdAndBarCode(data);
        if(response.statusCode === 200){
          const item = response.message.message;
            this.setState({
              item : {...item[0]},
            });
            NotificationManager.success('Success message', "item retrieved succesfully", 1000, () => {
                alert('callback');
            });
            setTimeout(()=>{
                this.setState({
                    isScannerOn : false
                })
            },1000)
         }else{
            NotificationManager.error('Error message', response.message.message, 1000, () => {
                alert('callback');
            });
            setTimeout(()=>{this.props.onClose()},1000);
         }
  }
 

    render(){
      if(!this.state.isScannerOn){
      return(<div>
           <TakeItem onClose = {this.props.onClose} setItem = {this.props.setItem} item = {this.state.item}/>
          {/* <ItemScanner setBarCode = {this.setBarCode}/> */}
          <NotificationContainer /></div>);
      }else{
          return( <div id="outPopUp" >   
              <Button variant="primary" onClick = {async ()=>{
              await this.clickChild()
              this.props.onClose();  
              this.changeisScannerOn(false)}}>Cancel</Button>
               <ItemScanner  setCloseCamera = {(e)=>{
              this.clickChild = e} }  setBarCode = {this.setBarCode} changeisScannerOn = 
              {this.changeisScannerOn}/> 
               
         </div>);
      }
  }
}