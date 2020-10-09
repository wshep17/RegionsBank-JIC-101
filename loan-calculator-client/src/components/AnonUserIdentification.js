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
      <div>
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
    this.setState({
      visible: true,
    })
  }

  handleOk() {
    var user
    firebase.auth().signInAnonymously()
    .then(() => {
      user = firebase.auth().currentUser
      user.updateProfile({
        displayName: this.state.name,
        photoURL: user.uid
      }).then(() => {
        //create a room out of their uid
        this.createRoom(user.uid, user.displayName)
        this.setState({visible: false})
        this.props.history.push('/chat')
        console.log('anonPrivateRoom: ', user.photoURL)
      })
    })
    .catch((err) => console.log(err))
  }

  //This function will create another room in the database
  createRoom(room, displayName) {    
    let roomsRef = firebase.database().ref(`private-rooms/${room}`)
    roomsRef.set({
      "name": displayName,
      "room": room
    })
    //check if current room already exists. if not, set chatbot status to true
    let chatbotRef  = firebase.database().ref(`chatbot`)
    chatbotRef.once('value', (snapshot) =>{
      let exists = false
      snapshot.forEach((item) => {
        if (item.key === room) {
          exists = true
        }
      })
      if (!exists) {
        console.log("New chatroom... Setting chatbot status to true")
        let roomStatusRef = firebase.database().ref(`chatbot/${room}`)
        roomStatusRef.set({
          "status": true
        })
        let messageRef = firebase.database().ref(`messages/room:${room}`)
        messageRef.push({
          "name": "Chatbot",
          "message": "Hi! How can I help you today?",
          "uid": "bot",
        })
      } else {
        console.log("Chatroom already exists")
      }
    })
  }

  handleCancel() {
    this.setState({
      visible: false,
    })
  }
}

export default withRouter(AnonUserIdentification)
