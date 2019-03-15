// Note the name of this file has X.test.js. Jest looks for any files with this pattern.
import './enzyme.config.js'
import React from 'react'
import { shallow } from 'enzyme'
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

function testAddLocation(){
    let updatedItin = jest.fn();
    const itinerary = shallow((<Itinerary
        options={startProperties.options}
        itineraryPlan={startProperties.itineraryPlan}
        updateItineraryPlan={updatedItin}/>));

    let place = [];
    place.push({id: "id", name: "name", latitude: 50.0, longitude: 100.0});
    itinerary.instance().addLocation("id", "name", 50.0, 100.0);
    expect(updatedItin.mock.calls.length).toBe(1);
    expect(updatedItin.mock.calls[0][0]).toEqual("places");
    expect(updatedItin.mock.calls[0][1]).toEqual(place);

}

test("Testing addLocation function of itinerary", testAddLocation);

const startDetails = {
    'details' : {
        'Destination' : true,
        'Leg Distance' : true,
        'Total Distance' : true,
        'Latitude' : false,
        'Longitude' : false
    }
}

function testDetailOptions() {
    const itinerary = shallow((<Itinerary details={startDetails.details}
                                            options={startProperties.options}/>));
    itinerary.instance().toggleCheckbox('Destination', (!startDetails.details.Destination));
    expect(itinerary.state().details.Destination).toEqual(false);

    itinerary.instance().toggleCheckbox('Latitude', (!startDetails.details.Latitude));
    expect(itinerary.state().details.Latitude).toEqual(true);
}

test("Testing toggleCheckbox function of itinerary",testDetailOptions);