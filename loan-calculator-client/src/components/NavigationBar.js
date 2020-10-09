import React, { Component } from 'react';
import { ContextAPI } from './Context.js';
import '../css/NavigationBar.css';
import { Button, Tooltip } from "antd";
import { HomeOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import firebase from '../scripts/firebase.js'

import { withRouter } from "react-router-dom";

class NavigationBar extends Component {
  /**
  * Refer to "AdminLogin.js" to better understand what this line means :)
  * Note: I prefer to leverage context with class components when possible. 
  *       It looks much cleaner/readable, but this can also be done with 
  *       functional components. Take a look at the "PrivateRoute.js" file
  *       for an example. 
  */
  static contextType = ContextAPI
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const conditionalRender = () => {
      if (this.context.isAdmin) {
        return (
          <div>
            <Tooltip title="Home">
              <Button onClick={() => this.props.history.push('/home')} shape='circle' icon={<HomeOutlined />} />
            </Tooltip>
            <Tooltip title='Logout'>
              <Button onClick={this.handleLogout.bind(this)} shape='circle' icon={<LogoutOutlined />} />
            </Tooltip>
          </div>
        )
      } else {
        return (
          <Tooltip title='Login'>
            <Button onClick={() => this.props.history.push('/login')} shape='circle' icon={<LoginOutlined />} />
          </Tooltip>
        )
      }
    }
    return (
      <div id='header'>
        <div id='app-title'>
          <h1>Loan Calculator</h1>
        </div>
        <div id='header-buttons'>
          {conditionalRender()}
        </div>
      </div>
    )
  }

  //Facilitate Logging Out
  handleLogout() {
    firebase.auth().signOut()
      .then(() => {
        this.context.triggerAdminLogout()
        alert('Successfully Logged Out')
      })
      .catch((err) => console.log(err))
  }
}

export default withRouter(NavigationBar)