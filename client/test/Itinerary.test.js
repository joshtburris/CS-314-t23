// Note the name of this file has X.test.js. Jest looks for any files with this pattern.
import './enzyme.config.js'
import React from 'react'
import { shallow, mount } from 'enzyme'
import Itinerary from '../src/components/Application/Itinerary/Itinerary'
import Optimizations from '../src/components/Application/Itinerary/Optimizations'


const startProperties = {
    'options': {
        'units': {'miles': 3959, 'kilometers': 6371},
        'activeUnit': 'miles',
        'optimizations': 'none',
        'serverPort': 'black-bottle.cs.colostate.edu:31400'
    },
    'itineraryPlan': {
        'places':[  {id: "do", name: "does", latitude: -12, longitude: -12},
                    {id: "th", name: "this", latitude: -8.5, longitude: 4},
                    {id: "te", name: "test", latitude: 4, longitude: 2},
                    {id: "wo", name: "work", latitude: 11, longitude: -2.5}],
        'distances':[14, 24, 6, 41],
        'markers':{},
        'boundaries':null
    },
    'headerOptions': {
        'name':true,
        'legDistance':true,
        'totalDistance':true,
        'lat':false,
        'lon':false
    },
    'config': {'optimizations': ['none', 'short']},
    'updateStateVar' : () => {},
    'updateItineraryState' : () => {}
};

const emptyItinerary = {
    'places':[],
    'distances':[],
    'markers':{},
    'boundaries':null
};

//jest.mock('../src/api/restfulAPI');

function testAddLocation() {
    let updatedState = jest.fn();
    let error = jest.fn();
    function getNextPlaceID() { return "0"; }
    const itinerary = shallow((<Itinerary
        options={startProperties.options}
        config={startProperties.options}
        settings={startProperties.options}
        itineraryPlan={emptyItinerary}
        headerOptions={startProperties.headerOptions}
        updateStateVar={jest.fn()}
        setStateVar={updatedState}
        getNextPlaceID={getNextPlaceID}
        createErrorBanner={error}/>
    ));

    let newItin = emptyItinerary;
    newItin["places"].push({id: "0", name: "name", latitude: "50.2", longitude: "80.4"});
    newItin["markers"]["0"] = false;
    itinerary.instance().addLocation("name", "50.2", "80.4");
    expect(error.mock.calls.length).toEqual(0);
    expect(updatedState.mock.calls.length).toEqual(1);
    expect(updatedState.mock.calls[0][0]).toEqual("itineraryPlan");
    expect(updatedState.mock.calls[0][1]).toEqual(newItin);

    newItin["places"].push({id: "1", name: "name", latitude: "50.2", longitude: "80.4"});
    newItin["markers"]["1"] = false;
    itinerary.instance().addLocation("name", 50.2, 80.4);
    expect(updatedState.mock.calls[1][1]).toEqual(newItin);

    itinerary.instance().addLocation("name", "50364.02a", "80.4");
    expect(updatedState.mock.calls.length).toEqual(2);
    itinerary.instance().addLocation("name", "50.2", "45a.f");
    expect(updatedState.mock.calls.length).toEqual(2);
    itinerary.instance().addLocation("123", "50.2", "80.4");
    expect(updatedState.mock.calls.length).toEqual(2);
    itinerary.instance().addLocation("name", "50.2.5", "80.4");
    expect(updatedState.mock.calls.length).toEqual(2);
}

test("Testing addLocation function of itinerary", testAddLocation);

function testSaveButton() {
    const itinerary = shallow((
        <Itinerary   options={startProperties.options}
                     config={startProperties.options}
                     settings={startProperties.options}
                     itineraryPlan={startProperties.itineraryPlan}
                     headerOptions={startProperties.headerOptions}
                     updateStateVar={jest.fn()}
        />
    ));

    // testing that it exists (According to TA testing functionality is too complicated, this is fine)
    expect(itinerary.find('#saveJSON').length).toEqual(1);
    expect(itinerary.find('#saveCSV').length).toEqual(1);
    expect(itinerary.find('#saveSVG').length).toEqual(1);
}

test("Testing save button in itinerary", testSaveButton);

function testUploadButton() {
    const itinerary = shallow((
        <Itinerary   options={startProperties.options}
                     config={startProperties.options}
                     settings={startProperties.options}
                     itineraryPlan={startProperties.itineraryPlan}
                     headerOptions={startProperties.headerOptions}
                     updateItineraryPlan={jest.fn()}/>
    ));

    // testing that it exists (According to TA testing functionality is too complicated, this is fine)
    expect(itinerary.contains('#loadButton'));
}

test("Testing upload button in itinerary", testUploadButton);

function testUpdateButton() {
    const itinerary = shallow((
        <Itinerary   options={startProperties.options}
                     config={startProperties.options}
                     settings={startProperties.options}
                     itineraryPlan={startProperties.itineraryPlan}
                     headerOptions={startProperties.headerOptions}
                     updateItineraryPlan={jest.fn()}/>
    ));

    expect(itinerary.contains('#updateButton'));
}

test("Testing update button exists in itinerary", testUpdateButton);

function testReverseButton(){
    let updateState = jest.fn();
    const itinerary = shallow((
        <Itinerary   options={startProperties.options}
                     config={startProperties.options}
                     settings={startProperties.options}
                     itineraryPlan={startProperties.itineraryPlan}
                     headerOptions={startProperties.headerOptions}
                     setStateVar={updateState}/>
    ));

    let e = startProperties.itineraryPlan.places;
    simulateReverseButtonPress(e, itinerary);

    let revPlaces = {};
    Object.assign(revPlaces, startProperties.itineraryPlan);
    revPlaces.places.reverse();
    revPlaces.distances = [];

    expect(updateState.mock.calls.length).toEqual(1);
    expect(updateState.mock.calls[0]).toEqual(["itineraryPlan", revPlaces]);
}

function simulateReverseButtonPress(e, reactWrapper) {
    reactWrapper.find('#reverseButton').at(0).simulate('click');
    reactWrapper.update();
}

test("Testing reverse button", testReverseButton);

function simulateMarkerTogglePress(e, reactWrapper) {
    reactWrapper.find('#markerToggleAll').at(0).simulate('click');
    reactWrapper.update();
}

const markersSetItinerary1 = {
    'places':[  {id: "do", name: "does", latitude: -12, longitude: -12},
        {id: "th", name: "this", latitude: -8.5, longitude: 4},
        {id: "te", name: "test", latitude: 4, longitude: 2},
        {id: "wo", name: "work", latitude: 11, longitude: -2.5}],
    'distances':[14, 24, 6, 41],
    'markers':{do: false, th: false, te: false, wo: false},
};

const markersSetItinerary2 = {
    'places':[  {id: "do", name: "does", latitude: -12, longitude: -12},
        {id: "th", name: "this", latitude: -8.5, longitude: 4},
        {id: "te", name: "test", latitude: 4, longitude: 2},
        {id: "wo", name: "work", latitude: 11, longitude: -2.5}],
    'distances':[14, 24, 6, 41],
    'markers':{do: true, th: true, te: true, wo: true},
};

function testAllMarkerToggleOn(){
    let markTog = jest.fn();
    const itinerary = shallow((
        <Itinerary   options={startProperties.options}
                     config={startProperties.options}
                     settings={startProperties.options}
                     itineraryPlan={markersSetItinerary1}
                     headerOptions={startProperties.headerOptions}
                     updateStateVar={markTog}/>
    ));

    let e = startProperties.itineraryPlan.markers;
    simulateMarkerTogglePress(e, itinerary);

    expect(markTog.mock.calls.length).toEqual(1);
    expect(markTog.mock.calls[0][0]).toEqual("itineraryPlan");
    expect(markTog.mock.calls[0][1]).toEqual("markers");
    expect(markTog.mock.calls[0][2]).toEqual({do: true, th: true, te: true, wo: true});
}

test("Testing All Markers ON toggle in itinerary", testAllMarkerToggleOn);

function testAllMarkerToggleOff(){
    let markTog = jest.fn();
    const itinerary = shallow((
        <Itinerary   options={startProperties.options}
                     config={startProperties.options}
                     settings={startProperties.options}
                     itineraryPlan={markersSetItinerary2}
                     headerOptions={startProperties.headerOptions}
                     updateStateVar={markTog}/>
    ));

    let e = startProperties.itineraryPlan.markers;
    simulateMarkerTogglePress(e, itinerary);

    expect(markTog.mock.calls.length).toEqual(1);
    expect(markTog.mock.calls[0][0]).toEqual("itineraryPlan");
    expect(markTog.mock.calls[0][1]).toEqual("markers");
    expect(markTog.mock.calls[0][2]).toEqual({do: false, th: false, te: false, wo: false});
}

test("Testing All Markers OFF toggle in itinerary", testAllMarkerToggleOff);

function testOptimizationsRender(){
    const itinerary = shallow((
        <Itinerary   options={startProperties.options}
                     config={startProperties.config}
                     settings={startProperties.options}
                     itineraryPlan={startProperties.itineraryPlan}
                     headerOptions={startProperties.headerOptions}
                     updateStateVar={startProperties.updateStateVar}/>
    ));

    expect(itinerary.contains(<Optimizations  optimizations={startProperties.config.optimizations}
                                              activeOpt={startProperties.options.optimization}
                                              updateStateVar={startProperties.updateStateVar}
                                              updateItineraryState={itinerary.instance().updateItineraryState}/>)).toEqual(true);
}

test("Testing optimization button group is rendering", testOptimizationsRender);
