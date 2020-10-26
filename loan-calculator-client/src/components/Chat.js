import React, { Component } from 'react';
import firebase from '../scripts/firebase.js';
import Video from './Video.js'
import { ContextAPI } from './Context.js';
import { Input } from 'antd';

//TODO: Get a working chat application up and running again with firestore :(


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
      room_id: "",
      status: false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    console.log("Current uid: " + firebase.auth().currentUser.uid)
    console.log("Current user name: " + firebase.auth().name)
    console.log("Admin status: " + this.context.isAdmin)
    //fetch the messages from the database	
    this.fetchRoomInfo()
  }

  render() {
    return (
      <div className='chat-container'>
        <Video />
        <ul style={{ backgroundColor: "white" }}>
          {this.state.chat.map((each) => {
            return (<div><li>{each.sender_name}: {each.message}</li><br /></div>)
          })}

        </ul>
        <Input
          onPressEnter={this.handleSend.bind(this)}
          onChange={(event) => this.handleChange(event)}
          placeholder="Message (Press ENTER to send)"
          value={this.state.message}
        />

      </div>

    )
  }

  handleChange(event) {
    this.setState({ message: event.target.value })
  }

  // Gets information of the room (messages and chatbot status)
  async fetchRoomInfo() {
    let user = firebase.auth().currentUser;
    let db = firebase.firestore();

    // Retrieve room id
    let room_id = ""
    if (this.context.isAdmin) {
      let adminUsersRef = await db.collection('admin-users').doc(user.uid).get()
      room_id = adminUsersRef.data().admin_room_location
    } else {
      room_id = user.uid
    }

    // Retrieve chatbot status
    let roomRef = await db.collection('chat-rooms').doc(room_id)
    roomRef.onSnapshot(snapshot => {
      let status = snapshot.data().status
      this.setState({ status: status })
    })

    // Retrieve each document in messages(collection) and "order by" timestamp in asc(ascending)
    let messagesRef = await db.collection('chat-rooms').doc(room_id).collection('messages')
    messagesRef.orderBy('timestamp', 'asc').onSnapshot(snapshot => {
      let messages = []
      snapshot.forEach((item) => {
        messages.push(item.data())
      })
      this.setState({ chat: messages, message: ""})
    })
  }

  async handleSend() {
    // Retrieve the currently logged in user
    let user = firebase.auth().currentUser

    // Create an instance of Firebase Firestore database
    let db = firebase.firestore()

    // Retrieve room id and user name
    let room_id = ""
    let name = ""
    if (this.context.isAdmin) {
      let adminUsersRef = await db.collection('admin-users').doc(user.uid).get()
      room_id = adminUsersRef.data().admin_room_location
      name = adminUsersRef.data().admin_name
    } else {
      let anonUsersRef = await db.collection('anon-users').doc(user.uid).get()
      room_id = user.uid
      name = anonUsersRef.data().anon_name
    }

    // Create reference to the location where messages are stored
    let messagesRef = db.collection('chat-rooms').doc(room_id).collection('messages').doc()

    // Post the message to the database (Note: this will generate a random/unique key)
    messagesRef.set({
      "sender_name": name,
      "message": this.state.message,
      "uid": user.uid,
      "timestamp": firebase.firestore.FieldValue.serverTimestamp()
    })
  }
}


export default Chat;
