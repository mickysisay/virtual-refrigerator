import {
    Route,
    Redirect,
} from 'react-router-dom'

export const AuthenticatedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        isAuthorized()
            ? <Component updateLoggedIn={rest.updateLoggedIn} {...props} />
            : <Redirect to={{
                pathname: "login",
                state: { referrer: rest.path }
            }} />
    )} />
)


export const isAuthorized = function () {
    return localStorage.getItem("token");
}
export const LogOut = function () {
    localStorage.removeItem("token");
}

