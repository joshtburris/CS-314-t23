import './enzyme.config.js'
import React from 'react'
import Search from '../src/components/Application/Itinerary/Search';
import { shallow, mount } from 'enzyme'
import { sendServerRequestWithBody } from '../src/api/restfulAPI';

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
        'narrow': [{'name': "type", 'values': ["none"]}]
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

function simulateOnChangeEvent(keyword, filter, reactWrapper) {
    reactWrapper.find('Input').at(0).simulate('change', keyword);
    reactWrapper.find('Input').at(1).simulate('change', filter);
    reactWrapper.find('Button').at(0).simulate('submit');
    reactWrapper.update();
}

function testAddValidFoundLocation(){
    const itineraryPlanMock = jest.fn();

    const search = mount((
        <Search     settings={startProperties.options}
                    itineraryPlan={startProperties.itineraryPlan}
                    updateStateVar={itineraryPlanMock}/>
    ));
    //console.log(search.state().narrow);
    //expect(search.state().narrow[0].name).toEqual('type');
    //expect(search.state().narrow[0].values).toEqual(['none']);
    //simulateOnChangeEvent("fort collins", ["airport", "heliport", "balloonport"], search);

    expect(itineraryPlanMock.mock.calls.length).toEqual(1);

}

test("Testing add button for valid found location", testAddValidFoundLocation());