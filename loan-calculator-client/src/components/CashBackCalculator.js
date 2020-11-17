import React, { useState } from 'react';
import {
  Collapse,
  Form,
  InputNumber,
  Radio
} from 'antd';
import { calculateCashBack } from '../scripts/calculators';
import '../css/CashBackCalculator.css';
import BarChart from './BarChart';
import ReactTooltip from 'react-tooltip';
import { InfoCircleTwoTone } from '@ant-design/icons';


function CashBackCalculator() {
  // create the inputs for our calculator
  const [ inputs, setInputs ] = useState({
    purchasePrice: 25000,
    cashBack: 500,
    lowInterestRate: 1.9,
    taxRate: 8,
    tradeInValue: 15000,
    tradeInOwed: 0,
    loanTerm: 60,
    interestRate: 4.9,
    downPayment: 500
  });

  const [ loanData, setLoanData ] = useState({
    loanAmount: 0,
    monthlyPayment: 0,
    totalData: [{}],
    totalPrincipalPaidData: [{}],
    totalInterestPaidData: [{}]
  });

  const [ radioData, setRadioData ] = useState({
    value: 1,
    chart_data: {key: 1, title: "Total Cost of Loan", xAxisTitle: "", data: [{}]}
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
    const {loanAmount, monthlyPayment} = calculateCashBack(newInputs);
    newLoanData.loanAmount = loanAmount;
    newLoanData.monthlyPayment = monthlyPayment;

    // using amortize package
    const [totalData, totalPrincipalPaidData, totalInterestPaidData] = calculateCashBack(newInputs);
    newLoanData.totalData = totalData;
    newLoanData.totalPrincipalPaidData = totalPrincipalPaidData;
    newLoanData.totalInterestPaidData = totalInterestPaidData;
    setLoanData(newLoanData);

    updateChart();
  };
  
  // toggle for chart buttons
  const updateChart = (event) => {
    const newRadioData = { ...radioData };

    if (event != null) {
      newRadioData.value = event.target.value;
    }

    if (newRadioData.value === 1) {
      newRadioData.chart_data.data = loanData.totalData;
    } else if (newRadioData.value === 2) {
      newRadioData.chart_data.data = loanData.totalPrincipalPaidData;
    } else {
      newRadioData.chart_data.data = loanData.totalInterestPaidData;
    }

    setRadioData(newRadioData);
  }

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

  // displays/ updates the chart based on user inputs
  return (
    <div>
      <div className='calculator-inputs'>
        <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
        <Panel header="Vehicle Information" key="1">
            <Form
              name="cashback-inputs"
              fields={[
                { name: ["purchasePrice"], value: inputs.purchasePrice },
                { name: ["cashBack"], value: inputs.cashBack },
                { name: ["lowInterestRate"], value: inputs.lowInterestRate },
                { name: ["taxRate"], value: inputs.taxRate }
              ]}
              onFieldsChange={(changedFields, allFields) => {
                onInputsChange(changedFields);
              }}
            >
              <Form.Item label="Vehicle Purchase Price">
                <Form.Item name="purchasePrice" noStyle>
                  <InputNumber min={0} 
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                  <InfoCircleTwoTone 
                    data-tip='The price you pay for your vehicle including extras and upgrades' 
                    data-effect='solid'
                    data-type='info'
                    style={{ margin: 2 }}
                  />
                  <ReactTooltip 
                    place="bottom" 
                    class='tooltip-style' 
                    effect='solid'
                    type='info'
                    offset="{'top': -5}"
                  />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Cash Back">
                <Form.Item name="cashBack" noStyle>
                  <InputNumber min={0} 
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                  <InfoCircleTwoTone 
                    data-tip='The amount of the dealer or manufacturer incentive to purchase a specific vehicle' 
                    data-effect='solid'
                    data-type='info'
                    style={{ margin: 2 }}
                  />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Low Interest Rate">
                <Form.Item name="lowInterestRate" noStyle>
                  <InputNumber min={0} 
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />
                  <InfoCircleTwoTone 
                    data-tip='The special incentive low interest rate offered on this vehicle loan' 
                    data-effect='solid'
                    data-type='info'
                    style={{ margin: 2 }}
                  />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Sales Tax Rate">
                <Form.Item name="taxRate" noStyle>
                  <InputNumber min={0} 
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />
                  <InfoCircleTwoTone 
                    data-tip='The sales tax rate that you will pay when you purchase your vehicle' 
                    data-effect='solid'
                    data-type='info'
                    style={{ margin: 2 }}
                  />
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
                  <InputNumber min={0} 
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                  <InfoCircleTwoTone 
                    data-tip='What the dealer will give you for a used vehicle at trade-in' 
                    data-effect='solid'
                    data-type='info'
                    style={{ margin: 2 }}
                  />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Amount Owed on Trade-in">
                <Form.Item name="tradeInOwed" noStyle>
                  <InputNumber min={0} 
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                  <InfoCircleTwoTone 
                    data-tip='The balance on any outstanding loan that may exist for your trade-in' 
                    data-effect='solid'
                    data-type='info'
                    style={{ margin: 2 }}
                  />
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
                  <InfoCircleTwoTone 
                    data-tip='The lenth of time you have to repay your loan in months' 
                    data-effect='solid'
                    data-type='info'
                    style={{ margin: 2 }}
                  />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Interest Rate">
                <Form.Item name="interestRate" noStyle>
                  <InputNumber min={0} 
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />
                  <InfoCircleTwoTone 
                    data-tip='The rate at which interest will be charged on your outstanding vehicle loan balance' 
                    data-effect='solid'
                    data-type='info'
                    style={{ margin: 2 }}
                  />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Down Payment">
                <Form.Item name="downPayment" noStyle>
                  <InputNumber min={0} 
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                  <InfoCircleTwoTone 
                    data-tip='The amount of money you will pay up front for your vehicle' 
                    data-effect='solid'
                    data-type='info'
                    style={{ margin: 2 }}
                  />
                </Form.Item>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
      </div>
      <div className='calc-outputs'>
        <div className='chart-container' style={{'display': 'flex'}}>
          <div className='chart'>
            <BarChart data={radioData.chart_data} width={400} height={300} />
          </div>
          <div className='radio'>
            <Radio.Group onChange={updateChart} value={radioData.value}>
              <Radio style={radioStyle} value={1}>
                Total
              </Radio>
              <Radio style={radioStyle} value={2}>
                Total Principal Paid
              </Radio>
              <Radio style={radioStyle} value={3}>
                Total Interest Paid
              </Radio>
            </Radio.Group>
          </div>
        </div>
        <div className='main-outputs-container'>
          <h2 style={{ 'padding-bottom': '5px' }}>Cash Back Option</h2>
          <table>
            <tr>
              <td>Total Paid</td>
            </tr>
            <tr>
              <th>{'$' + (loanData.totalData.length > 1 ? loanData.totalData[0].dollars.toFixed(0) : '10979')}</th>
            </tr>
          </table>
          <h2 style={{ 'padding-bottom': '5px', 'padding-top': '10px' }}>Low Rate Option</h2>
          <table>
            <tr>
              <td>Total Paid</td>
            </tr>
            <tr>
              <th>{'$' + (loanData.totalData.length > 1 ? loanData.totalData[1].dollars.toFixed(0) : '10763')}</th>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CashBackCalculator;
