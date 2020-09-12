import React from 'react'
import { Card, Col, Row, Input, Button } from 'antd';
import { ContextAPI } from './Context.js'
import firebase from '../scripts/firebase.js'


class AdminLogin extends React.Component {
	/**
	* Developer Notes:
	* 1. This will provide our Login component with the nearest current
	*    value of our context, by using this.context.
	* 2. Example shown in the code below. Ping me(william) if you have any questions.
	* 3. Search for "triggerAdminLogin" in this file to see how I make use of a method provided
	*    within the "value" field passed through our Context Provider from the App.js file.
	* 4. To make the connection, open App.js and see search for the same method("triggerAdminLogin").
	* 5. The important thing is: "Consumers" can ONLY use things provided by the "Provider" ;)
	*/
	static contextType = ContextAPI
	constructor(props) {
		super(props)
		this.state = {
			email: "",
			password: ""				
		}
		this.handleChange = this.handleChange.bind(this)
	}
	render() {
		return (
			<div>
				<Row gutter={10} style={{paddingTop: '10px'}}>
					<Col span={10} style={{margin: 'auto'}}>
						<Card title="Admin Login Form" bordered={true}>
						Email: <Input placeholder="Email" name='email' value={this.state.email} onChange={this.handleChange}/>
						<br />
						<br />
						Password: <Input.Password placeholder="input password" name='password' value={this.state.password} onChange={this.handleChange}/>
						<br />
						<br />
						<Button block type="primary" onClick={this.handleSubmitForm.bind(this)}>Submit</Button>
						<br />
						<br />
						<Button block onClick={()=>this.props.history.push('/signup')}>Signup</Button>
						</Card>
					</Col>
				</Row>
			</div>
		)
	}

	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value })
	}

	handleSubmitForm() {
		var data = {
			email: this.state.email,
			password: this.state.password
		}
		
		firebase.auth().signInWithEmailAndPassword(data.email, data.password)
		.then((user) => {
			console.log('user-creds: ', user)
			this.context.triggerAdminLogin()
			this.props.history.push('/home')
			alert('Signed In Successfully!')
		})
		.catch((err) => {
			console.log('error: ', err)
			alert('Incorrect Credentials')
		})
	}
}

export default AdminLogin