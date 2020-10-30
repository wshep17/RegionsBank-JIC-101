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
          dataIndex: 'lastQuestion',
          key: 'lastQuestion'
        },
        {
          title: 'Action',
          key: 'action',
          render: (record) => (
            <Popconfirm
              title="Continue to this private chat room?"
              onConfirm={() => this.handleOk(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link">Join Chat Room</Button>
            </Popconfirm>
          ),
        },
      ]
		}
    this.fetchRooms = this.fetchRooms.bind(this);
    this.handleOk = this.handleOk.bind(this);
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
    //console.log(this.state.chat_rooms);
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
        }
				list.push(data)
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

    console.log(adminUsersSnapShot);

    //DELETE THIS BEFORE MERGING
    this.props.history.push('/chat')

    if (adminUsersSnapShot.exists) {
      adminUsersRef.update({
        "admin_room_location": room
      })
      .then(() => {
        this.props.history.push('/chat')
      })
      //this.context.triggerAdminJoinRoom(room)
    } 
  }
}



export default withRouter(ChatRooms);