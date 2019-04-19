import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import Application from '../src/components/Application/Application'


function testInitialState() {
  mockConfigResponse();

  const app = shallow(<Application/>);

  let actualConfig = app.state().serverConfig;
  let expectedConfig = null;
  expect(actualConfig).toEqual(expectedConfig);

  let actualOptions = app.state().planOptions;
  let expectedOptions = {
    units: {"Nautical Miles": 3440, "kilometers": 6371, "miles": 3959},
    optimizations: 'none',
    activeUnit: 'miles'
  };

  expect(actualOptions).toEqual(expectedOptions);
}

function mockConfigResponse() {
  fetch.mockResponse(JSON.stringify(
      {
        status: 200,
        statusText: 'OK',
        body: {
          'placeAttributes': ["latitude", "longitude", "serverName"],
          'requestType': "config",
          'requestVersion': 1,
          'serverName': "t23"
        },
        type: 'basic',
        url: 'http://localhost:8088/api/config',
        redirected: false,
        ok: true
      }));
}

test("Testing Application's initial state", testInitialState);

function testUpdateOption() {
  const app = shallow(<Application/>);

  app.instance().updateStateVar('planOptions', 'activeUnit', 'miles');

  let actualUnit = app.state().planOptions.activeUnit;
  let expectedUnit = "miles";
  expect(actualUnit).toEqual(expectedUnit);
}

test("Testing Application's updatePlanOption function", testUpdateOption);

function testUpdateCalculator() {
    const app = shallow(<Application/>);

    app.instance().updateStateVar('calculatorInput', 'origin', '0, 0');

    let actualVal = app.state().calculatorInput.origin;
    let expectedVal = "0, 0";
    expect(actualVal).toEqual(expectedVal);
}

test("Testing Application's updateStateVar function for calculator", testUpdateCalculator);

function testNextPlaceID() {
    const app = shallow(<Application/>);

    expect(app.instance().getNextPlaceID()).toEqual("0");
    expect(app.instance().getNextPlaceID()).toEqual("1");
    expect(app.instance().getNextPlaceID()).toEqual("2");
    expect(app.instance().getNextPlaceID()).toEqual("3");
}

test("Testing Application's getNextPlaceID function to get unique values", testNextPlaceID);