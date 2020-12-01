import logo from './logo.svg';
import './App.css';
import Login from './components/Login'
import {AuthenticatedRoute} from './Utils/AuthenticatedRoute'
import MainPage from './components/MainPage'
import SignUp from './components/Signup'

import {  BrowserRouter as Router,
  Switch,
  Route,
  } from 'react-router-dom'


function App() {
  return (
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
  );
}

export default App;
