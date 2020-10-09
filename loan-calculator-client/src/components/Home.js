import React, { Component } from 'react';
import { Card, Col, Row } from 'antd';
import { ContextAPI } from './Context.js';
import AnonUserIdentification from './AnonUserIdentification.js';
import { BarChartOutlined, MessageOutlined } from '@ant-design/icons';


class Home extends Component {
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
          <Col span={10} style={{ margin: 'auto', padding: '10px' }}>
            <Card style={{ textAlign: 'center', backgroundColor: '#FFFFCC' }}
              hoverable={true}
              bordered={true}
              onClick={() => this.props.history.push('/chat-rooms')}
            ><b>Go to the Chat Rooms!<MessageOutlined style={{ fontSize: '50px'}}/></b></Card>
          </Col>
        )
      } else {
        return (
          <div></div>
        )
      }
    }
    return (
      <div>
        <AnonUserIdentification />
        <Row gutter={20}>
          <div style={{ margin: 'auto', width: '50%', paddingTop: '60px' }}>
            <Col span={10} style={{ margin: 'auto', padding: '10px' }}>
              <Card style={{ textAlign: 'center', backgroundColor: '#CCFFCC' }}
                hoverable={true}
                bordered={true}
                onClick={() => this.props.history.push('/calculator')}
              ><b>Go to the Calculator!<BarChartOutlined style={{ fontSize: '50px'}}/></b></Card>
            </Col>
            {conditionalRender()}
          </div>
        </Row>
      </div>
    )
  }


}

export default Home