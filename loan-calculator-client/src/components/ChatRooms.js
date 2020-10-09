import React, { Component } from 'react'
import ConfirmationScreen from './ConfirmationScreen.js'
import firebase from '../scripts/firebase.js'
import { ContextAPI } from './Context.js'

import {
  withRouter 
} from "react-router-dom";

/**
 * Admin Component:
 * Shows which chatrooms are available
 */
class ChatRooms extends Component {

	static contextType = ContextAPI
	constructor(props) {
		super(props)
		this.state = {
			chat_rooms: []
		}
		this.fetchRooms = this.fetchRooms.bind(this)
	}
	componentDidMount() {
		//fetch the chat rooms from the database
		this.fetchRooms()

	}
	render() {
		return(
			<div style={{marginTop: '72px'}}>
				The following users have questions. Join their room to address their questions!
				<br />
				<ul style={{backgroundColor: "white"}}>
					{this.state.chat_rooms.map((each) => {
						return (<div><li onClick={()=>this.adminJoinRoom(each.room)}><ConfirmationScreen name={each.title} /></li><br /></div>)
					})}
				</ul>
			</div>
		)
	}

	//This function will fetch all the rooms from the database
	fetchRooms() {
		let chatRoomsRef = firebase.database().ref(`private-rooms`)
		chatRoomsRef.on('value', (snapshot) => {
			let list = []
			snapshot.forEach((item) => {
				list.push(item.val())
			})
			this.setState({chat_rooms: list})
		})
	}

	//This function will allow the admin to join this room
	adminJoinRoom(room) {
		console.log(room)
		// Set the chat_room to "room" in the state in App.js (Possible through the Context API) 
		this.context.triggerAdminJoinRoom(room)
	}
}



export default withRouter(ChatRooms);