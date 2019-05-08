import './enzyme.config.js';
import React from 'react';
import {mount} from 'enzyme';
import CustomUnit from "../src/components/Application/Settings/CustomUnit";

const startProperties = {
    'settings': { 'serverPort': 'black-bottle.cs.colostate.edu:31400' },
    'updateSetting': () => {},
    'planOptions': {
        'units': {},
        'activeUnit': '',
    }
};

const startInput = {
    'customUnitInput': {
        'inputText':'',
        'inputNum':''
    }
};

function testCreateInputFields() {
    const customunit = mount((
        <CustomUnit planOptions={startProperties.planOptions}
                    customUnitInput={startInput.customUnitInput}
                    updateStateVar={jest.fn()}/>
    ));

    let numberOfInputs = customunit.find('Input').length;
    expect(numberOfInputs).toEqual(2);

    let actualInputs = [];
    customunit.find('Input').map((input) => actualInputs.push(input.prop('placeholder')));

    let expectedInputs = [
        'Name',
        '0',
    ];

    expect(actualInputs).toEqual(expectedInputs);
}

test('Tests that the two input components are rendered correctly', testCreateInputFields);


function testCustomUnitAdd() {
    const mockPlanOptions = jest.fn();

    const customunit = mount((
        <CustomUnit planOptions={startProperties.planOptions}
                    customUnitInput={startInput.customUnitInput}
                    updateStateVar={mockPlanOptions}/>
    ));

    expect(customunit.state().inputText).toEqual('');
    expect(customunit.state().inputNum).toEqual('');

    let inputText = 'Glorks';
    let inputNum  = 3003;
    //TODO: Doesn't actually add {'Glorks': 3003} to the props().planOptions.units
    simulateOnChangeEvent(inputText, inputNum, customunit);

    //state should be empty after button is pressed
    expect(mockPlanOptions.mock.calls.length).toEqual(1);
    expect(mockPlanOptions.mock.calls[0][0]).toEqual('planOptions');
    expect(mockPlanOptions.mock.calls[0][1]).toEqual('units');
    expect(mockPlanOptions.mock.calls[0][2]).toEqual({'Glorks': 3003});
}

function simulateOnChangeEvent(inputText, inputNum, reactWrapper) {
    let event = {target: {value: inputText}};
    reactWrapper.find('Input').at(0).simulate('change', event);
    event = {target: {value: inputNum}};
    reactWrapper.find('Input').at(1).simulate('change', event);
    reactWrapper.find('Button').at(0).simulate('submit', event);
    reactWrapper.update();
}

// Tests the ability to add custom units
test('Testing the addUnits() function in CustomUnit', testCustomUnitAdd);

const planOptions = {
    'units': {'Glorks': 1},
    'activeUnit': 'miles',
};

function testCustomUnitDelete() {
    const mockUpdate = jest.fn();
    const customunit = mount((
        <CustomUnit planOptions={planOptions}
                    customUnitInput={startInput.customUnitInput}
                    updateStateVar={mockUpdate}/>
    ));

    //Presses button, deleting
    simulateButtonPress(customunit);
    console.log("DEBUG: ", mockUpdate.mock.calls);
    expect(mockUpdate.mock.calls.length).toEqual(1);
    expect(mockUpdate.mock.calls[0]).toEqual(['planOptions',"units",{}]);
}

function simulateButtonPress(reactWrapper) {
    //Delete button is first seen; it is at(0)
    reactWrapper.find('Button').at(0).simulate('click');
    reactWrapper.update();
}

//Tests ability to remove previously added custom unit
test('Testing the deleteUnits() function in CustomUnit', testCustomUnitDelete);