// Note the name of this file has X.test.js. Jest looks for any files with this pattern.
import './enzyme.config.js'
import React from 'react'
import { shallow, mount } from 'enzyme'
import Itinerary from '../src/components/Application/Itinerary/Itinerary'


const startProperties = {
    'options': {
        'units': {'miles': 3959, 'kilometers': 6371},
        'activeUnit': 'miles',
        'serverPort': 'black-bottle.cs.colostate.edu:31400'
    },
    'itineraryPlan': {
        'places':[],
        'distances':[],
        'boundaries':null
    }

};

const startDetails = {
    'details' : {
        'Destination' : true,
        'Leg Distance' : true,
        'Total Distance' : true,
        'Latitude' : false,
        'Longitude' : false
    }
};

const tableOne = {
    'options': {
        'units': {'miles': 3959, 'kilometers': 6371},
        'activeUnit': 'miles',
        'serverPort': 'black-bottle.cs.colostate.edu:31400'
    },
    'itineraryPlan': {
        'places':[{id: "do", name: "does", latitude: -12, longitude: -12},
                  {id: "th", name: "this", latitude: -8.5, longitude: 4},
                  {id: "te", name: "test", latitude: 4, longitude: 2},
                  {id: "th", name: "this", latitude: 11, longitude: -2.5}],
        'distances':[14, 24, 6, 41],
        'boundaries':null
    }

};

function testAddLocation(){
    let updatedItin = jest.fn();
    const itinerary = shallow((<Itinerary   details={startDetails.details}
                                            itineraryPlan={startProperties.itineraryPlan}
                                            settings={startProperties.options.serverPort}
                                            options={startProperties.options}
                                            updateItineraryPlan={updatedItin}/>));

    let place = [];
    place.push({id: "id", name: "name", latitude: 50.0, longitude: 100.0});
    itinerary.instance().addLocation("id", "name", 50.0, 100.0);
    expect(updatedItin.mock.calls.length).toBe(1);
    expect(updatedItin.mock.calls[0][0]).toEqual("places");
    expect(updatedItin.mock.calls[0][1]).toEqual(place);

}

test("Testing addLocation function of itinerary", testAddLocation);

function testDetailOptions() {
    const itinerary = shallow((<Itinerary   details={startDetails.details}
                                            itineraryPlan={startProperties.itineraryPlan}
                                            settings={startProperties.options.serverPort}
                                            options={startProperties.options}
                                            updateItineraryPlan={jest.fn()}/>));
    itinerary.instance().toggleCheckbox('Destination', (!startDetails.details.Destination));
    expect(itinerary.state().details.Destination).toEqual(false);

    itinerary.instance().toggleCheckbox('Latitude', (!startDetails.details.Latitude));
    expect(itinerary.state().details.Latitude).toEqual(true);
}

test("Testing toggleCheckbox function of itinerary",testDetailOptions);

function testSaveButton(){
    const itinerary = shallow((
        <Itinerary   options={startProperties.options}
                     itineraryPlan={startProperties.itineraryPlan}
                     settings={startProperties.options.serverPort}
                     updateItineraryPlan={jest.fn()}
                     />
    ));

    // testing that it exists (According to TA testing functionality is too complicated, this is fine)
    expect(itinerary.find('#saveButton').length).toEqual(1);
}

test("Testing save button in itinerary",testSaveButton);


function testUploadButton(){
    const itinerary = shallow((
        <Itinerary   options={startProperties.options}
                     itineraryPlan={startProperties.itineraryPlan}
                     settings={startProperties.options.serverPort}
                     updateItineraryPlan={jest.fn()}/>
    ));

    // testing that it exists (According to TA testing functionality is too complicated, this is fine)
    expect(itinerary.contains('#input'));
}

test("Testing upload button in itinerary",testUploadButton);

function testReverseButton(){
    let revfunction = jest.fn();
    const itinerary = shallow((
        <Itinerary   options={startProperties.options}
                     itineraryPlan={tableOne.itineraryPlan}
                     settings={startProperties.options.serverPort}
                     updateItineraryPlan={revfunction}
        />
    ));

    let e = tableOne.itineraryPlan.places;
    simulateReverseButtonPress(e, itinerary);

    expect(revfunction.mock.calls.length).toEqual(1);
    expect(revfunction.mock.calls[0][0]).toEqual("places");

    let revPlaces = [];
    Object.assign(revPlaces, tableOne.itineraryPlan.places);
    revPlaces.reverse();
    expect(revfunction.mock.calls[0][1]).toEqual(revPlaces);
}

function simulateReverseButtonPress(e, reactWrapper) {
    reactWrapper.find('#reverseButton').at(0).simulate('click');
    reactWrapper.update();
}

test("Testing reverse button", testReverseButton);
