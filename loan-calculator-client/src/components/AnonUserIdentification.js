import React, { Component } from 'react'
import { Modal, Button } from 'antd';
import firebase from '../scripts/firebase.js'
import {
  withRouter 
} from "react-router-dom";

/**
 * Anonymous User Component:
 * Creates chatroom
 */
class AnonUserIdentification extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      name: "",
    }
  }
  


  render() {
    return (
      <div className='anon-user-container'>
        <Button type="primary" onClick={this.showModal.bind(this)}>
          Click to Speak with Regions Representative.
        </Button>
        <Modal
          title="Enter your name below"
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
        <input placeholder="Name" name="name" value={this.state.name} onChange={this.handleChange.bind(this)}></input>
        </Modal>
      </div>
    )
  }
  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }
  showModal() {
    let user = firebase.auth().currentUser
    if (user) {
      //sign out of current anonymous user 
      firebase.auth().signOut()
      .then(() => {
        console.log('Anonymous User signed out successfully')
        this.setState({ visible: true})
      })
      .catch((err) => console.log(err))
    } else {
      this.setState({ visible: true})
    }
  }

  // Saves anonymous user information to Firestore (name, uid, chatbot status)
  handleOk() {
    firebase.auth().signInAnonymously()
    .then(async () => {
      /**Purpose: Save Anonymous User in Firebase Firestore(result visible in schema)
         Note the following changes, from old_commit -> updated_commit: 
         (a) photoURL -> uid
         (b) displayName -> name
      */
      let user = await firebase.auth().currentUser
      const db = firebase.firestore() 
      const anonUsersRef = await db.collection('anon-users').doc(user.uid)
      anonUsersRef.set({
        "anon_name": this.state.name, 
        "anon_uid": user.uid,
      }).then(async () => {
        //create a room out of their uid
        const roomRef = db.collection('chat-rooms').doc(user.uid);
        const doc = await roomRef.get();

        // If the chatroom does not already exist, create a new room
        if (!doc.exists) {
          this.createRoom(user.uid, this.state.name, user.uid)
        }
        this.setState({ visible: false })
        this.props.history.push('/chat')
      })
    })
    .catch((err) => console.log(err))
  }

  //This function will create another room in the database and send a greeting from the chatbot
  async createRoom(room_name, creator_name, creator_uid) {    
    const db = firebase.firestore();    
    let roomRef = await db.collection('chat-rooms').doc(room_name)
    roomRef.set({
      "creator_name": creator_name,
      "creator_uid": creator_uid,
      "status": true
    })
    
    // Create reference to the location where messages are stored
    let messagesRef = roomRef.collection('messages').doc()

    // Post the message to the database (Note: this will generate a random/unique key)
    messagesRef.set({
      "sender_name": "Chatbot",
      "message": "Hi! What can I assist you with?",
      "uid": "Chatbot",
      "timestamp": firebase.firestore.FieldValue.serverTimestamp()
    })
  }

  handleCancel() {
    this.setState({
      visible: false,
    })
  }
}

export default withRouter(AnonUserIdentification)
