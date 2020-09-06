import React, { Component } from 'react'
import ChatRooms from './ChatRooms.js'
import { ContextAPI } from './Context.js'
import '../css/NavigationBar.css';
import { Button } from "antd";

import {
  Link,
  withRouter 
} from "react-router-dom";

class NavigationBar extends Component {
	/**
	* Refer to "AdminLogin.js" to better understand what this line means :)
	* Note: I prefer to leverage context with class components when possible. 
	*       It looks much cleaner/readable, but this can also be done with 
	*       functional components. Take a look at the "PrivateRoute.js" file
	*       for an example. 
	*/
	static contextType = ContextAPI
	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		const conditionalRender = () => {
			if (this.context.isAdmin) {
				return(
					<li style={{'float': 'right'}} onClick={this.handleLogout.bind(this)}><a><Button type="danger">Logout</Button></a></li>		
				)
			} else {
				return(
					<li style={{'float': 'right'}}
					    onClick={()=>this.props.history.push('/login')}><a><Button>Login</Button></a></li>		
				)
			}
		}
		return (
			<ul>
			  <li><a style={{fontSize: '20px'}}>[Regions Logo here] Regions Loan Calculator</a></li>
			  <li><a style={{fontSize: '20px'}} onClick={()=>this.props.history.push('/home')}>Home</a></li>
			  {conditionalRender()}
			</ul>
		)
	}

	//Facilitate Logging Out
	handleLogout() {
		fetch('auth/logout', {
			'method':  'POST', 
			'headers': {
				'Content-Type': 'application/json'
			}
		})
		.then((response) => response.json())
		.then((data) => {
			this.context.triggerLogout()
			alert('Successfully Logged Out')
		})
		.catch((err) => console.log(err))
	}
}

export default withRouter(NavigationBar)