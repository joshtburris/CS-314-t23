import './enzyme.config.js'
import React from 'react'
import Search from '../src/components/Application/Itinerary/Search';
import { shallow, mount } from 'enzyme'
import { sendServerRequestWithBody } from '../src/api/restfulAPI';
import {Button, Input} from 'reactstrap';

const startProperties = {
    'options': {
        'serverPort': 'black-bottle.cs.colostate.edu:31400'
    },
    'itineraryPlan': {
        'places':[],
        'placesFound': [],
        'distances':[],
        'markers':{},
        'match': '',
        'limit': 0,
        'narrow': [{'name': "type", 'values': []}]
    }
};

jest.mock('../src/api/restfulAPI');
afterEach(() => {
    sendServerRequestWithBody.mockClear();
});

function testServerCalledTrue() {
    sendServerRequestWithBody.mockResolvedValue({statuscode: 200, distance: [1,1]});

    const search = mount((
        <Search     settings={startProperties.options}
                    itineraryPlan={startProperties.itineraryPlan}/>
    ));

    search.instance().tipFindLocation("fort collins", 0, ["airport", "heliport", "balloonport"]);
    expect(sendServerRequestWithBody.mock.calls.length).toBe(1);
}

test("Testing that server is called when valid input are passed in to find", testServerCalledTrue);

function testServerCalledFalse() {
    sendServerRequestWithBody.mockResolvedValue({statuscode: 200, distance: [1,1]});

    const search = mount((
        <Search     settings={startProperties.options}
                    itineraryPlan={startProperties.itineraryPlan}/>
    ));

    search.instance().tipFindLocation("", 0, []);
    expect(sendServerRequestWithBody.mock.calls.length).toBe(0);
}

test("Testing that server is not called when invalid input are passed in to find", testServerCalledFalse);

function testAddValidFoundLocation(){
    const itineraryPlanMock = jest.fn();
    const search = mount((
        <Search   settings={startProperties.options}
                  itineraryPlan={startProperties.itineraryPlan}
                  updateStateVar={itineraryPlanMock}/>
    ));
    //console.log(search.state().narrow);
    expect(search.state().narrow[0].name).toEqual('type');
    expect(search.state().narrow[0].values).toEqual([]);
    expect(search.state().narrow[1].name).toEqual('iso_country');
    expect(search.state().narrow[1].values).toEqual([]);
    simulateOnChangeEvent('fort collins', search);

    expect(itineraryPlanMock.mock.calls.length).toEqual(2);
    expect(search.state().narrow[0].values).toEqual(['airport']);
    expect(itineraryPlanMock.mock.calls[1][2][0].values).toEqual(['airport']);
    expect(itineraryPlanMock.mock.calls[0][2]).toEqual('fort collins');

}

function simulateOnChangeEvent(keyword, reactWrapper) {
    let event = {target: {value: `${keyword}`}};
    reactWrapper.find('Input').at(0).simulate('change', event);
    reactWrapper.find('DropdownItem').at(0).simulate('click');
    reactWrapper.find('Button').at(0).simulate('submit');
    reactWrapper.update();
}

test("Testing add button for valid found location", (() => testAddValidFoundLocation()));

function testUpdateFindPlaces(){
    const itineraryPlanMock = jest.fn();
    const search = mount((
        <Search   settings={startProperties.options}
                  itineraryPlan={startProperties.itineraryPlan}
                  updateStateVar={itineraryPlanMock}/>
    ));

    search.instance().updateFindPlaces('narrow', []);
    expect(itineraryPlanMock.mock.calls.length).toEqual(1);
}

test("Testing updateFindPlaces", testUpdateFindPlaces);

const itineraryProperties = {
    'itineraryPlan': {
        'places':[],
        'placesFound':
            [
                {id: "CO55", latitude: "40.597198486328125", longitude: "-105.14399719238281", municipality: "Fort Collins", name: "Christman Field", type: "small_airport"},
                {id: "KFNL", latitude: "40.4518013", longitude: "-105.011001587", municipality: "Fort Collins/Loveland", name: "Fort Collins Loveland Municipal Airport", type: "small_airport"},
                {id: "6CO4", latitude: "40.51029968261719", longitude: "-105.0009994506836", municipality: "Fort Collins", name: "Hat-Field STOLport", type: "small_airport"},
                {id: "65CO", latitude: "40.52080154418945", longitude: "-104.96700286865234", municipality: "Fort Collins", name: "Wkr Airport", type: "small_airport"},
                {id: "CO53", latitude: "40.634700775146484", longitude: "-104.99099731445312", municipality: "Fort Collins", name: "Yankee Field", type: "small_airport"}
            ],
        'distances':[],
        'markers':{},
        'match': '',
        'limit': 0,
        'narrow': [{'name': "type", 'values': []}]
    }
};

function testTipFindTable() {
    const itineraryPlanMock = jest.fn();
    const search = mount((
        <Search   settings={startProperties.options}
                  itineraryPlan={startProperties.itineraryPlan}
                  updateStateVar={itineraryPlanMock}/>
    ));
    let tempProps = search.props().itineraryPlan.placesFound;
    tempProps.push(
        {id: "CO55", latitude: "40.597198486328125", longitude: "-105.14399719238281", municipality: "Fort Collins", name: "Christman Field", type: "small_airport"},
        {id: "KFNL", latitude: "40.4518013", longitude: "-105.011001587", municipality: "Fort Collins/Loveland", name: "Fort Collins Loveland Municipal Airport", type: "small_airport"},
        {id: "6CO4", latitude: "40.51029968261719", longitude: "-105.0009994506836", municipality: "Fort Collins", name: "Hat-Field STOLport", type: "small_airport"},
        {id: "65CO", latitude: "40.52080154418945", longitude: "-104.96700286865234", municipality: "Fort Collins", name: "Wkr Airport", type: "small_airport"},
        {id: "CO53", latitude: "40.634700775146484", longitude: "-104.99099731445312", municipality: "Fort Collins", name: "Yankee Field", type: "small_airport"}
    );
    search.instance().TipFindTable();

    expect(search.props().itineraryPlan.placesFound).toEqual(itineraryProperties.itineraryPlan.placesFound);
}

test("Testing TipFindTable function", testTipFindTable);

function testDropDownButton(){
    const itineraryPlanMock = jest.fn();
    const search = mount((
        <Search   settings={startProperties.options}
                  itineraryPlan={startProperties.itineraryPlan}
                  updateStateVar={itineraryPlanMock}/>
    ));
    expect(search.state().narrow[0].values).toEqual([]);
    search.find('DropdownItem').at(0).simulate('click');
    search.find('DropdownItem').at(1).simulate('click');
    search.find('DropdownItem').at(2).simulate('click');
    search.find('DropdownItem').at(3).simulate('click');
    expect(search.state().narrow[0].values).toEqual(['airport', 'heliport', 'balloonport', 'closed']);
    search.find('DropdownItem').at(0).simulate('click');
    search.find('DropdownItem').at(1).simulate('click');
    search.find('DropdownItem').at(2).simulate('click');
    search.find('DropdownItem').at(3).simulate('click');
    expect(search.state().narrow[0].values).toEqual([]);
}

test("Testing dropDownButton function", testDropDownButton);

function testDropDownButtonCountry(){
    const itineraryPlanMock = jest.fn();
    const search = mount((
        <Search   settings={startProperties.options}
                  itineraryPlan={startProperties.itineraryPlan}
                  updateStateVar={itineraryPlanMock}/>
    ));
    expect(search.state().narrow[1].values).toEqual([]);
    search.find('DropdownItem').at(4).simulate('click');
    search.find('DropdownItem').at(5).simulate('click');
    search.find('DropdownItem').at(6).simulate('click');
    expect(search.state().narrow[1].values[0]).toEqual('AD');
    expect(search.state().narrow[1].values[1]).toEqual('AE');
    expect(search.state().narrow[1].values[2]).toEqual('AF');
    search.find('DropdownItem').at(4).simulate('click');
    search.find('DropdownItem').at(5).simulate('click');
    search.find('DropdownItem').at(6).simulate('click');
    expect(search.state().narrow[1].values).toEqual([]);
}

test("Testing dropDownButton function for Countries", testDropDownButtonCountry);

const properties = {
    'options': {
        'serverPort': 'black-bottle.cs.colostate.edu:31400'
    },
    'itineraryPlan': {
        'places':[],
        'placesFound': [],
        'distances':[],
        'markers':{},
        'match': '',
        'limit': 0,
        'narrow': [{'name': "type", 'values': []}]
    },
    'attributes': ["latitude", "longitude", "name", "id", "municipality", "altitude", "type"]
};

function testGetAttributes() {
    const itineraryPlanMock = jest.fn();
    const search = mount((
        <Search   settings={properties.options}
                  itineraryPlan={properties.itineraryPlan}
                  placeAttributes={properties.attributes}
                  updateStateVar={itineraryPlanMock}/>
    ));
    console.log(search.props().placeAttributes);
    const attr = search.instance().getAttributes();
    expect(attr).toEqual(["name", "latitude", "longitude", "municipality", "altitude", "type"]);

}

test("Testing function getAttributes", testGetAttributes);

function testCreateInputField(){
    const itineraryPlanMock = jest.fn();
    const search = mount((
        <Search   settings={properties.options}
                  itineraryPlan={properties.itineraryPlan}
                  placeAttributes={properties.attributes}
                  updateStateVar={itineraryPlanMock}/>
    ));

    let numberOfInputs = search.find('Input').length;
    expect(numberOfInputs).toEqual(1);
    let actualInputs = [];
    search.find('Input').map((input) => actualInputs.push(input.prop('placeholder')));

    expect(actualInputs).toEqual(['Search...']);
}

test("Testing createInputField", testCreateInputField);