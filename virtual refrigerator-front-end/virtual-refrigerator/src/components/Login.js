import React from "react";
import LoadingButton from "./LoadingButton"
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBIcon, MDBModalFooter } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './login.css'
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import backendAPI from '../Utils/backendAPI'
import LoadingOverlay from 'react-loading-overlay';
export default class Login extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            username: {
                value: "",
                error: ""
            },
            password: {
                value: "",
                error: ""
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
            const username = this.state.username;
            username.value = e.target.value;
            this.setState({
                username: username
            });
        } else if (e.target.id === "password") {
            const password = this.state.password;
            password.value = e.target.value;
            this.setState({
                password: password
            });
        }
        
    }
    handleBlurUsername = (e) => {
        //const whichInput = e.target.id;
        const username = this.state.username;

        if (this.state.username.value === "") {
            username.error = "Username is empty";
            this.setState({
                username: username
            });
        } else if (this.state.username.value.length < 6) {
            username.error = "Username too short";
            this.setState({
                username: username
            });
        } else {
            username.error = "";
            this.setState({
                username: username
            });
        }
    }
    handleBlurPassword = (e) => {
        const password = this.state.password;
        if (this.state.password.value === "") {
            password.error = "Password can't be empty";
            this.setState({
                password: password
            });
        } else if (this.state.password.value.length < 6) {
            password.error = "Password is too short";
            this.setState({
                password: password
            });
        } else {
            password.error = "";
            this.setState({
                password: password
            });
        }
    }
    handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (this.state.username.value.length === 0) {
            const username = this.state.username;
            username.error = "username can't be empty";
            this.setState({
                username: username
            });
            return;
        }
        if (this.state.password.value.length === 0) {
            const password = this.state.password;
            password.error = "password can't be empty";
            this.setState({
                password: password
            });
            return;
        }

        if (this.state.username.error !== "" || this.state.password.error !== "") {
            return;
        }
        //set is loading to true;
        this.setState({ isLoading: true });
        const dataToSend = {
            "username": this.state.username.value,
            "password": this.state.password.value
        }
        const resp = await backendAPI.loginRequest(dataToSend);

        //resp has statusCode and message and status
        const statusCode = resp.statusCode;
        const message = resp.message.message;
        let referrer = "";
        try {
            referrer = this.props.location.state.referrer;
        } catch (ex) { };

        if (statusCode === 200) {
            const token = resp.message.type + " " + resp.message.token;
            localStorage.setItem("token", token);
            this.props.updateLoggedIn();
            this.props.history.push(referrer);
           
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
      
       
            this.setState({ isLoading: false });

      



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
        return ( <LoadingOverlay
            active={this.state.isLoading}
            spinner
                text='Loading your content...'
        ><div>

            {/* <div>{!this.state.isLoading ? 
            //<div>loading</div>
            
            <LoadingButton />
             : null}</div> */}
            
            <div className=" login-bar">
                <MDBContainer className=" mt-5"  >
                    <MDBRow className="align-middle align-items-center justify-content-center mt-5">
                        <MDBCol md="6">
                            <MDBCard >
                                <MDBCardBody >
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
                                                onBlur={(e) => { this.handleBlurUsername(e) }}
                                                data-testid="username" />
                                            <p
                                            data-testid = "usernameError"
                                            className="error-message">{this.state.username.error}</p>
                                            <MDBInput label="password" icon="lock" group type="password" validate
                                                id="password" onChange={(e) => { this.handleInputChange(e) }}
                                                onBlur={(e) => { this.handleBlurPassword(e) }} 
                                                data-testid="password">
                                               
                                                </MDBInput>
                                            <p
                                            data-testid = "passwordError"
                                            className="error-message">{this.state.password.error}</p>
                                        </div>
                                        <div className="text-center">
                                            <MDBBtn onClick={(e) => { this.handleLoginSubmit(e) }}
                                            data-testid="loginButton">Login</MDBBtn>
                                        </div>
                                    </form>
                                    <MDBModalFooter>
                                        <div className="font-weight-light">
                                            <p>Not a member? <a href="/signup">  Sign Up</a></p>

                                        </div>
                                    </MDBModalFooter>
                                </MDBCardBody>
                            </MDBCard>

                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
                <NotificationContainer />
            </div>

           
        </div> </LoadingOverlay>);
    };

}