import React from "react";
import ReactDOM from "react-dom";
import Requests from  "../Utils/Requests"

export default class Login extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            username:"",
            password:"",
            error:{
                status:false,
                message:""
            },
            isLoading:false
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
        }
    }
    handleLoginSubmit = async (e) =>{
        e.preventDefault();

        //set is loading to true;
        this.setState({
            isLoading : true
        });
       const resp = await Requests.loginPost(this.state);
       //resp has statusCode and message and status
       const statusCode = resp.statusCode;
       const message = resp.message.message;
       if(statusCode === 200){
            //redirect to other route
       }else{
           //display error message
           this.setState({
               error:{
                   status:true,
                   message: message
               }
           });
       }
       this.setState({
           isLoading : false
       });
       console.log(resp);
    }

    componentDidMount(){
     
    }
    
    render(){

        return (<div>
            <h1>Hello world</h1>
             <h4>{this.state.isLoading ? `Loading` : null}</h4>
            <hr></hr>
            <form onSubmit = {(e)=>{this.handleLoginSubmit(e)}}>
                <label>Username : <input type="text" id = "username" onChange = {(e)=>{this.handleInputChange(e)}} /></label><hr />
                <label>Password : <input type="password" id = "password" onChange = {(e) =>{this.handleInputChange(e)}} /></label><hr />
                <button>Login</button>
            </form><hr />
             <h3>{this.state.error.status ? this.state.error.message : null}</h3>
        </div>);
    };

}