/*
* Class for organizing and displaying the loan calculators
*/
import React from 'react'
import AffordabilityCalculator from './AffordabilityCalculator.js';
import MonthlyPaymentCalculator from './MonthlyPaymentCalculator.js';
import CashBackCalculator from './CashBackCalculator.js';
import { Tabs } from 'antd';
import "antd/dist/antd.css";
import "../css/App.css";
import ApplicantChat from './ApplicantChat.js';

export default function Calculator() {
	const { TabPane } = Tabs;
	return (
		<div>
			<div className='tabs-container'>
			  <Tabs className='calculator-tabs' defaultActiveKey="1" type="card">
			    <TabPane tab="Monthly Payment" key="1">
			      <MonthlyPaymentCalculator />
			    </TabPane>
			    <TabPane tab="Vehicle Affordability" key="2">
			      <AffordabilityCalculator />
			    </TabPane>
			    <TabPane tab="Low Rate vs. Cash Back" key="3">
			      <CashBackCalculator />
			    </TabPane>
			  </Tabs>
			</div>
			<ApplicantChat />
		</div>
	)
}