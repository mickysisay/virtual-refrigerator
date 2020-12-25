
import { 
    Route,
    Redirect
 } from 'react-router-dom'
import {isAuthorized} from './AuthenticatedRoute'    

    export const PublicRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(props) => (
          isAuthorized()
            ? <Redirect to= "" />
            : <Component updateLoggedIn = {rest.updateLoggedIn}  {...props}
               />
        )} />
    )   

