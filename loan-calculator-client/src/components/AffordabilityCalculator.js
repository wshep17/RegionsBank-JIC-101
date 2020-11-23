// Regex is used to add and update symbols in the input boxes
import React, { useState }  from 'react';
import {
  Collapse,
  Form,
  InputNumber,
  Radio
} from 'antd';
import { calculateAffordability } from '../scripts/calculators';
import '../css/AffordabilityCalculator.css';
import BarChart from './BarChart';

function AffordabilityCalculator() {
  // Create the inputs for our calculator
  const [ inputs, setInputs ] = useState({
    monthlyPayment: 250,
    interestRate: 4.9,
    salesTaxRate: 8,
    cashBack: 500,
    valueOfTradeIn: 1500,
    amountOwnedOnTradeIn: 0,
    downPayment: 500
  });

  // Create radioData and set it to calue 1
  const [ radioData, setRadioData ] = useState({
    value: 1,
    chart_data_afford: { key: 2, title: "Vehicle Affordability by Loan Term", xAxisTitle: "Loan Term per Month", data: [{}] }
  });

  // Create an array for vehicleAffordability inputs
  const [ loanData, setLoanData ] = useState({
    vehiclePrice: 0,
    vehicleAffordability: [{}],
  });

  // Make the panels collapsed
  const { Panel } = Collapse;

  // Call it if inputs are changed
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

    // Using the Affordability Calculator
    newLoanData.vehicleAffordability = calculateAffordability(newInputs);
    const {vehiclePrice} = calculateAffordability(newInputs);
    newLoanData.vehiclePrice = vehiclePrice;
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
      newRadioData.chart_data_afford.data = loanData.vehicleAffordability;
    }

    setRadioData(newRadioData);
  }

  //style the radio buttons
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

  // displays/ updates chart based on user inputs
  return (
    <div>
      <div className='calculator-inputs'>
        {/* These are inputs for the loan information */}
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
                  <InputNumber 
                    min={0} 
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Interest Rate">
                <Form.Item name="interestRate" noStyle>
                  <InputNumber 
                    min={0} 
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}/>
                </Form.Item>
              </Form.Item>
            </Form>
          </Panel>

          {/* These are inputs for the vehicle purchase price information */}
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
                  <InputNumber 
                    min={0} 
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}/>
                </Form.Item>
              </Form.Item>
              <Form.Item label="Cash rebate/back">
                <Form.Item name="cashBack" noStyle>
                  <InputNumber 
                    min={0}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Value of your trade-in">
                <Form.Item name="valueOfTradeIn" noStyle>
                  <InputNumber 
                    min={0} 
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}/>
                </Form.Item>
              </Form.Item>
              <Form.Item label="Amount owed on trade-in">
                <Form.Item name="amountOwnedOnTradeIn" noStyle>
                  <InputNumber 
                    min={0} 
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}/>
                </Form.Item>
              </Form.Item>
              <Form.Item label="Down payment amount">
                <Form.Item name="downPayment" noStyle>
                  <InputNumber
                    min={0} 
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}/>
                </Form.Item>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
      </div>

      {/* This controls the display of the chart */}
      <div className='calc-outputs'>
        <div className='chart-container' style={{'display': 'flex'}}>
          <div className='chart'>
            <BarChart data={radioData.chart_data_afford} width={400} height={300} />
          </div>
          <div className='radio' style={{'display': 'none'}}>
            <Radio.Group onChange={updateChart} value={radioData.value}>
              <Radio style={radioStyle} value={1}>
                Vehicle Affordability
              </Radio>
            </Radio.Group>
          </div>
        </div>

        {/* This displays the chart data in text format */}
        <div className='main-outputs-container'>
          <h2 style={{ 'padding-bottom': '15px' }}>Vehicle Affordability by Loan Term</h2>
          <table>
            <tr>
              <td>12 Months</td>
              <td>24 Months</td>
              <td>36 Months</td>
              <td>48 Months</td>
              <td>60 Months</td>
            </tr>
            <tr>
              <th>{'$' + (loanData.vehicleAffordability.length > 1 ? loanData.vehicleAffordability[0].dollars.toFixed(0) : '5148')}</th>
              <th>{'$' + (loanData.vehicleAffordability.length > 1 ? loanData.vehicleAffordability[1].dollars.toFixed(0) : '7796')}</th>
              <th>{'$' + (loanData.vehicleAffordability.length > 1 ? loanData.vehicleAffordability[2].dollars.toFixed(0) : '10444')}</th>
              <th>{'$' + (loanData.vehicleAffordability.length > 1 ? loanData.vehicleAffordability[3].dollars.toFixed(0) : '13092')}</th>
              <th>{'$' + (loanData.vehicleAffordability.length > 1 ? loanData.vehicleAffordability[4].dollars.toFixed(0) : '15740')}</th>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AffordabilityCalculator;
