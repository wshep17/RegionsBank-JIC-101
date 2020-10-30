import React, { Component } from 'react';
import firebase from '../scripts/firebase.js';
import { ContextAPI } from './Context.js';
import { getChatbotResponse } from '../scripts/chatbot';
import { Input } from 'antd';

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
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    //fetch the messages from the database	
    this.fetchMessages()
    //fetch chatroom status
    this.fetchStatus()
  }
  render() {
    return (
      <div style={{ background: '#eeeeee', height: '100%' }}>
        <div className='chat-messages'>
          {this.state.chat.map((each) => {
            return this.renderMessage(each.name, each.message)
          })}
        </div>
        <div className='chat-input'>
          <Input
            onPressEnter={this.handleSend.bind(this)}
            onChange={(event) => this.handleChange(event)}
            placeholder="Message"
            value={this.state.message}
          />
        </div>
      </div>
    )
  }

  renderMessage(name, message) {
    let user = firebase.auth().currentUser;
    if (name === user.displayName) {
      return (
       <div className='user-message-block'>
         <p className='user-name'>{name}</p>
         <div className='user-message'>
           <p>{message}</p>
         </div>
       </div> 
      );
    }
    return (
      <div className='admin-message-block'>
        <p className='admin-name'>{name}</p>
        <div className='admin-message'>
          <p>{message}</p>
        </div>
      </div> 
    );
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
        this.setState({ chat: list, message: "" })
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
        this.setState({ chat: list, message: "" })
      })
    }
  }
  handleChange(event) {
    this.setState({ message: event.target.value })
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
      this.setState({ status: false })
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


export default Chat;
