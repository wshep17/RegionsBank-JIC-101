import React, { Component } from 'react'
import ChatRooms from './ChatRooms.js'
import { ContextAPI } from './Context.js'

import {
  Link
} from "react-router-dom";

class Home extends Component {
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
					<Link to="/chat-rooms">
						<button>Go to chat rooms</button>
					</Link>			
				)
			} else {
				return(
					<div></div>		
				)
			}
		}
		return (
			<div>
				<Link to="/calculator">
					<button>Go to calculator</button>
				</Link>
				{conditionalRender()}		
			</div>
		)
	}
}

export default Home