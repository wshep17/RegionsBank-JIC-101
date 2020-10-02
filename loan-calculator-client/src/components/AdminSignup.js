import React from 'react'
import { Card, Col, Row, Input, Button } from 'antd';
import firebase from '../scripts/firebase.js'



class AdminSignup extends React.Component {
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
				<Row gutter={10} style={{paddingTop: '70px'}}>
					<Col span={10} style={{margin: 'auto'}}>
						<Card title="Create An Account!" bordered={true}>
						Email: <Input placeholder="john@regions.com" name='email' value={this.state.email} onChange={this.handleChange}/>
						<br />
						<br />
						Password: <Input.Password placeholder="p@$$w0r6" name='password' value={this.state.password} onChange={this.handleChange}/>
						<br />
						<br />
						<Button block onClick={this.handleSubmitForm.bind(this)}>Signup</Button>
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
		firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
		.then((user) => {
			alert('Successfully Created Account')
			this.props.history.push('/home')
			console.log('user-creds: ', user)
		})
		.catch((err) => console.log('error: ', err))
	}
}

export default AdminSignup