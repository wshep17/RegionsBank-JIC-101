import React, { Component } from 'react'
import AffordabilityCalculator from './AffordabilityCalculator.js';
import MonthlyPaymentCalculator from './MonthlyPaymentCalculator.js';
import CashBackCalculator from './CashBackCalculator.js';
import UserRooms from './UserRooms.js';
import { Tabs } from 'antd';
import "antd/dist/antd.css";


class NavigationBar extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isAdmin: true
		}
	}
	render () {
		const { TabPane } = Tabs;
		const conditionalRender = () => {
			if (this.state.isAdmin) {
				return (							
				    <TabPane tab="User Rooms" key="4">
				      <UserRooms />
				    </TabPane>
				)
			} else {
				return (
					<div></div>
				)				
			}
		}
		return(
			<div>
				<header className="App-header">
					<p className="header-text">[Regions Logo here] Regions Loan Calculator</p>
				</header>
				<div className='tabs-container'>
				  <Tabs defaultActiveKey="1" type="card">
				    <TabPane tab="Monthly Payment" key="1">
				      <MonthlyPaymentCalculator />
				    </TabPane>
				    <TabPane tab="Vehicle Affordability" key="2">
				      <AffordabilityCalculator />
				    </TabPane>
				    <TabPane tab="Low Rate vs. Cash Back" key="3">
				      <CashBackCalculator />
				    </TabPane>
				    { conditionalRender() }
				  </Tabs>
				</div>
			</div>
		)	
	}
}

export default NavigationBar