import React from 'react';
import { Collapse } from 'antd';
import './MonthlyPaymentCalculator.css';
import BarChart from './chart'
import { loan_data } from './data';

function MonthlyPaymentCalculator() {
  const { Panel } = Collapse;

  return (
    <div>
      <div className='calculator-inputs'>
        <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
          <Panel header="Vehicle Information" key="1">
            vehicle purchase price, cash back, sales tax rate
          </Panel>
          <Panel header="Trade-In Information" key="2">
            value of trade-in, amount owed on trade-in
          </Panel>
          <Panel header="Loan Information" key="3">
            loan terms (months), interest rate, down payment
          </Panel>
        </Collapse>
      </div>
      <div className='chart'>
        <BarChart data={loan_data} width={400} height={300} />
      </div>
    </div>
  );
}

export default MonthlyPaymentCalculator;
