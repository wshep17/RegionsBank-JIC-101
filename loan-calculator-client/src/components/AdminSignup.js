import React from 'react'
import { Card, Col, Row, Input, Button } from 'antd';


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
				<Row gutter={10} style={{paddingTop: '10px'}}>
					<Col span={10} style={{margin: 'auto'}}>
						<Card title="Create An Account!" bordered={true}>
						Email: <Input placeholder="john@regions.com" name='email' value={this.state.email} onChange={this.handleChange}/>
						<br />
						<br />
						Password: <Input.Password placeholder="password123" name='password' value={this.state.password} onChange={this.handleChange}/>
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
		fetch('auth/signup', {
			'method':  'POST', 
			'headers': {
				'Content-Type': 'application/json'
			},
			'body': JSON.stringify(data)
		})
		.then((response) => response.json())
		.then((data) => {
			console.log(data)
			if (data.status === 200) {
				alert('Successfully Created Account!')
				this.props.history.push('login')
			} else {
				alert(JSON.stringify(data.payload))
			}
		})
		.catch((err) => console.log(err))
	}
}

export default AdminSignup