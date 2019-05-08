import './enzyme.config.js';
import React from 'react';
import {mount} from 'enzyme';
import ClassMap from '../src/components/Application/ClassMap';
import 'leaflet/dist/leaflet.css';

function getUserLocation() {return L.latLngBounds(L.latLng(12, 34), L.latLng(13, 35))};

const properties = {
    currentLocation: {
        lat: 40.576179,
        lon: -105.080773
    },
    itineraryPlan: {
        places:[],
        distances:[],
        markers:{}
    }
};

function testMap() {
    const map = mount((
        <ClassMap   currentLocation={properties.currentLocation}
                    getUserLocationBounds={getUserLocation}
                    places={properties.itineraryPlan.places}/>
    ));

    expect(map.props().currentLocation).toEqual(properties.currentLocation);
    expect(map.contains('#map'));
}
test('Testing the map exists when home is loaded', testMap);