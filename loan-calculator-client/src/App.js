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
import PrivateRoute from './components/PrivateRoute.js'
import NavigationBar from './components/NavigationBar.js'
import Chat from './components/Chat.js'
import { ContextAPI } from './components/Context.js'
import firebase from './scripts/firebase.js'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isAdmin: true,
            isLoading: true,
            chat_room: ""
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
            chat_room: this.state.chat_room,
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
                    <ContextAPI.Provider value = {value}>
                        <NavigationBar />
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/login' component={AdminLogin} />
                            <Route path='/signup' component={AdminSignup} />
                            <Route path='/calculator' component={Calculator} />
                            <Route path='/chat' component={Chat} />
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
            if (user) {
                console.log({email: user.email, name: user.displayName})
                this.setState({isAdmin: true, isLoading: false})
            } else {
                this.setState({isAdmin: false, isLoading: false})
            }
        })
    }

    handleAdminLogin() {
        this.setState({isAdmin: true})
        console.log("Admin Status: ", this.state.isAdmin)
    }

    handleAdminJoinRoom(room) {
        this.setState({chat_room: room})
        
        console.log("An admin has just joined room: ", this.state.chat_room)
    }

    handleAdminLogout() {
        //console.log('handle log out')
        this.setState({isAdmin: false})
        console.log("Admin Status: ", this.state.isAdmin)
    }

}

export default App;
