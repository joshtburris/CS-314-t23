// Note the name of this file has X.test.js. Jest looks for any files with this pattern.
import './enzyme.config.js'
import React from 'react'
import { shallow } from 'enzyme'
import ItineraryTable from '../src/components/Application/Itinerary/ItineraryTable'


const startProperties = {
    'itineraryPlan': {
        'places': [{id: "foco", name: "foco", latitude: 0, longitude: 0},
            {id: "bldr", name: "bldr", latitude: 1, longitude: 1}],
        'distances': [1]
    },
    'details': {
        'Name': true, 'Leg Distance': true, 'Total Distance': true,
        'Latitude': false, 'Longitude': false,
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
            {id: "wo", name: "work", latitude: 11, longitude: -2.5}],
        'distances':[14, 24, 6, 41],
        'boundaries':null
    }

};

function testRemoveLocationButton(){
   let update = jest.fn();
    const it = shallow(<ItineraryTable     places={startProperties.itineraryPlan.places}
                                           distances={startProperties.itineraryPlan.distances}
                                           details={startProperties.details}
                                           updateItineraryInfo={update}/>);

    it.find('#remove1').at(0).simulate('click');

    expect(update.mock.calls.length).toBe(1);
    expect(update.mock.calls[0][0]).toEqual("places");
    expect(update.mock.calls[0][1]).toEqual([{id: "foco", name: "foco", latitude: 0, longitude: 0}]);
}

test("Testing removeLocation function of itineraryTable", testRemoveLocationButton);

function testRearrange(){
    let arrfunction = jest.fn();
    const itinerary = shallow((
        <ItineraryTable   places={tableOne.itineraryPlan.places}
                          distances={tableOne.itineraryPlan.distances}
                          details={startProperties.details}
                          updateItineraryInfo={arrfunction}
        />
    ));

    let instance = itinerary.instance();
    instance.rearrange(1, 1);

    expect(arrfunction.mock.calls.length).toEqual(1);
    expect(arrfunction.mock.calls[0][0]).toEqual("places");

    let arrPlaces = [{id: "th", name: "this", latitude: -8.5, longitude: 4},
        {id: "do", name: "does", latitude: -12, longitude: -12},
        {id: "te", name: "test", latitude: 4, longitude: 2},
        {id: "wo", name: "work", latitude: 11, longitude: -2.5}];
    expect(arrfunction.mock.calls[0][1]).toEqual(arrPlaces);
}

test("Testing rearrange function of itineraryTable",testRearrange);
