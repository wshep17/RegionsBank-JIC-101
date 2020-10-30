import React, { useState } from 'react';
import Chat from './Chat.js';
import firebase from '../scripts/firebase.js';
import { Button, Modal } from 'antd';
import { CloseOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import "../css/App.css";
import "../css/ApplicantChat.css";



export default function ApplicantChat() {
  /*
  * open-chat: the chat window is open and the user can type in it
  * minimized-chat: there has been a chat window opened, but it is currently minimized
  * closed-chat: there is no chat window open, and the user can open one by clicking "Chat with an Advisor"
  */
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [name, setName] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleOk = () => {
    var user
    firebase.auth().signInAnonymously()
      .then(() => {
        user = firebase.auth().currentUser
        user.updateProfile({
          displayName: name,
          photoURL: user.uid
        }).then(() => {
          //create a room out of their uid
          createRoom(user.uid, user.displayName)
          console.log('anonPrivateRoom: ', user.photoURL)
        })
        setChatMinimized(false);
        setIsSignedIn(true);
      })
      .catch((err) => console.log(err))
  };

  //This function will create another room in the database
  const createRoom = (room, displayName) => {
    let roomsRef = firebase.database().ref(`private-rooms/${room}`)
    roomsRef.set({
      "name": displayName,
      "room": room
    })
    //check if current room already exists. if not, set chatbot status to true
    let chatbotRef = firebase.database().ref(`chatbot`)
    chatbotRef.once('value', (snapshot) => {
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
  };

  if (!chatOpen) {
    return (
      <Button
        className='open-chat-button'
        onClick={() => {
          setChatOpen(true);
          if (firebase.auth().currentUser !== null) {
            setIsSignedIn(true);
            setChatMinimized(false);
          }
        }}
      >
        Chat with an Advisor
      </Button>
    );
  } else if (!isSignedIn) {
    return (
      <Modal
        title="Enter your name below"
        visible={chatOpen && !isSignedIn}
        onOk={handleOk}
        onCancel={() => setChatOpen(false)}
      >
        <input placeholder="Name" name="name" value={name} onChange={(event) => setName(event.target.value)}></input>
      </Modal>
    );
  }
  return (
    <div className='user-chat-popup' id={chatMinimized ? 'minimized-chat' : 'open-chat'}>
      <div className='user-chat-header'>
        {chatMinimized ? (
          <Button icon={<CaretUpOutlined />} type='text' size='small' shape='circle' onClick={() => setChatMinimized(false)} />
        ) : (
            <Button icon={<CaretDownOutlined />} type='text' size='small' shape='circle' onClick={() => setChatMinimized(true)} />
          )
        }
        <Button icon={<CloseOutlined />} type='text' size='small' shape='circle' onClick={() => setChatOpen(false)} />
      </div>
      <div style={{ height: 'calc(100% - 20px)' }}>
        <Chat/>
      </div>
    </div>

  );
}