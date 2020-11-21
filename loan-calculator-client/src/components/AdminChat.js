import React, { Component } from 'react';
import Video from './Video.js';
import { ContextAPI } from './Context.js';
import Chat from './Chat.js';


/**
 * General Component:
 * Chatroom
 */
class AdminChat extends Component {

  static contextType = ContextAPI

  constructor(props) {
    super(props)

    this.state = {
      message: "",
      chat: [],
      status: true,
      context: ""
    }
  }


  render() {
    return (
      <div className='chat-container'>
        <Video />
        <Chat />
      </div>
    )
  }
}


export default AdminChat;
