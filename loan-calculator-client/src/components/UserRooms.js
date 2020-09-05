import React from 'react'


class UserRooms extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			'name': ''
		}
		this.fetchName = this.fetchName.bind(this)
	}
	componentDidMount() {
		this.fetchName()
	}
	render() {
		return(<div>
					Hello {this.state.name}!
					<br />
					This page will hold all of the user rooms to be joined by an admin/regions rep
					<br/>
			        This page will only show if the user is an admin. Requires Backend Call, which is
			        <br />
			        not implemented yet.
			    </div>)
	}

	fetchName() {
		fetch('chat')
		.then((response) => response.json())
		.then((data) => {
			if (data.status === 200) {
				this.setState({name: data.payload.name})
			} else {
				this.setState({name: ''})
			}
		})
		.catch((err) => console.log("Front End Error: ", err))
	}
}

export default UserRooms;