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
    }

};

function testAddLocation(){
    const itinerary = shallow((<Itinerary options={startProperties.options}/>));
    itinerary.instance().addLocation("id", "name", 50.0, 100.0);
    expect(itinerary.state().places[0].id).toEqual("id");
}

test("Testing addLocation function of itinerary",testAddLocation)
