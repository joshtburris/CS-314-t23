import './enzyme.config.js'
import Parsing from '../src/components/Application/Parsing'

function testParseCoordinateDMS(){
    expect(Parsing.parseCoordinate("39.87°N")).toBe(39.87);
    expect(Parsing.parseCoordinate("106.25°W")).toBe(106.25);
    // todo potentialy add S and E
    expect(Parsing.parseCoordinate("39.87°S")).toBe(-39.87);
    expect(Parsing.parseCoordinate("106.25°E")).toBe(-106.25);
}

function testParseCoordinateLL(){
    expect(Parsing.parseCoordinate("103.77")).toBe(103.77);
}


// todo will parse return Null or throw
function testInvalidCoordinate(){
    expect(Parsing.parseCoordinate("Mumble rap is good")).toBe(NaN);
}

/*TODO add case for out of bounds coordinate ex(777778.23)*/

function testParseCoordEmptyString(){
    expect(Parsing.parseCoordinate("")).toBeNull()
}

function testParseCoordinatePairValid(){
    //using space as separator
    expect(Parsing.parseCoordinates("145.23 145.99")).toEqual({latitude: 145.23, longitude: 145.99});
    //using ", " as separator
    expect(Parsing.parseCoordinates("145.23, 145.99")).toEqual({latitude: 145.23, longitude: 145.99});
}

test('ParseCoordinates throws on non-numeric', () => {
    expect(() => {
        Parsing.parseCoordinate("cat dog");
    }).toThrow();
});

test('ParseCoordinates throws on single number', () => {
    expect(() => {
        Parsing.parseCoordinate("21345");
    }).toThrow();
});

/*
test('ParseCoordinates throws on non-numeric', () => {
    expect(() => {
        Parsing.parseCoordinate("cat dog");
    }).toThrow();
});
*/
/*
*todo How to handle the following cases?
* " 1234.5 12435 "
 */


function testParseCoordPairOneInvalid(){

}

function testPlacesValid(){
    let placesIn = [{latitude: "1111", longitude: "1111"}, {latitude: "2222", longitude: "2222"}];
    let placesOut = Parsing.parseObject(placesIn);
    expect(placesOut).toEqual(placesIn);
}

function testPlacesInvalid(){
    let placesIn = [{latitude: "1111", longitude: "1111"}, {latitude: "2222", longitude: "yayeet"}];
    let placesOut = Parsing.parseObject(placesIn);
    expect(placesOut).toBeNull();
}