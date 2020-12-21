
import logo from './logo.svg';
import './App.css';
import Login from './components/Login'
import { AuthenticatedRoute, isAuthorized } from './Utils/AuthenticatedRoute'
import { Logout } from './components/Logout'
import MainPage from './components/MainPage'
import SignUp from './components/Signup'
import ShowRefrigerator from './components/ShowRefrigerator'
import { Navbar as Navigationbar, Nav as Navigation, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css'
import { PublicRoute } from './Utils/PublicRoute'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import { Fragment, useState } from 'react';


function App() {

  const [loggingIn, setLoggingIn] = useState(false);

  const updateLoggedIn = () => {
    
    const loggedOut = loggingIn ? false : true;
    console.log(loggedOut);
    setLoggingIn(loggedOut);
  }

  return (
    <Fragment>
      <Navigationbar bg="dark" variant="dark">
        <Navigationbar.Brand href="/">Home</Navigationbar.Brand>
        <Navigation className="mr-auto">

        </Navigation>
        <Form inline>
          <Navigation className="mr-auto">{isAuthorized() ?
            <Navigation.Link href="/logout">Logout</Navigation.Link> :
            <Navigation.Link href="/login">Login</Navigation.Link>
          }
            {isAuthorized() ? null :
              <Navigation.Link className="justify-content-end" href="/signup">Sign Up</Navigation.Link>
            }

          </Navigation>
        </Form>
      </Navigationbar>
      <Router>


        <Switch>


          <PublicRoute updateLoggedIn={updateLoggedIn} exact path="/login" component={Login} />
          <PublicRoute updateLoggedIn={updateLoggedIn} exact path="/signup" component={SignUp} />
          <AuthenticatedRoute updateLoggedIn={updateLoggedIn} exact path="/logout" component={Logout} />
          <AuthenticatedRoute updateLoggedIn={updateLoggedIn} exact path="/" component={MainPage} />
          <AuthenticatedRoute updateLoggedIn={updateLoggedIn} exact path="/refrigerator/:id" component={ShowRefrigerator} />
          {/* <Route exact path="/">
            <div className="App">

              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
             </a>
              </header>
            </div>

          </Route> */}

        </Switch>
      </Router>
    </Fragment>
  );
}

export default App;
