import {
    Route,
    Redirect,
} from 'react-router-dom'


export const AuthenticatedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      isAuthorized()
            ? <Component updateLoggedIn={rest.updateLoggedIn} {...props} />
            : <Redirect to={{
                pathname: "/login",
                state: { referrer: rest.path }
            }} />
    )} />
)


export const isAuthorized = function () {
    // await backendAPI.checkToken();
    // console.log(localStorage.getItem("token")!== null);
    return localStorage.getItem("token");
}
export const LogOut = function () {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("checkToken");
}

