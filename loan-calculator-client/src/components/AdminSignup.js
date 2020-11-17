import React from 'react'
import { Card, Col, Row, Input, Button } from 'antd';
import firebase from '../scripts/firebase.js'



class AdminSignup extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			name: "",
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
						Name: <Input placeholder="John Doe" name='name' value={this.state.name} onChange={this.handleChange}/>
						<br />
						<br />
						Email: <Input placeholder="john@bank.com" name='email' value={this.state.email} onChange={this.handleChange}/>
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

	async handleSubmitForm() {
		const db = firebase.firestore();
		
		var data = {
			name: this.state.name,
			email: this.state.email,
			password: this.state.password,
		}

		//Save user leveraging Firebase Authentication API(result not visible in schema)
		firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
		.then(async function () { 
			let user = firebase.auth().currentUser

			/**
			   Save user in Firebase Firestore(result visible in schema)
			   Note: The document can be accessed from the current user's uid
			*/
			const adminUsersRef = await db.collection('admin-users').doc(user.uid);
			await adminUsersRef.set({
				"admin_name": data.name,
				"admin_uid": user.uid
			})
		})
		.then(() => {
			alert('Successfully Created Account')
			this.props.history.push('/home')			
		})
		.catch((err) => console.log('error: ', err))
	}
}

export default AdminSignup