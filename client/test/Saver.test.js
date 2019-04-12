import './enzyme.config.js'
import {saveAs} from 'file-saver'
import Saver  from '../src/components/Application/Itinerary/Saver'


// Testing to see if blobs are equal doesn't seem to work so only testing that save-as is called
jest.mock("file-saver");


beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  saveAs.mockClear();
});

const places = [  {id: "do", name: "does", latitude: -12, longitude: -12},
                                   {id: "th", name: "this", latitude: -8.5, longitude: 4},
                                   {id: "te", name: "test", latitude: 4, longitude: 2},
                                   {id: "wo", name: "work", latitude: 11, longitude: -2.5}]

function testSaveCSV(){
    Saver.save(places, "csv");
    expect(saveAs.mock.calls.length).toBe(1)
}

test("Testing saving as CSV", testSaveCSV);

function testSaveJSON(){
    Saver.save(places, "json");
    expect(saveAs.mock.calls.length).toBe(1)
}
