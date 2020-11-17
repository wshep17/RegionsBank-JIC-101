import React from 'react';

import './css/App.css';
import './css/index.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './components/Home.js'
import Calculator from './components/Calculator.js'
import ChatRooms from './components/ChatRooms.js'
import AdminSignup from './components/AdminSignup.js'
import AdminLogin from './components/AdminLogin.js'
import PrivateRoute from './components/PrivateRoute.js'
import NavigationBar from './components/NavigationBar.js'
import MediaPortal from './components/MediaPortal.js'
import { ContextAPI } from './components/Context.js'
import firebase from './scripts/firebase.js'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isAdmin: false,
      isLoading: true,
      admin_room_location: ""
    }
    this.handleAdminCheck = this.handleAdminCheck.bind(this)
    this.handleAdminLogin = this.handleAdminLogin.bind(this)
    this.handleAdminLogout = this.handleAdminLogout.bind(this)
    this.handleAdminJoinRoom = this.handleAdminJoinRoom.bind(this)
  }
  componentDidMount() {
    this.handleAdminCheck()  
  }
  render() {
    const value = {
      isAdmin: this.state.isAdmin,
      admin_room_location: this.state.admin_room_location,
      triggerAdminJoinRoom: this.handleAdminJoinRoom,
      triggerAdminLogin: this.handleAdminLogin,
      triggerAdminLogout: this.handleAdminLogout
    }
    const conditionalRender = () => {
      //if it's still loading return blank screen
      if (this.state.isLoading) {
        return (<div></div>)
      } else {
        return (
          <ContextAPI.Provider value={value}>
            <NavigationBar />
            <Switch>
              <Route path='/home' component={Home} />
              <Route path='/login' component={AdminLogin} />
              <Route path='/signup' component={AdminSignup} />
              <Route path='/calculator' component={Calculator} />
              <Route path='/chat' component={MediaPortal} />
              <PrivateRoute path='/chat-rooms' component={ChatRooms} />
              <Route path='/' component={Home} />
            </Switch>
          </ContextAPI.Provider>
        )
      }
    }
    return (
      <Router>
        {conditionalRender()}
      </Router>
    )
  }

  handleAdminCheck() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && !user.isAnonymous) {
        console.log({ email: user.email, name: user.displayName })
        this.setState({ isAdmin: true, isLoading: false })
      } else {
        this.setState({ isAdmin: false, isLoading: false })
      }
    })
  }


  handleAdminLogin() {
    this.setState({ isAdmin: true })
    console.log("Admin Status: ", this.state.isAdmin)
  }

  handleAdminJoinRoom(room) {
    this.setState({ admin_room_location: room }, function() {
      console.log("An admin has just joined room: ", this.state.admin_room_location)
    })
  }

  handleAdminLogout() {
    //console.log('handle log out')
    this.setState({ isAdmin: false , admin_room_location: ""})
    console.log("Admin Status: ", this.state.isAdmin)
  }

}

export default App;
