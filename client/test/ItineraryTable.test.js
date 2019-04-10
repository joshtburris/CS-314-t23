// Note the name of this file has X.test.js. Jest looks for any files with this pattern.
import './enzyme.config.js'
import React from 'react'
import { shallow } from 'enzyme'
import ItineraryTable from '../src/components/Application/Itinerary/ItineraryTable'

const startProperties = {
    'options': {
        'units': {'miles': 3959, 'kilometers': 6371},
        'activeUnit': 'miles',
        'serverPort': 'black-bottle.cs.colostate.edu:31400'
    },
    'itineraryPlan': {
        'places':[  {id: "do", name: "does", latitude: -12, longitude: -12},
                    {id: "th", name: "this", latitude: -8.5, longitude: 4},
                    {id: "te", name: "test", latitude: 4, longitude: 2},
                    {id: "wo", name: "work", latitude: 11, longitude: -2.5}],
        'distances':[14, 24, 6, 41],
        'markers': {do: false, th: false, te: false, wo: false}
    },
    'headerOptions' : {
        'name' : true,
        'legDistance' : true,
        'totalDistance' : true,
        'lat' : false,
        'lon' : false
    }
};

function testRemoveLocationButton() {
   let update = jest.fn();
    const it = shallow(<ItineraryTable
        options={startProperties.options}
        settings={startProperties.settings}
        headerOptions={startProperties.headerOptions}
        itineraryPlan={startProperties.itineraryPlan}
        updateStateVar={update}/>
    );

    it.find('#editTable1').at(0).simulate('click');
    let expected = [    {id: "do", name: "does", latitude: -12, longitude: -12},
                        {id: "te", name: "test", latitude: 4, longitude: 2},
                        {id: "wo", name: "work", latitude: 11, longitude: -2.5}];

    expect(update.mock.calls.length).toBe(1);
    expect(update.mock.calls[0][0]).toEqual("itineraryPlan");
    expect(update.mock.calls[0][1]).toEqual("places");
    expect(update.mock.calls[0][2]).toEqual(expected);
}

test("Testing removeLocation function of itineraryTable", testRemoveLocationButton);

function testRearrange() {
    let arrfunction = jest.fn();
    const itinerary = shallow((
        <ItineraryTable
            options={startProperties.options}
            settings={startProperties.settings}
            headerOptions={startProperties.headerOptions}
            itineraryPlan={startProperties.itineraryPlan}
            updateStateVar={arrfunction}/>
    ));

    let instance = itinerary.instance();
    instance.rearrange(1, 1);

    expect(arrfunction.mock.calls.length).toEqual(1);
    expect(arrfunction.mock.calls[0][0]).toEqual("itineraryPlan");
    expect(arrfunction.mock.calls[0][1]).toEqual("places");

    let arrPlaces = [   {id: "th", name: "this", latitude: -8.5, longitude: 4},
                        {id: "do", name: "does", latitude: -12, longitude: -12},
                        {id: "te", name: "test", latitude: 4, longitude: 2},
                        {id: "wo", name: "work", latitude: 11, longitude: -2.5}];
    expect(arrfunction.mock.calls[0][2]).toEqual(arrPlaces);
}

test("Testing rearrange function of itineraryTable", testRearrange);

function testNewStart() {
    let arrfunction = jest.fn();
    const itinerary = shallow((
        <ItineraryTable
            options={startProperties.options}
            settings={startProperties.settings}
            headerOptions={startProperties.headerOptions}
            itineraryPlan={startProperties.itineraryPlan}
            updateStateVar={arrfunction}/>
    ));

    let instance = itinerary.instance();
    instance.moveTop(2);

    expect(arrfunction.mock.calls.length).toEqual(1);
    expect(arrfunction.mock.calls[0][0]).toEqual("itineraryPlan");
    expect(arrfunction.mock.calls[0][1]).toEqual("places");

    let moveTopPlaces = [   {id: "te", name: "test", latitude: 4, longitude: 2},
                        {id: "do", name: "does", latitude: -12, longitude: -12},
                        {id: "th", name: "this", latitude: -8.5, longitude: 4},
                        {id: "wo", name: "work", latitude: 11, longitude: -2.5}];
    expect(arrfunction.mock.calls[0][2]).toEqual(moveTopPlaces);
}

test("Testing moveTop function of itineraryTable", testNewStart);

function testIndividualMarker(){
    let arrfunction = jest.fn();
    const itinerary = shallow((
        <ItineraryTable
            options={startProperties.options}
            settings={startProperties.settings}
            headerOptions={startProperties.headerOptions}
            itineraryPlan={startProperties.itineraryPlan}
            updateStateVar={arrfunction}/>
    ));

    let instance = itinerary.instance();
    instance.showMarkerPerLocation(1);
    expect(arrfunction.mock.calls.length).toEqual(1);
    expect(arrfunction.mock.calls[0][0]).toEqual("itineraryPlan");
    expect(arrfunction.mock.calls[0][1]).toEqual("markers");
    let toggleIndivMarker = {do: false, th: true, te: false, wo: false}
    expect(arrfunction.mock.calls[0][2]).toEqual(toggleIndivMarker);
}

test("Testing individual marker toggle", testIndividualMarker);