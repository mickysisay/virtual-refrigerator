import React from 'react';

import { 
    Redirect,
    n} from 'react-router-dom'
import { LogOut} from '../Utils/AuthenticatedRoute'


export class Logout extends React.Component{
   
  

   render(){
       console.log(this.props);
      this.props.updateLoggedIn();
       LogOut()
       
       return (
           <Redirect path="/login" />
       );
   }
}