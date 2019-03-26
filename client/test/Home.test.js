import './enzyme.config.js';
import React from 'react';
import {mount, shallow} from 'enzyme';
import Home from '../src/components/Application/Home';
import 'leaflet/dist/leaflet.css';

function getUserLocation() {return L.latLng(1234, 2345)};

const properties = {
    currentLocation: {
        lat: 40.576179,
        lon: -105.080773
    }
};

function testMap() {
    const home = mount((
        <Home
            currentLocation={properties.currentLocation}
            getUserLocation={getUserLocation}/>
    ));

    expect(home.props().currentLocation).toEqual(properties.currentLocation);
    expect(home.contains('#map'));
}
test('Testing the map exists when home is loaded', testMap);