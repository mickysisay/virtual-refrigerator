import {Component,PropTypes} from "react";
import {  BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    history ,
    useHistory,
    useLocation} from 'react-router-dom'
import {isAuthorized} from './AuthenticatedRoute'    

    export const PublicRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(props) => (
          isAuthorized()
            ? <Redirect to= "main" />
            : <Component updateLoggedIn = {rest.updateLoggedIn}  {...props}
               />
        )} />
    )   

