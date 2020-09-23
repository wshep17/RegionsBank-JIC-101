import React, { useState }  from 'react';
import {
  Collapse,
  Form,
  InputNumber,
  Radio
} from 'antd';
import { calculateAffordability } from '../scripts/calculators';
import '../css/AffordabilityCalculator.css';
import BarChart from './BarChart'

function AffordabilityCalculator() {
  // make the panels collapsed
  // create the inputs for our calculator
  const [ inputs, setInputs ] = useState({
    monthlyPayment: 0,
    interestRate: 0,
    salesTaxRate: 0,
    cashBack: 0,
    valueOfTradeIn: 0,
    amountOwnedOnTradeIn: 0,
    downPayment: 0
  });
  
  // create radioData and set it to calue 1
  const [ radioData, setRadioData ] = useState({
    value: 1,
    chart_data: [{}]
  });
  
  
  //create an array for vehicleAffordability inputs
  const [ loanData, setLoanData ] = useState({
    vehiclePrice: 0, //added this
    vehicleAffordability: [{}],
  });
  const { Panel } = Collapse; // moved this line
  
  //call it if inputs are changed
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
    
    const newLoanData = { ...loanData }; //moved this line
    
    // using affordability calculator
    newLoanData.vehicleAffordability = calculateAffordability(newInputs);
    const {vehiclePrice} = calculateAffordability(newInputs); // added this
    newLoanData.vehiclePrice = vehiclePrice; // added this
    setLoanData(newLoanData);
    
    updateChart();
  };
  
  // Update chart depending on the radio buttons
  const updateChart = (event) => {
    const newRadioData = { ...radioData };
    
    if (event != null) {
      newRadioData.value = event.target.value;
    }
    
    if (newRadioData.value === 1) {
      newRadioData.chart_data = loanData.vehicleAffordability;
    }
    
    setRadioData(newRadioData);
  }

  //style the radio buttons
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };
  
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
                onInputsChange(changedFields);
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
                { name: ["cashBack"], value: inputs.cashBack },
                { name: ["valueOfTradeIn"], value: inputs.valueOfTradeIn },
                { name: ["amountOwnedOnTradeIn"], value: inputs.amountOwnedOnTradeIn },
                { name: ["downPayment"], value: inputs.downPayment }
              ]}
              onFieldsChange={(changedFields, allFields) => {
                onInputsChange(changedFields);
              }}
            >
              <Form.Item label="Sales tax rate">
                <Form.Item name="salesTaxRate" noStyle>
                  <InputNumber min={0} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Cash rebate or cash back">
                <Form.Item name="cashBack" noStyle>
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
      <div className='chart-container' style={{'display': 'flex'}}>
        <div className='chart'>
          <BarChart data={radioData.chart_data} width={400} height={300} />
        </div>
        <div className='radio'>
          <Radio.Group onChange={updateChart} value={radioData.value}>
            <Radio style={radioStyle} value={1}>
              Vehicle Affordability
            </Radio>
          </Radio.Group>
        </div>
      </div>
    </div>
  );
}

export default AffordabilityCalculator;