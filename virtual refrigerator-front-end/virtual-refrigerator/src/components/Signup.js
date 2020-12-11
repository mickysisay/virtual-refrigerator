import React from "react";
import Requests from "../Utils/Requests"
import LoadingButton from "./LoadingButton"
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBIcon, MDBModalFooter } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './login.css'
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

export default class SignUp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            email: "",
            confirmPassword: "",
            isLoading: false,
            responseError: {
                status: false,
                message: ""
            },
            inputError: {
                status: false,
                message: ""
            }
        }
    }
    handleInputChange = (e) => {
        if (e.target.id === "username") {
            this.setState({
                username: e.target.value
            });
        } else if (e.target.id === "password") {
            this.setState({
                password: e.target.value
            });
        } else if (e.target.id === "confirmPassword") {
            this.setState({
                confirmPassword: e.target.value
            });
        } else if (e.target.id === "email") {
            this.setState({
                email: e.target.value
            });
        }
    }

    handleSignupSubmit = e => {
        e.preventDefault();
        console.log(this.state);
    }
    handlePasswordMatch = e => {
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({
                inputError: {
                    status: true,
                    message: "passwords don't match"
                }
            });
        } else {
            if (this.state.inputError.status) {
                this.setState({
                    inputError: {
                        status: false,
                        message: ""
                    }
                });
            }
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.responseError.status === true) {
            NotificationManager.error('Error message', this.state.responseError.message, 1000, () => {
                alert('callback');
            });
            this.setState({
                responseError: {
                    status: false,
                    message: ""
                }
            });
        }

    }
    validateInput = e => {
        if (e.target.id === "username") {
           if(this.state.username.length <6){
               this.setState({
                   inputError:{
                       status:true,
                       message:"username too short"
                   }
               })
           }else{
            this.setState({
                inputError:{
                    status:false,
                    message:""
                }
            })
           }
        } else if (e.target.id === "password") {
            if(this.state.password.length <6){
                this.setState({
                    inputError:{
                        status:true,
                        message:"password too short"
                    }
                })
            }else{
             this.setState({
                 inputError:{
                     status:false,
                     message:""
                 }
             })
            }
        }
    }


    render() {

        return (
            <div>

                <div>{this.state.isLoading ? <LoadingButton /> : null}</div>
                <div className=" login-bar">
                    <MDBContainer className="align-middle">
                        <MDBRow>
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
                                                <MDBInput label="username" icon="user"
                                                    id="username"
                                                    onChange={(e) => { this.handleInputChange(e) }}
                                                    onBlur={(e) => { this.validateInput(e) }} />
                                                <MDBInput label="password" icon="lock" group type="password" validate
                                                    id="password" onChange={(e) => { this.handleInputChange(e) }}
                                                    onBlur={(e) => {
                                                        this.validateInput(e)
                                                        this.handlePasswordMatch(e)
                                                    }} />
                                                <MDBInput label="confirm password" icon="lock" group type="password" validate
                                                    id="confirmPassword" onChange={(e) => { this.handleInputChange(e) }}
                                                    onBlur={(e) => {
                                                        this.validateInput(e);
                                                        this.handlePasswordMatch(e)
                                                    }} />
                                            </div>
                                            <div className="text-center">
                                                <MDBBtn onClick={(e) => { this.handleSignupSubmit(e) }}>Sign Up</MDBBtn>
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
                    <NotificationContainer />
                </div>

            </div>
        );
    };
}