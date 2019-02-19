// Note the name of this file has X.test.js. Jest looks for any files with this pattern.
import './enzyme.config.js'
import React from 'react'
import { mount } from 'enzyme'
import Itinerary from '../src/components/Application/Itinerary/Itinerary'


const startProperties = {
    'options': {
        'units': {'miles': 3959, 'kilometers': 6371},
        'activeUnit': 'miles',
        'serverPort': 'black-bottle.cs.colostate.edu:31400'
    }

};

