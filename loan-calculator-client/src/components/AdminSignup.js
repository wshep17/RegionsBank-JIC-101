import React from 'react'

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
				Regions Representative Signup Page:
				<form>
					<input placeholder='email' name='email' value={this.state.email} onChange={this.handleChange}></input>
					<input placeholder='password' name='password' value={this.state.password} onChange={this.handleChange}></input>
				</form>
				<button onClick={this.handleSubmitForm.bind(this)}>Submit</button>
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
				this.props.history.push('login')
			}
		})
		.catch((err) => console.log(err))
	}
}

export default AdminSignup