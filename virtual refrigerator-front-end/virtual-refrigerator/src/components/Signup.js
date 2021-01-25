import React from "react";
import backendAPI from '../Utils/backendAPI'
import LoadingButton from "./LoadingButton"
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBIcon, MDBModalFooter } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './login.css'
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';

export default class SignUp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username :{
                value :"",
                error: ""
            },
            password :{
                value: "",
                error: ""
            },
            email :{
                value :"",
                error: ""
            },
            confirmPassword :{
                value: "",
                error: ""
            },
            error : {
                status : false,
                message : ""
            },
            success : {
                status : false,
                message : ""
            },
            isLoading: false,
        }
    }
    handleInputChange = (e) => {
        const key = this.state[e.target.id];
         key.value = e.target.value;
        if (e.target.id === "username") {
            this.setState({
                username: key
            });
        } else if (e.target.id === "password") {
            this.setState({
                password: key
            });
        } else if (e.target.id === "confirmPassword") {
            this.setState({
                confirmPassword: key
            });
        } else if (e.target.id === "email") {
            this.setState({
                email: key
            });
        }
    }
    handleBlurUsername = (e) => {
        const username = this.state.username;
        
        if(this.state.username.value === ""){
            username.error = "Username is empty";
            this.setState({
                username : username
            });
        }else if(this.state.username.value.length < 6){
            username.error ="Username too short" ;
            this.setState({
                username : username
            });
        }else{
            username.error = "";
            this.setState({
                username : username
            });
        }
    }
    handleBlurPassword = (e) => {
        const password = this.state.password;
        if(this.state.password.value === ""){
            password.error = "Password can't be empty";
            this.setState({
                password :password
            });
        }else if(this.state.password.value.length < 6){
            password.error = "Password is too short" ;
            this.setState({
                password : password
            });
        }else{
            password.error = "";
            this.setState({
                password : password
            });
        }
    }
    handleBlurEmail = (e) => {
        const email = this.state.email;
        if(this.state.email.value === ""){
            email.error = "Email can't be empty";
            this.setState({
                email:email
            });
        }else if(this.state.email.value.length < 6){
            email.error = "Email is too short" ;
            this.setState({
                email:email
            });
        }else{
            email.error = "";
            this.setState({
                    email:email
            });
        }
    }
    handleBlurConfirmPassword = (e) => {
        const confirmPassword = this.state.confirmPassword;
        if(this.state.password.value !== this.state.confirmPassword.value){
            confirmPassword.error = "Passwords don't match";
            this.setState({
                confirmPassword : confirmPassword
            });
        }else{
            confirmPassword.error = "";
            this.setState({
                confirmPassword:confirmPassword
            });
        }
    }

    handleSignupSubmit = async e => {
        e.preventDefault();

        if (this.state.username.value.length === 0) {
            const username = this.state.username;
            username.error = "username can't be empty";
            this.setState({
                username:username
            });
            return;
        }
        if (this.state.password.value.length === 0) {
            const password = this.state.password;
            password.error = "password can't be empty";
            this.setState({
                password : password
            });
            return;
        }
        if (this.state.email.value.length === 0) {
            const email = this.state.email;
            email.error = "email can't be empty";
            this.setState({
                email: email
            });
            return;
        }
        if (this.state.confirmPassword.value !== this.state.password.value) {
            const confirmPassword = this.state.confirmPassword;
            confirmPassword.error = "passwords don't match"
            this.setState({
                confirmPassword : confirmPassword
            });
            return;
        }
        if (this.state.username.error !== "" || this.state.password.error !== "" || this.state.email.error !==""
        || this.state.confirmPassword.error !== "") {
            return;
        }
        //send request
        const requestBody = {
            "username" : this.state.username.value,
            "password" : this.state.password.value,
            "email" : this.state.email.value 
        }
       const resp = await backendAPI.signupRequest(requestBody);
       const statusCode = resp.statusCode;
       const message = resp.message.message;
       if(statusCode === 200){
        this.setState({
            success :{
                status:true,
                message: "signed up successfully"
            },
            isLoading: true
        });
         
        setTimeout(()=>{this.props.history.push("login")},2000)  
        
       }else{
           this.setState({
               error : {
                   status : true,
                   message : message
               }
           });
       }
    }
   
    componentDidUpdate(prevProps, prevState) {
        if (this.state.error.status === true) {
            NotificationManager.error('Error message', this.state.error.message, 1000, () => {
                alert('callback');
            });
            this.setState({
                error: {
                    status: false,
                    message: ""
                }
            });
        }
        if(this.state.success.status === true){
            NotificationManager.success('Success message', this.state.success.message, 1000, () => {
                alert('callback');
            });
            this.setState({
                success: {
                    status: false,
                    message: ""
                }
            });
        }

    }


    render() {

        return (
            <div>

                <div>{this.state.isLoading ? <LoadingButton /> : null}</div>
                <div className=" login-bar">
                    <MDBContainer className="align-middle mt-5">
                        <MDBRow   className="align-middle align-items-center justify-content-center mt-5">
                            <MDBCol md="6">
                                <MDBCard>
                                    <MDBCardBody>
                                        <MDBCardHeader className="form-header deep-blue-gradient rounded">
                                            <h3 className="my-3 ">
                                                <MDBIcon icon="user-plus" /> Sign Up
                                         </h3>
                                        </MDBCardHeader>
                                        <form onSubmit={(e) => { this.handleSignupSubmit(e) }}>
                                            <div className="grey-text">
                                                <MDBInput label="Username" icon="user"
                                                    id="username"
                                                    onChange={(e) => { this.handleInputChange(e) }}
                                                    onBlur={(e) => {this.handleBlurUsername(e) }}
                                                    data-testid="username" />
                                                      <p className="error-message"
                                                      data-testid="usernameError">{this.state.username.error}</p>
                                                       <MDBInput label="Email" icon="at" group type="email" validate
                                                    id="email" onChange={(e) => { this.handleInputChange(e) }}
                                                    onBlur={(e) => {
                                                        this.handleBlurEmail(e);
                                                    }} 
                                                    data-testid="email"/>
                                                      <p className="error-message"
                                                      data-testid="emailError">{this.state.email.error}</p>
                                                <MDBInput label="Password" icon="lock" group type="password" validate
                                                    id="password" onChange={(e) => { this.handleInputChange(e) }}
                                                    onBlur={(e) => {
                                                        this.handleBlurPassword(e)
                                                    }} 
                                                    data-testid="password"/>
                                                      <p className="error-message"
                                                      data-testid="passwordError">{this.state.password.error}</p>
                                                <MDBInput label="Confirm Password" icon="lock" group type="password" validate
                                                    id="confirmPassword" onChange={(e) => { this.handleInputChange(e) }}
                                                    onBlur={(e) => {
                                                        this.handleBlurConfirmPassword(e);
                                                    }} 
                                                    data-testid="confirmPassword"/>
                                                      <p className="error-message"
                                                      data-testid="confirmPasswordError">{this.state.confirmPassword.error}</p>
                                                
                                            </div>
                                            <div className="text-center">
                                                <MDBBtn onClick={(e) => { this.handleSignupSubmit(e) }}
                                                data-testid="signupButton"
                                                >Sign Up</MDBBtn>
                                            </div>
                                        </form>
                                        <MDBModalFooter>
                                            <div className="font-weight-light">
                                                <p>Already have an account? <a href="/login"> Login</a></p>

                                            </div>
                                        </MDBModalFooter>
                                    </MDBCardBody>
                                </MDBCard>

                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </div>

            </div>
        );
    };
}