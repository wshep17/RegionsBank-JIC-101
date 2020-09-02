import React, { useState } from 'react';
import {
  Collapse,
  Form,
  InputNumber
} from 'antd';
import { calculateLoanData } from './calculators';
import './MonthlyPaymentCalculator.css';

function MonthlyPaymentCalculator() {
  const [ inputs, setInputs ] = useState({
    purchasePrice: 0.0,
    cashBack: 0,
    taxRate: 0,
    tradeInValue: 0,
    tradeInOwed: 0,
    loanTerm: 36,
    interestRate: 0,
    downPayment: 0,
    loanAmount: 0,
    monthlyPayment: 0
  });
  const { Panel } = Collapse;

  const onChange = (formData) => {
    const newInputs = { ...inputs };
    formData.forEach(field => {
      newInputs[field.name[0]] = field.value !== "" ? field.value : 0;
    });
    Object.keys(newInputs).forEach(key => {
      if (newInputs[key] == null) {
        newInputs[key] = 0;
      }
    });
    const {loanAmount, monthlyPayment} = calculateLoanData(newInputs);
    newInputs.loanAmount = loanAmount;
    newInputs.monthlyPayment = monthlyPayment;
    // console.log(loanAmount, monthlyPayment);
    setInputs(newInputs);
  };

  return (
    <div>
      <div className='calculator-inputs'>
        <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
          <Panel header="Vehicle Information" key="1">
            <Form
              name="monthly-payment-inputs"
              fields={[
                { name: ["purchasePrice"], value: inputs.purchasePrice },
                { name: ["cashBack"], value: inputs.cashBack },
                { name: ["taxRate"], value: inputs.taxRate }
              ]}
              onFieldsChange={(changedFields, allFields) => {
                onChange(changedFields);
              }}
            >
              <Form.Item label="Vehicle Purchase Price">
                <Form.Item name="purchasePrice" noStyle>
                  <InputNumber min={0} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Cash Back">
                <Form.Item name="cashBack" noStyle>
                  <InputNumber min={0} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Sales Tax Rate">
                <Form.Item name="taxRate" noStyle>
                  <InputNumber min={0} />
                </Form.Item>
              </Form.Item>
            </Form>
          </Panel>
          <Panel header="Trade-In Information" key="2">
          <Form
              name="monthly-payment-inputs"
              fields={[
                { name: ["tradeInValue"], value: inputs.tradeInValue },
                { name: ["tradeInOwed"], value: inputs.tradeInOwed }
              ]}
              onFieldsChange={(changedFields, allFields) => {
                onChange(changedFields);
              }}
            >
              <Form.Item label="Value of Trade-in">
                <Form.Item name="tradeInValue" noStyle>
                  <InputNumber min={0} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Amount Owed on Trade-in">
                <Form.Item name="tradeInOwed" noStyle>
                  <InputNumber min={0} />
                </Form.Item>
              </Form.Item>
            </Form>
          </Panel>
          <Panel header="Loan Information" key="3">
            <Form
              name="monthly-payment-inputs"
              fields={[
                { name: ["loanTerm"], value: inputs.loanTerm },
                { name: ["interestRate"], value: inputs.interestRate },
                { name: ["downPayment"], value: inputs.downPayment }
              ]}
              onFieldsChange={(changedFields, allFields) => {
                onChange(changedFields);
              }}
            >
              <Form.Item label="Loan Term (months)">
                <Form.Item name="loanTerm" noStyle>
                  <InputNumber min={0} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Interest Rate">
                <Form.Item name="interestRate" noStyle>
                  <InputNumber min={0} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Down Payment">
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

export default MonthlyPaymentCalculator;
