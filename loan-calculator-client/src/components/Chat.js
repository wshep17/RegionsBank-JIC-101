import React, { Component } from 'react';
import firebase from '../scripts/firebase.js';
import { ContextAPI } from './Context.js';
import { Input, Button } from 'antd';
import { getChatbotResponse, getChatbotBtns } from '../scripts/chatbot';

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
      status: true,
      context: ""
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    //fetch the messages from the database	
    this.fetchRoomInfo()
  }

  render() {
    let prevName = '';
    return (
      <div style={{ background: '#eeeeee', height: '100%' }} className={this.state.status ? 'button-chat-format' : ''}>
        <div className={this.state.status ? '' : 'chat-messages'}>
          {this.state.chat.map((each) => {
            let showName = prevName !== each.sender_name;
            prevName = each.sender_name;
            return this.renderMessage(each.sender_name, each.message, showName)
          })}
        </div>
        {this.state.status ? (
          <div className='chatbot-buttons'>
            {getChatbotBtns(this.state.context).map((btn) =>{
              return (<Button onClick={() => this.handleChatbotResponse(btn)}>{btn.text}</Button>);
            })}
          </div>
        ) : (
          <div className='chat-input'>
            <Input
              onPressEnter={this.handleSend.bind(this)}
              onChange={(event) => this.handleChange(event)}
              placeholder="Message"
              value={this.state.message}
            />
          </div>
        )}
      </div>
    )
  }

  renderMessage(name, message, showName) {
    if (this.state.name === name) {
      return (
       <div className={showName ? 'user-message-block' : 'user-message-block-cont'}>
         {showName && <p className='user-name'>{name}</p>}
         <div className='user-message'>
           <p>{message}</p>
         </div>
       </div> 
      );
    }
    return (
      <div className={showName ? 'admin-message-block' : 'admin-message-block-cont'}>
        {showName && <p className='admin-name'>{name}</p>}
        <div className='admin-message'>
          <p>{message}</p>
        </div>
      </div> 
    );
  }
  
  handleChange(event) {
    this.setState({ message: event.target.value })
  }

  // Gets information of the room (messages and chatbot status)
  async fetchRoomInfo() {
    // Retrieve the currently logged in user
    let user = firebase.auth().currentUser

    // Create an instance of Firebase Firestore database
    let db = firebase.firestore()

    // Retrieve room id
    let room_id = "";
    let name = "";
    if (this.context.isAdmin) {
      let adminUsersRef = await db.collection('admin-users').doc(user.uid).get()
      room_id = adminUsersRef.data().admin_room_location
      name = adminUsersRef.data().admin_name
    } else {
      let anonUsersRef = await db.collection('anon-users').doc(user.uid).get()
      room_id = user.uid
      name = anonUsersRef.data().anon_name
    }

    // Subscribe to chatbot status
    let roomRef = await db.collection('chat-rooms').doc(room_id)
    roomRef.onSnapshot(snapshot => {
      let status = snapshot.data().status
      this.setState({ status: status })
    })

    // Subscribe to messages(collection) and order each message(document) by timestamp in ascending order
    let messagesRef = await db.collection('chat-rooms').doc(room_id).collection('messages')
    messagesRef.orderBy('timestamp', 'asc').onSnapshot(snapshot => {
      let messages = []
      snapshot.forEach((item) => {
        messages.push(item.data())
      })
      this.setState({ chat: messages, message: "", name: name, room_id: room_id})
    })
  }

  async handleSend() {
    // Retrieve the currently logged in user
    let user = firebase.auth().currentUser

    // Create an instance of Firebase Firestore database
    let db = firebase.firestore()

    // Create reference to the location where messages are stored
    let messagesRef = db.collection('chat-rooms').doc(this.state.room_id).collection('messages').doc()

    // Post the message to the database (Note: this will generate a random/unique key)
    messagesRef.set({
      "sender_name": this.state.name,
      "message": this.state.message,
      "uid": user.uid,
      "timestamp": firebase.firestore.FieldValue.serverTimestamp()
    })
  }

  async handleChatbotResponse(btn) {
    // Retrieve the currently logged in user
    let user = firebase.auth().currentUser

    let res = getChatbotResponse(btn.context)
    if (res.respond) {
      if (btn.context === "redirect") {
        let db = firebase.firestore()
        await db.collection('chat-rooms').doc(this.state.room_id).update({
          status: false
        })
      }
      this.sendChatbotInteraction(this.state.name, btn.text, user.uid).then(() => {
        this.sendChatbotInteraction("Chatbot", res.response, "Chatbot")
      })
      
    }
    this.setState({context: res.context})
  }

  async sendChatbotInteraction(name, response, uid) {
    // Create an instance of Firebase Firestore database
    let db = firebase.firestore()

    // Create reference to the location where messages are stored
    let messagesRef = db.collection('chat-rooms').doc(this.state.room_id).collection('messages').doc()

    // Post the message to the database (Note: this will generate a random/unique key)
    messagesRef.set({
      "sender_name": name,
      "message": response,
      "uid": uid,
      "timestamp": firebase.firestore.FieldValue.serverTimestamp()
    })
  }
}


export default Chat;