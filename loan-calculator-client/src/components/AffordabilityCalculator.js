import React, { useState }  from 'react';
import {
  Collapse,
  Form,
  InputNumber,
  Radio
} from 'antd';
import { } from '../scripts/calculators'; // add calculators inside the hooks
import '../css/AffordabilityCalculator.css';
import BarChart from './BarChart'

function AffordabilityCalculator() {

  const { Panel } = Collapse;

  const [ inputs, setInputs ] = useState({
    monthlyPayment: 0,
    interestRate: 0,
    salesTaxRate: 0,
    cashRebateOrCashBack: 0,
    valueOfTradeIn: 0,
    amountOwnedOnTradeIn: 0,
    downPayment:0,
  });

  return (
    <div>
      <div className='calculator-inputs'>
        <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
          <Panel header="Loan Information" key="1">
            <Form
              name="affordability-inputs"
              fields={[
                { name: ["monthlyPayment"], value: inputs.monthlyPayment },
                { name: ["interestRate"], value: inputs.interestRate },
              ]}
              onFieldsChange={(changedFields, allFields) => {
                //onInputsChange(changedFields);
              }}
            >
              <Form.Item label="Monthly Payment">
                <Form.Item name="monthlyPayment" noStyle>
                  <InputNumber min={0} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Interest Rate">
                <Form.Item name="interestRate" noStyle>
                  <InputNumber min={0} />
                </Form.Item>
              </Form.Item>
            </Form>
          </Panel>
          <Panel header="Purchase Information" key="2">
          <Form
              name="affordability-inputs"
              fields={[
                { name: ["salesTaxRate"], value: inputs.salesTaxRate },
                { name: ["cashRebateOrCashBack"], value: inputs.cashRebateOrCashBack },
                { name: ["valueOfTradeIn"], value: inputs.valueOfTradeIn },
                { name: ["amountOwnedOnTradeIn"], value: inputs.amountOwnedOnTradeIn },
                { name: ["downPayment"], value: inputs.downPayment }
              ]}
              onFieldsChange={(changedFields, allFields) => {
                //onInputsChange(changedFields);
              }}
            >
              <Form.Item label="Sales tax rate">
                <Form.Item name="salesTaxRate" noStyle>
                  <InputNumber min={0} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Cash rebate or cash back">
                <Form.Item name="cashRebateOrCashBack" noStyle>
                  <InputNumber min={0} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Value of your trade-in">
                <Form.Item name="valueOfTradeIn" noStyle>
                  <InputNumber min={0} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Amount owed on trade-in">
                <Form.Item name="amountOwnedOnTradeIn" noStyle>
                  <InputNumber min={0} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Down payment amount">
                <Form.Item name="downPayment" noStyle>
                  <InputNumber min={0} />
                </Form.Item>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
}

export default AffordabilityCalculator;