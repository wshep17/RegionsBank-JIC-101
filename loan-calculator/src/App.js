import React from 'react';
import { Tabs } from 'antd';
import './App.css';
import "antd/dist/antd.css";

function App() {
  const { TabPane } = Tabs;
  return (
    <div className="App">
      <header className="App-header"/>
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Vehicle Affordability" key="1">
            Content of Tab Pane 1
          </TabPane>
          <TabPane tab="Monthly Payment" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Low Rate vs. Cash Back" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
