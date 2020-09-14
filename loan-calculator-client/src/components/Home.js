import React, { Component } from 'react'
import ChatRooms from './ChatRooms.js'
import { Card, Col, Row, Button } from 'antd';
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
					<Col span={10} style={{margin:'auto', padding: '10px'}}>
						<Card style={{textAlign: 'center', backgroundColor: '#FFFFCC'}}
							  hoverable={true}
							  bordered={true}
							  onClick={()=>this.props.history.push('/chat-rooms')}
						><b>Go to the Chat Rooms!</b></Card>
					</Col>		
				)
			} else {
				return(
					<div></div>		
				)
			}
		}
		return (
			<div>
				<Row gutter={20}>
					<div style={{margin:'auto', width: '50%'}}>
						<Col span={10} style={{margin:'auto', padding: '10px'}}>
							<Card style={{textAlign: 'center', backgroundColor: '#CCFFCC' }}
								  hoverable={true}
							      bordered={true}
							      onClick={()=>this.props.history.push('/calculator')}
							><b>Go to the Calculator!</b></Card>
						</Col>
						{conditionalRender()}
					</div>
				</Row>
			</div>
		)
	}
}

export default Home