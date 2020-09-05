import React from 'react'
import ChatRooms from './ChatRooms.js'
import {
  Link
} from "react-router-dom";

export default function Home() {
	const isAdmin = false
	const conditionalRender = () => {
		if (isAdmin) {
			return(
				<Link to="/chat-rooms">
					<button>Go to chat rooms</button>
				</Link>			
			)
		} else {
			return(
				<div></div>		
			)
		}
	}
	return (
		<div>
			<Link to="/calculator">
				<button>Go to calculator</button>
			</Link>
			{conditionalRender()}		
		</div>
	)
}