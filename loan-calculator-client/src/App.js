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
import { ContextAPI } from './components/Context.js'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isAdmin: true,
            isLoading: true
        }
        this.handleAdminCheck = this.handleAdminCheck.bind(this)
        this.handleAdminLogin = this.handleAdminLogin.bind(this)
        this.handleAdminLogout = this.handleAdminLogout.bind(this)
    }
    componentDidMount() {
        this.handleAdminCheck()
    }
    render() {
        const value = {
            isAdmin: this.state.isAdmin,
            triggerAdminLogin: this.handleAdminLogin,
            triggerLogout: this.handleAdminLogout
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
        fetch('/auth/auth-check')
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            //authorized admin user
            if (data.status === 200) {
                this.setState({isAdmin: true, isLoading: false})
            } else {
                this.setState({isAdmin: false, isLoading: false})
            }
        })
        .catch((err) => console.log(err))
    }

    handleAdminLogin() {
        this.setState({isAdmin: true})
        console.log("Admin Status: ", this.state.isAdmin)
    }

    handleAdminLogout() {
        console.log('handle log out')
        this.setState({isAdmin: false})
        console.log("Admin Status: ", this.state.isAdmin)
    }

}

export default App;
