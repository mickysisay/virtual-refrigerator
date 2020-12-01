import React from "react";
import Requests from  "../Utils/Requests"
import LoadingButton from "./LoadingButton"
export default class SignUp extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            username :"",
            password : "",
            email : "",
            confirmPassword : "",
            isLoading : false,
            responseError:{
                status:false,
                message:""
            },
            inputError:{
                status:false,
                message:""
            }
        }
    }
    handleInputChange = (e) =>{
        if(e.target.id === "username"){
        this.setState({
          username : e.target.value        
        });
        }else if(e.target.id === "password"){
            this.setState({
                password:e.target.value
            });
        }else if(e.target.id === "confirmPassword"){
            this.setState({
                confirmPassword : e.target.value
            });
        }else if(e.target.id === "email"){
            this.setState({
                email : e.target.value
            });
        }
    }

    handleLoginSubmit = e =>{
        e.preventDefault();
        console.log(this.state);
    }
    handlePasswordMatch = e =>{
        if(this.state.password !== this.state.confirmPassword){
            this.setState({
               inputError :{
                   status : true,
                   message : "passwords don't match"
               } 
            });
        } else{
            if(this.state.inputError.status){
                this.setState({
                    inputError : {
                        status : false,
                        message : ""
                    }
                });
            }
        }
    }


    render(){

        return (<div>
            <h1>Hello world</h1>
             <div>{this.state.isLoading ? <LoadingButton /> : null}</div>
             
            <hr></hr>
            <form onSubmit = {(e)=>{this.handleLoginSubmit(e)}}>
                <label>Username : <input type="text" id = "username" onChange = {(e)=>{this.handleInputChange(e)}} /></label><hr />
                <label>Password : 
                <input 
                 type="password" 
                 id = "password" 
                 onChange = {(e) =>{this.handleInputChange(e)}} 
                 onBlur={e => this.handlePasswordMatch(e)}  /></label><hr />
                <label>confirm password : 
                <input type="password" 
                id="confirmPassword" 
                onBlur={e => this.handlePasswordMatch(e)}  
                onChange={e=>this.handleInputChange(e)} /></label><hr />
                <label>email : <input type="text" id="email"  onChange = {(e) =>{this.handleInputChange(e)} }/> </label><hr />
                <h4>{this.state.inputError.status ? this.state.inputError.message : null}</h4>
                <button>Login</button>
            </form><hr />
             <h3>{this.state.responseError.status ? this.state.responseError.message : null}</h3>
        </div>);
    };
}