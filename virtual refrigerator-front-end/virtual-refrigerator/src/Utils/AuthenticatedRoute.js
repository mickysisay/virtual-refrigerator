import {Component} from "react";
import {  BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    history ,
    useHistory,
    useLocation} from 'react-router-dom'

export const AuthenticatedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      localStorage.getItem("token")
        ? <Component {...props} />
        : <Redirect to={{
            pathname: "login",
            state: { referrer: rest.path }
          }} />
    )} />
)
