import React from 'react';
import Chat from './Chat.js';
import MediaPortal from './MediaPortal.js'
import NavigationBar from './NavigationBar.js'
import firebase from '../scripts/firebase.js';
import { Button, Modal } from 'antd';
import { CloseOutlined, CaretUpOutlined, CaretDownOutlined, VideoCameraOutlined } from '@ant-design/icons';
import NewWindow from 'react-new-window'
import "antd/dist/antd.css";
import "../css/App.css";
import "../css/ApplicantChat.css";



class ApplicantChat extends React.Component {
  constructor(props) {
    /*
    * open-chat: the chat window is open and the user can type in it
    * minimized-chat: there has been a chat window opened, but it is currently minimized
    * closed-chat: there is no chat window open, and the user can open one by clicking "Chat with an Advisor"
    */
    super(props);
    this.state = {
      chatOpen: false,
      chatMinimized: false,
      name: '',
      isSignedIn: false
    };
    this.anonUserListener = null;
  }

  async componentDidMount() {
    if (firebase.auth().currentUser) {
      let user = await firebase.auth().currentUser
      const db = firebase.firestore()
      let anonUserRef = db.collection('anon-users').doc(user.uid)
      let anonUserSnapshot = await anonUserRef.get()
      if (anonUserSnapshot.exists) {
        this.anonUserListener = anonUserRef.onSnapshot(snapshot => {
          if (!snapshot.data()) {
            this.anonUserListener()
            firebase.auth().signOut()
            this.setState({
              isSignedIn: false,
              chatOpen: false
            })
          }
        })
      } else {
        firebase.auth().signOut()
      }
    }
  }

  // Saves anonymous user information to Firestore (name, uid, chatbot status)
  handleOk = () => {
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
        this.setState({
          chatMinimized: false,
          isSignedIn: true
        });
      })
    })
    .catch((err) => console.log(err))
  }

  //This function will create another room in the database and send a greeting from the chatbot
  async createRoom(room_name, creator_name, creator_uid) {    
    const db = firebase.firestore();
    let anonUserRef = await db.collection('anon-users').doc(creator_uid)
    this.anonUserListener = anonUserRef.onSnapshot(snapshot => {
      if (!snapshot.data()) {
        this.anonUserListener()
        this.setState({
          isSignedIn: false,
          chatOpen: false
        })
      }
    })

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

  activateVideoPortal() {
    this.setState({videoPortal: true}, function() {
      console.log('videoPortal: ', this.state.videoPortal)
    })
  }
}

export default ApplicantChat;