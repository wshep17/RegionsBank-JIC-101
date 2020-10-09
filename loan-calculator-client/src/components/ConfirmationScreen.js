import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { ContextAPI } from './Context.js';

import {
  withRouter 
} from "react-router-dom";

class ConfirmationScreen extends Component {

  static contextType = ContextAPI
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      name: ""
    }
  }
  


  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal.bind(this)}>
          Click to Join {this.props.name}.
        </Button>
        <Modal
          title="Continue to this private room?"
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
        </Modal>
      </div>
    )
  }
  showModal() {
    this.setState({
      visible: true,
    })
  }

  handleOk() {
    this.setState({visible: false})
    this.props.history.push('/chat')
  }

  handleCancel() {
    this.setState({
      visible: false,
    })
  }
}

export default withRouter(ConfirmationScreen)
