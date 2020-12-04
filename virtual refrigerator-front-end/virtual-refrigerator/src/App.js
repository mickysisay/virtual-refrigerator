import logo from './logo.svg';
import './App.css';
import Login from './components/Login'
import {AuthenticatedRoute} from './Utils/AuthenticatedRoute'
import MainPage from './components/MainPage'
import SignUp from './components/Signup'
import {Navbar as Navigationbar,Nav as Navigation,Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css'

import {  BrowserRouter as Router,
  Switch,
  Route,
  } from 'react-router-dom'
import { Fragment } from 'react';


function App() {
  return (
    <Fragment>
       <Navigationbar bg="dark" variant="dark">
    <Navigationbar.Brand href="main">Home</Navigationbar.Brand>
    <Navigation className="mr-auto">

    </Navigation>
    <Form inline>
    <Navigation className="mr-auto">
      <Navigation.Link href="/login">Login</Navigation.Link>
      <Navigation.Link className="justify-content-end" href="/signup">Sign Up</Navigation.Link>
    </Navigation>
    </Form>
  </Navigationbar>
    <Router>
      
  
    <Switch>
         
              
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />  
          <AuthenticatedRoute exact path= "/main" component={MainPage} />
            
            <Route exact path="/">
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

            </Route>
              
          </Switch>
    </Router>
    </Fragment>
  );
}

export default App;
