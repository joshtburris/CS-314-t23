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
        setStateVar={update}
        />
    );

    it.find('#editTable1').at(0).simulate('click');
    let expected = {
        places: [   {id: "do", name: "does", latitude: -12, longitude: -12},
                    {id: "te", name: "test", latitude: 4, longitude: 2},
                    {id: "wo", name: "work", latitude: 11, longitude: -2.5}],
        distances:[],
        markers: {do: false, te: false, wo: false}
    };

    expect(update.mock.calls.length).toBe(1);
    expect(update.mock.calls[0]).toEqual(["itineraryPlan", expected]);
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
            setStateVar={arrfunction}/>
    ));

    let instance = itinerary.instance();
    instance.rearrange(1, 1);

    let itin = {};
    Object.assign(itin, startProperties.itineraryPlan);
    itin.distances = [];
    itin.places = [   {id: "th", name: "this", latitude: -8.5, longitude: 4},
        {id: "do", name: "does", latitude: -12, longitude: -12},
        {id: "te", name: "test", latitude: 4, longitude: 2},
        {id: "wo", name: "work", latitude: 11, longitude: -2.5}];

    expect(arrfunction.mock.calls.length).toEqual(1);
    expect(arrfunction.mock.calls[0]).toEqual(["itineraryPlan", itin]);
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
            setStateVar={arrfunction}/>
    ));

    let instance = itinerary.instance();
    instance.moveTop(2);

    let expected = {};
    Object.assign(expected, startProperties.itineraryPlan);
    expected.distances = [];
    expected.places = [   {id: "te", name: "test", latitude: 4, longitude: 2},
        {id: "do", name: "does", latitude: -12, longitude: -12},
        {id: "th", name: "this", latitude: -8.5, longitude: 4},
        {id: "wo", name: "work", latitude: 11, longitude: -2.5}];

    expect(arrfunction.mock.calls.length).toEqual(1);
    expect(arrfunction.mock.calls[0]).toEqual(["itineraryPlan", expected]);
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
    instance.showMarkerPerLocation("th");
    expect(arrfunction.mock.calls.length).toEqual(1);
    expect(arrfunction.mock.calls[0][0]).toEqual("itineraryPlan");
    expect(arrfunction.mock.calls[0][1]).toEqual("markers");
    let toggleIndivMarker = {do: false, th: true, te: false, wo: false}
    expect(arrfunction.mock.calls[0][2]).toEqual(toggleIndivMarker);
}

test("Testing individual marker toggle", testIndividualMarker);

function testHeaderOptions() {
    let updatedItin = jest.fn();
    const itinerary = shallow((<ItineraryTable
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