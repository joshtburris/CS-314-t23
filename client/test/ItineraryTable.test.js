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