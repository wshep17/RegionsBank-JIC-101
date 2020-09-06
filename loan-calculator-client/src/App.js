import React from 'react';

import './css/App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './components/Home.js'
import Calculator from './components/Calculator.js'
import ChatRooms from './components/ChatRooms.js'
import AdminSignup from './components/AdminSignup.js'
import AdminLogin from './components/AdminLogin.js'



function App() {
  return (
  	<Router>
  		<Switch>
  			<Route path='/home' component={Home} />
        <Route path='/login' component={AdminLogin} />
        <Route path='/signup' component={AdminSignup} />
  			<Route path='/calculator' component={Calculator} />
  			<Route path='/chat-rooms' component={ChatRooms} />
  		</Switch>
  	</Router>
  )
}

export default App;
