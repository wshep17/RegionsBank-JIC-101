import React from 'react';
import { Tabs } from 'antd';
import AffordabilityCalculator from './AffordabilityCalculator';
import MonthlyPaymentCalculator from './MonthlyPaymentCalculator';
import CashBackCalculator from './CashBackCalculator';

import './App.css';
import "antd/dist/antd.css";

function App() {
  const { TabPane } = Tabs;
  return (
    <div className="App">
      <header className="App-header"/>
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
        </Tabs>
      </div>
    </div>
  );
}

export default App;
