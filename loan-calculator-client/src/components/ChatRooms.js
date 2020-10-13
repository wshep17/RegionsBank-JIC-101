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
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'Last Question',
          dataIndex: 'name',
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
    this.setState({visible: false})
    this.adminJoinRoom(record.room)
    this.props.history.push('/chat')
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
	fetchRooms() {
		let chatRoomsRef = firebase.database().ref(`private-rooms`);
		chatRoomsRef.on('value', (snapshot) => {
			let list = [];
			snapshot.forEach((item) => {
        let data = {
          ...item.val(),
          key: list.length,
          onClick: ()=>this.adminJoinRoom(item.room)
        };
				list.push(data);
			})
			this.setState({chat_rooms: list});
    });
	}

	//This function will allow the admin to join this room
	adminJoinRoom(room) {
		console.log(room)
		// Set the chat_room to "room" in the state in App.js (Possible through the Context API) 
		this.context.triggerAdminJoinRoom(room)
  }
}



export default withRouter(ChatRooms);