import React, { useState } from 'react';
import {
  Collapse,
  Form,
  InputNumber,
  Radio
} from 'antd';
import { calculateLoanData, calculateAmortizedLoanData } from '../scripts/calculators';
import '../css/MonthlyPaymentCalculator.css';
import BarChart from './BarChart'

function MonthlyPaymentCalculator() {
  const [ inputs, setInputs ] = useState({
    purchasePrice: 0,
    cashBack: 0,
    taxRate: 0,
    tradeInValue: 0,
    tradeInOwed: 0,
    loanTerm: 36,
    interestRate: 0,
    downPayment: 0
  });
  const [ loanData, setLoanData ] = useState({
    loanAmount: 0,
    monthlyPayment: 0,
    interestPaidData: [{}],
    principalPaidData: [{}],
    endingBalanceData: [{}]
  });
  const [ radioData, setRadioData ] = useState({
    value: 1,
    chart_data: {title: "Loan Payoff Schedule", data: [{}]}
  });
  const { Panel } = Collapse;

  const onInputsChange = (formData) => {
    const newInputs = { ...inputs };
    formData.forEach(field => {
      newInputs[field.name[0]] = field.value !== "" ? field.value : 0;
    });
    Object.keys(newInputs).forEach(key => {
      if (newInputs[key] == null) {
        newInputs[key] = 0;
      }
    });
    setInputs(newInputs);

    const newLoanData = { ...loanData };
    const {loanAmount, monthlyPayment} = calculateLoanData(newInputs);
    newLoanData.loanAmount = loanAmount;
    newLoanData.monthlyPayment = monthlyPayment;

    // using amortize package
    const [newInterestPaidData, newPrincipalPaidData, newEndingBalanceData] = calculateAmortizedLoanData(newInputs);
    newLoanData.interestPaidData = newInterestPaidData;
    newLoanData.principalPaidData = newPrincipalPaidData;
    newLoanData.endingBalanceData = newEndingBalanceData;
    setLoanData(newLoanData);

    updateChart();
  };

  const updateChart = (event) => {
    const newRadioData = { ...radioData };

    if (event != null) {
      newRadioData.value = event.target.value;
    }

    if (newRadioData.value === 1) {
      newRadioData.chart_data.data = loanData.interestPaidData;
    } else if (newRadioData.value === 2) {
      newRadioData.chart_data.data = loanData.principalPaidData;
    } else {
      newRadioData.chart_data.data = loanData.endingBalanceData;
    }

    setRadioData(newRadioData);
  }

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
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
                onInputsChange(changedFields);
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
                onInputsChange(changedFields);
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
                onInputsChange(changedFields);
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
      <div className='chart-container' style={{'display': 'flex'}}>
        <div className='chart'>
          <BarChart data={radioData.chart_data} width={400} height={300} />
        </div>
        <div className='radio'>
          <Radio.Group onChange={updateChart} value={radioData.value}>
            <Radio style={radioStyle} value={1}>
              Interest Paid
            </Radio>
            <Radio style={radioStyle} value={2}>
              Principal Paid
            </Radio>
            <Radio style={radioStyle} value={3}>
              Ending Balance
            </Radio>
          </Radio.Group>
        </div>
      </div>
    </div>
  );
}

export default MonthlyPaymentCalculator;
