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
      chat: []
    }
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    //fetch the messages from the database	
    this.fetchMessages()
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
  async fetchMessages() {
    let user = firebase.auth().currentUser;
    let db = firebase.firestore();
    if (user) {
      //Retrieve the room that admin joined
      let adminUsersRef = await db.collection('admin-users').doc(user.uid).get()
      let admin_room_location = (adminUsersRef.exists) ? (adminUsersRef.data().admin_room_location) : ("")

      //Retrieve the room that the anonymous user is associated with, aka their uid :)
      let anonUsersRef = await db.collection('anon-users').doc(user.uid).get()
      let anon_room_location = (anonUsersRef.exists) ? (anonUsersRef.data().anon_uid) : ("")

      //Assign a room_id depending on the current user being an admin or not
      let room_id = (this.context.isAdmin) ? (admin_room_location) : (anon_room_location)

      //Retrieve each document in messages(collection) and "order by" timestamp in asc(ascending)
      let roomsRef = await db.collection('chat-rooms').doc(room_id).collection('messages')
      roomsRef.orderBy('timestamp', 'asc').onSnapshot(snapshot => {
        let list = []
        snapshot.forEach((item) => {
          list.push(item.data())
        })
        this.setState({ chat: list, message: ""})
      })
    }
  }


  async handleSend() {
    //Retrieve the currently logged in user
    let user = firebase.auth().currentUser

    //Create an instnace of Firebase Firestore database
    let db = firebase.firestore()

    //Retrieve the room that admin joined & their name
    let adminUsersRef = await db.collection('admin-users').doc(user.uid).get()
    let admin_room_location = (adminUsersRef.exists) ? (adminUsersRef.data().admin_room_location) : ("")
    let admin_name = (adminUsersRef.exists) ? (adminUsersRef.data().admin_name) : ("") 

    //Retrieve the name & room that the anonymous user is associated with, aka their uid :)
    let anonUsersRef = await db.collection('anon-users').doc(user.uid).get()
    let anon_room_location = (anonUsersRef.exists) ? (anonUsersRef.data().anon_uid) : ("")
    let anon_name = (anonUsersRef.exists) ? (anonUsersRef.data().anon_name) : ("")

    //Assign a room_id depending on the current user being an admin or not
    let room_id = (this.context.isAdmin) ? (admin_room_location) : (anon_room_location) 

    //Assign a name depending on who is sending the message
    let name = (this.context.isAdmin) ? (admin_name) : (anon_name)

    //Create Location to store all the messages
    let messagesRef = db.collection('chat-rooms').doc(room_id).collection('messages').doc()

    // //Post the message to the database(Note: this will generate a random/unique key)
    messagesRef.set({
      "sender_name": name,
      "message": this.state.message,
      "uid": user.uid,
      "timestamp": firebase.firestore.FieldValue.serverTimestamp()
    })
  }
}


export default Chat;
