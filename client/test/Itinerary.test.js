// Note the name of this file has X.test.js. Jest looks for any files with this pattern.
import './enzyme.config.js'
import React from 'react'
import { shallow, mount } from 'enzyme'
import Itinerary from '../src/components/Application/Itinerary/Itinerary'


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
    }

};

const emptyItinerary = {
    'places':[],
    'distances':[],
    'markers':{},
    'boundaries':null
};

function testAddLocation() {
    let updatedItin = jest.fn();
    const itinerary = shallow((<Itinerary
        options={startProperties.options}
        settings={startProperties.options}
        itineraryPlan={emptyItinerary}
        headerOptions={startProperties.headerOptions}
        updateStateVar={updatedItin}/>
    ));

    let place = [];
    place.push({id: "id", name: "name", latitude: 50.0, longitude: 100.0});
    itinerary.instance().addLocation("id", "name", 50.0, 100.0);
    expect(updatedItin.mock.calls.length).toBe(1);
    expect(updatedItin.mock.calls[0][0]).toEqual("itineraryPlan");
    expect(updatedItin.mock.calls[0][1]).toEqual("places");
    expect(updatedItin.mock.calls[0][2]).toEqual(place);

}

test("Testing addLocation function of itinerary", testAddLocation);

function testHeaderOptions() {
    let updatedItin = jest.fn();
    const itinerary = shallow((<Itinerary
        options={startProperties.options}
        settings={startProperties.options}
        itineraryPlan={startProperties.itineraryPlan}
        headerOptions={startProperties.headerOptions}
        updateStateVar={updatedItin}/>
    ));

    itinerary.instance().toggleCheckbox('name', (!startProperties.headerOptions.name));
    expect(updatedItin.mock.calls.length).toEqual(1);
    expect(updatedItin.mock.calls[0][0]).toEqual('headerOptions');
    expect(updatedItin.mock.calls[0][1]).toEqual('name');
    expect(updatedItin.mock.calls[0][2]).toEqual(false);

    itinerary.instance().toggleCheckbox('lat', (!startProperties.headerOptions.lat));
    expect(updatedItin.mock.calls.length).toEqual(2);
    expect(updatedItin.mock.calls[1][0]).toEqual('headerOptions');
    expect(updatedItin.mock.calls[1][1]).toEqual('lat');
    expect(updatedItin.mock.calls[1][2]).toEqual(true);
}

test("Testing toggleCheckbox function of itinerary", testHeaderOptions);

function testSaveButton() {
    const itinerary = shallow((
        <Itinerary   options={startProperties.options}
                     settings={startProperties.options}
                     itineraryPlan={startProperties.itineraryPlan}
                     headerOptions={startProperties.headerOptions}
                     updateStateVar={jest.fn()}
        />
    ));

    // testing that it exists (According to TA testing functionality is too complicated, this is fine)
    expect(itinerary.find('#saveButton').length).toEqual(1);
}

test("Testing save button in itinerary", testSaveButton);

function testUploadButton() {
    const itinerary = shallow((
        <Itinerary   options={startProperties.options}
                     settings={startProperties.options}
                     itineraryPlan={startProperties.itineraryPlan}
                     headerOptions={startProperties.headerOptions}
                     updateItineraryPlan={jest.fn()}/>
    ));

    // testing that it exists (According to TA testing functionality is too complicated, this is fine)
    expect(itinerary.contains('#loadButton'));
}

test("Testing upload button in itinerary", testUploadButton);

function testReverseButton(){
    let revfunction = jest.fn();
    const itinerary = shallow((
        <Itinerary   options={startProperties.options}
                     settings={startProperties.options}
                     itineraryPlan={startProperties.itineraryPlan}
                     headerOptions={startProperties.headerOptions}
                     updateStateVar={revfunction}/>
    ));

    let e = startProperties.itineraryPlan.places;
    simulateReverseButtonPress(e, itinerary);

    expect(revfunction.mock.calls.length).toEqual(1);
    expect(revfunction.mock.calls[0][0]).toEqual("itineraryPlan");
    expect(revfunction.mock.calls[0][1]).toEqual("places");

    let revPlaces = [];
    Object.assign(revPlaces, startProperties.itineraryPlan.places);
    revPlaces.reverse();
    expect(revfunction.mock.calls[0][2]).toEqual(revPlaces);
}

function simulateReverseButtonPress(e, reactWrapper) {
    reactWrapper.find('#reverseButton').at(0).simulate('click');
    reactWrapper.update();
}

test("Testing reverse button", testReverseButton);

function testMarkerToggle(){
    let markTog = jest.fn();
    const itinerary = shallow((
        <Itinerary   options={startProperties.options}
                     settings={startProperties.options}
                     itineraryPlan={startProperties.itineraryPlan}
                     headerOptions={startProperties.headerOptions}
                     updateStateVar={markTog}/>
    ));

    let e = startProperties.itineraryPlan.markers;
    simulateMarkerTogglePress(e, itinerary);

    expect(markTog.mock.calls.length).toEqual(1);
    expect(markTog.mock.calls[0][0]).toEqual("itineraryPlan");
    expect(markTog.mock.calls[0][1]).toEqual("markers");

    let markerSet = {do: true, th: true, te: true, wo: true}
    expect(markTog.mock.calls[0][2]).toEqual(markerSet);
}

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
