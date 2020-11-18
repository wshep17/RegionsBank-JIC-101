import React, { Component } from 'react';
import firebase from '../scripts/firebase.js';
import { ContextAPI } from './Context.js';
import { Button, Popconfirm, Table } from 'antd';
import '../css/Chat.css';

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
      chat_rooms: [],
      columns: [
        {
          title: 'Name',
          dataIndex: 'creator_name',
          key: 'creator_name'
        },
        {
          title: 'Last Question',
          dataIndex: 'last_question',
          key: 'last_question'
        },
        {
          title: 'Action',
          key: 'action',
          render: (record) => (
            <div>
              <Popconfirm
                title="Continue to this private chat room?"
                onConfirm={() => this.handleOk(record)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link">Join Chat Room</Button>
              </Popconfirm>
              <Popconfirm
                title="Delete this chat room?"
                onConfirm={() => this.deleteChatroom(record).then(this.fetchRooms())}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link">Delete</Button>
              </Popconfirm>
            </div>
          ),
        },
      ]
		}
    this.fetchRooms = this.fetchRooms.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.deleteChatroom = this.deleteChatroom.bind(this);
  }
  
	componentDidMount() {
		//fetch the chat rooms from the database
		this.fetchRooms();
  }
  
   
  handleOk(record) {
    this.setState({visible: false}, function() {})
    this.adminJoinRoom(record.creator_uid)
  }

	render() {
    console.log(this.state.chat_rooms);
		return(
			<div style={{marginTop: '72px'}}>
        <Table
          columns={this.state.columns}
          dataSource={this.state.chat_rooms}
          pagination={{ pageSize: 20 }}
          scroll={{ y: 500 }}
        />
			</div>
		)
	}

	//This function will fetch all the rooms from the database
	async fetchRooms() {
		//let chatRoomsRef = firebase.database().ref(`private-rooms`);
    const db = firebase.firestore()
    let chatRoomsRef = await db.collection('chat-rooms')

		chatRoomsRef.onSnapshot(snapshot => {
			let list = []
			snapshot.forEach((item) => {
        let data = {
          ...item.data(),
          key: list.length
        };
        if (!data.status) { //only want to display rooms that need an admin
          if (data.last_question) {
            data.last_question = new Date(data.last_question.seconds * 1000).toString()
          }
          list.push(data);
        }
      })
			this.setState({chat_rooms: list})
    })

    // //TODO: fetch the room that the admin is in here
    // let user = firebase.auth().currentUser
    // const adminUsersRef = await db.collection('admin-users').doc(user.uid)

    // if (adminUsersRef.get().exists) {
    //   var room = adminUsersRef.data().joined_room
    //   this.adminJoinRoom(room)
    // }
	}

	//This function will allow the admin to join the room
	async adminJoinRoom(room) {
		//console.log(room)

    //Fetch the currently logged in user
    let user = firebase.auth().currentUser

    //Retrieve an instance of our Firestore Database
    const db = firebase.firestore()

    //Save the room in the database that the admin just joined
    let adminUsersRef = await db.collection('admin-users').doc(user.uid)
    let adminUsersSnapShot = await adminUsersRef.get()

    if (adminUsersSnapShot.exists) {
      adminUsersRef.update({
        "admin_room_location": room
      })
      .then(() => {
        this.props.history.push('/chat')
      })
      this.context.triggerAdminJoinRoom(room)
    } 
  }

  //Deletes the current chatroom(document) and its messages(documents in subcollection)
  async deleteChatroom(room_info) {

    //Retrieve an instance of our Firestore Database
    const db = firebase.firestore()

    //Delete messages(documents in subcollection) in the chatroom
    let messagesRef = await db.collection('chat-rooms').doc(room_info.creator_uid).collection('messages')
    await messagesRef.get().then(async (messages) => {
      if (messages.size !== 0) {
        const batch = db.batch()
        messages.forEach(message => {
          batch.delete(message.ref)
        })
        await batch.commit()

        //Prevents exploding the stack
        process.nextTick(() => {
          this.deleteChatroom(room_info)
        })
      }
    });

    //Delete chatroom(document)
    let roomRef = await db.collection('chat-rooms').doc(room_info.creator_uid)
    roomRef.delete();

    //Delete anon-user(document)
    let userRef = await db.collection('anon-users').doc(room_info.creator_uid)
    userRef.delete();
  }
}



export default withRouter(ChatRooms);