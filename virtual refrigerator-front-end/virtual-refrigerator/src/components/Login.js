import React from "react";
import ReactDOM from "react-dom";
import Requests from "../Utils/Requests"
import LoadingButton from "./LoadingButton"
import { Navbar as Navigationbar, Nav as Navigation, Form, Button } from 'react-bootstrap';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBIcon, MDBModalFooter } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './login.css'
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            inputError: {
                status: true,
                message: "Username is empty"
            },
            error: {
                status: false,
                message: ""
            },
            isLoading: false
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
        }
    }
    handleLoginSubmit = async (e) => {
        e.preventDefault();
        console.log(this.props.location.state.referrer);
        if(this.state.inputError.status){
            this.setState({
                error:{
                    status:true,
                    message:this.state.inputError.message  
                }
            })
            
        }else{
        //set is loading to true;
        this.setState({
            isLoading: true
        });
        const resp = await Requests.loginPost(this.state);
        //resp has statusCode and message and status
        const statusCode = resp.statusCode;
        const message = resp.message.message;
        console.log(statusCode);
        if (statusCode === 200) {
            
            this.props.history.push(this.props.location.state.referrer ? "main" : this.props.location.state.referrer)
            //redirect to other route
        } else {
            //display error message
            this.setState({
                error: {
                    status: true,
                    message: message
                }
            });

        }
        this.setState({
            isLoading: false
        });
        console.log(resp);
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
        
    }

    render() {

        return (<div>

            <div>{this.state.isLoading ? <LoadingButton /> : null}</div>
            <div className=" login-bar">
                <MDBContainer className="align-middle">
                    <MDBRow>
                        <MDBCol md="6">
                            <MDBCard>
                                <MDBCardBody>
                                    <MDBCardHeader className="form-header deep-blue-gradient rounded">
                                        <h3 className="my-3">
                                            <MDBIcon icon="lock" /> Login:
                                         </h3>
                                    </MDBCardHeader>
                                    <form onSubmit={(e) => { this.handleLoginSubmit(e) }}>
                                        <div className="grey-text">
                                            <MDBInput label="username" icon="user"
                                                id="username"
                                                onChange={(e) => { this.handleInputChange(e) }}
                                                onBlur={(e) => { this.validateInput(e) }} />
                                            <MDBInput label="password" icon="lock" group type="password" validate
                                                id="password" onChange={(e) => { this.handleInputChange(e) }}
                                                onBlur={(e) => { this.validateInput(e) }}  />
                                        </div>
                                        <div className="text-center">
                                            <MDBBtn onClick={(e) => { this.handleLoginSubmit(e) }}>Login</MDBBtn>
                                        </div>
                                    </form>
                                    <MDBModalFooter>
                                        <div className="font-weight-light">
                                            <p>Not a member?  Sign Up</p>

                                        </div>
                                    </MDBModalFooter>
                                </MDBCardBody>
                            </MDBCard>

                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
                <NotificationContainer />
            </div>


        </div>);
    };

}