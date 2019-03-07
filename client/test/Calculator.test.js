import './enzyme.config.js';
import React from 'react';
import {mount} from 'enzyme';
import Calculator from '../src/components/Application/Calculator/Calculator';
import { sendServerRequestWithBody } from '../src/api/restfulAPI';

const startProperties = {
  'options': {
    'units': {'miles': 3959, 'kilometers': 6371},
    'activeUnit': 'miles',
    'serverPort': 'black-bottle.cs.colostate.edu:31400'
  }

};

const startInput = {
    'calculatorInput': {
        'origin':'',
        'destination':''
    }
};

jest.mock('../src/api/restfulAPI');
sendServerRequestWithBody.mockResolvedValue({statuscode: 200, distance: [1,1]});

afterEach(() => {
  console.log("clearing mocks");
  sendServerRequestWithBody.mockClear();
});


function testCreateInputFields() {
  let updateCalc = jest.fn();
  const calculator = mount((
      <Calculator options={startProperties.options}
                  calculatorInput={startInput.calculatorInput}
                  updateCalculatorInput={updateCalc}/>
  ));

  let numberOfInputs = calculator.find('Input').length;
  expect(numberOfInputs).toEqual(2);

  let actualInputs = [];
  calculator.find('Input').map((input) => actualInputs.push(input.prop('name')));

  let expectedInputs = [
    'origin',
    'destination',
  ];

  expect(actualInputs).toEqual(expectedInputs);
}

/* Tests that createForm() correctly renders 2 Input components */
test('Testing the createForm() function in Calculator', testCreateInputFields);

function testInputsOnChange() {
  let updateCalc = jest.fn();
  sendServerRequestWithBody.mockResolvedValue({statuscode: 200, distance: [1,1]});
  const calculator = mount((
      <Calculator options={startProperties.options}
                  calculatorInput={startInput.calculatorInput}
                  settings={startProperties.options}
                  updateCalculatorInput={updateCalc}/>
  ));

    simulateOnChangeEvent("0, 0", calculator);

    expect(sendServerRequestWithBody.mock.calls.length).toBe(1);
  expect(updateCalc.mock.calls.length).toBe(2);
  expect(updateCalc.mock.calls[0][0]).toBe("origin");
  expect(updateCalc.mock.calls[0][1]).toBe("0, 0");
  expect(updateCalc.mock.calls[1][0]).toBe("destination");
  expect(updateCalc.mock.calls[1][1]).toBe("1, 1");

}
function testInvalidInputs(){
    //sendServerRequestWithBody.mockResolvedValue({statuscode: 200, distance: [1,1]});
    const calculator2 = mount((
        <Calculator options={startProperties.options}
                    calculatorInput={startInput.calculatorInput}
                    settings={startProperties.options}/>
    ));

    simulateOnChangeEvent("cat", calculator2);
    simulateOnChangeEvent("cat", calculator2);

    expect(calculator2.state().origin).toEqual("cat");
    expect(calculator2.state().destination).toEqual("cat");
    expect(sendServerRequestWithBody.mock.calls.length).toBe(0);
}

function simulateOnChangeEvent(input, reactWrapper) {
  let event = {target: {value: `${input}`}};
  reactWrapper.find('#originOrigin').at(0).simulate('change', event);
  reactWrapper.find('#destinationDestination').at(0).simulate('change', event);
  reactWrapper.update();
}

/* To simulate the change, an event object needs to be created
 * with the name corresponding to its Input 'name' prop. Based on the index,
 * find the corresponding Input by its 'id' prop and simulate the change.
 *
 * Note: using find() with a prop as a selector for Inputs will return 2 objects:
 * 1: The function associated with the Input that is created by React
 * 2: The Input component itself
 *
 * The values in state() should be the ones assigned in the simulations.
 *
 * https://github.com/airbnb/enzyme/blob/master/docs/api/ShallowWrapper/simulate.md
 * https://airbnb.io/enzyme/docs/api/ReactWrapper/props.html
 * https://airbnb.io/enzyme/docs/api/ReactWrapper/find.html
 */
test('Testing the onChange event of Origin/Destination in Calculator with valid numbers', testInputsOnChange);
test('Testing the onChange event of Origin/Destination in Calculator with invalid numbers', testInvalidInputs);