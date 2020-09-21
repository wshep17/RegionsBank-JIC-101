import React, { Component } from 'react'
import firebase from '../scripts/firebase.js'
import { ContextAPI } from './Context.js'
import { getChatbotResponse } from '../scripts/chatbot'

/**
 * General Component:
 * Chatroom
 */
class Chat extends Component {

	static contextType = ContextAPI

	constructor(props) {
		super(props)

		this.state = {
			message: "",
			chat: [],
			//set default status as false so chatbot doesn't auto respond
			status: false
		}
	}
	componentDidMount() {
		//fetch the messages from the database	
		this.fetchMessages()
		//fetch chatroom status
		this.fetchStatus()
	}
	render() {
		return (
			<div>

			<ul style={{backgroundColor: "white"}}>
				{this.state.chat.map((each) => {
					return (<div><li>{each.name}: {each.message}</li><br /></div>)
				})}

			</ul>

			<input placeholder="message" name="message" value={this.state.message} onChange={this.handleChange.bind(this)}></input>
			<button onClick={this.handleSend.bind(this)}>Send</button>

			</div>

		)		
	}
	fetchMessages() {
		let user = firebase.auth().currentUser
		if (user && user.photoURL) {
			//if you're an anonymous user
			let messageRef = firebase.database().ref(`messages/room:${user.photoURL}`)
			messageRef.on('value', (snapshot) => {
				var list = []
				snapshot.forEach((item) => {
					list.push(item.val())
				})
				this.setState({chat: list, message: ""})
			})
		}
		if (user && this.context.chat_room) {
			//if you're an admin user
			let messageRef = firebase.database().ref(`messages/room:${this.context.chat_room}`)
			messageRef.on('value', (snapshot) => {
				var list = []
				snapshot.forEach((item) => {
					list.push(item.val())
				})
				this.setState({chat: list, message: ""})
			})
		}
	}
	handleChange(event) {
		this.setState({[event.target.name]: event.target.value})
	}
	handleSend() {
		let user = firebase.auth().currentUser
		if (user && user.photoURL) {
			//if you're an anonymous user
			let messageRef = firebase.database().ref(`messages/room:${user.photoURL}`)
			messageRef.push({
				"name": user.displayName,
				"message": this.state.message,
				"uid": user.uid,
			})
			if (this.state.status) {
				this.handleChatbotResponse(user, this.state.message)
			}
		}
		if (user && this.context.chat_room) {
			//if you're an admin user
			let messageRef = firebase.database().ref(`messages/room:${this.context.chat_room}`)
			messageRef.push({
				"name": user.displayName,
				"message": this.state.message,
				"uid": user.uid,
			})
		}
	}
	handleChatbotResponse(user, userMessage) {
		let response = getChatbotResponse(userMessage)
		if (!response.status) {
			let chatbotRef = firebase.database().ref(`chatbot/${user.photoURL}`)
			chatbotRef.set({
				"status": false
			})
			this.setState({status: false})
		}
		let messageRef = firebase.database().ref(`messages/room:${user.photoURL}`)
		messageRef.push({
			"name": "Chatbot",
			"message": response.message,
			"uid": "bot",
		})
	}
	fetchStatus() {
		let user = firebase.auth().currentUser
		if (user && user.photoURL) {
			let statusRef = firebase.database().ref(`chatbot/${user.photoURL}`)
			statusRef.on('value', (snapshot) => {
				let snap = snapshot.val()
				if (snap) {
					this.setState({ status: snap.status })
				}
			})
		}
	}
}


export default Chat