import React from 'react'


class ChatRooms extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			chat_rooms: []
		}
		this.fetchRooms = this.fetchRooms.bind(this)
	}
	componentDidMount() {
		//fetch the chat rooms from the database
		this.fetchRooms();
	}
	render() {
		const roomsList = () => {
			if (this.state.chat_rooms.length > 0) {
				this.state.chat_rooms.map((each) => {
					return (
						<li key={each._id}>
							<button>{each.room}</button>
						</li>
					)
				})
			}
		}

		return(
			<div style={{marginTop: '72px'}}>
				The following users have questions. Join their room to address their questions!
				<br />
				<ul>{roomsList}</ul>
			</div>
		)
	}

	//This function will fetch the rooms from the database
	fetchRooms() {
		fetch('/chat/get-rooms')
		.then((res) => res.json())
		.then((data) => this.setState({chat_rooms: data.payload}))
		.catch((err) => console.log(err))
	}
}



export default ChatRooms;