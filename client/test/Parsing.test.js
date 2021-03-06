import './enzyme.config.js'
import Parsing from '../src/components/Application/Parsing'

function testParseCoordinateDMS() {
    expect(Parsing.parseCoordinate("39.87°N")).toBe(39.87);
    expect(Parsing.parseCoordinate("106.25°E")).toBe(106.25);
    expect(Parsing.parseCoordinate("106.25°W")).toBe(-106.25);
    expect(Parsing.parseCoordinate("39.87°S")).toBe(-39.87);
}
test("Testing for testParseCoordinateDMS", testParseCoordinateDMS);

function testParseCoordinateLL() {
    expect(Parsing.parseCoordinate("103.77")).toBe(103.77);
}
test("Testing for testParseCoordinateLL", testParseCoordinateLL);


// todo will parse return Null or throw - Done
function testInvalidCoordinate() {
    expect(Parsing.parseCoordinate("Mumble rap is good")).toBe(NaN);
}
test("Testing for testInvalidCoordinate", testInvalidCoordinate);

function testParseCoordEmptyString() {
    expect(Parsing.parseCoordinate("")).toBe(NaN)
}
test("Testing for testParseCoordEmptyString", testParseCoordEmptyString);

function testParseCoordinatePairValid() {
    //using space as separator
    expect(Parsing.parseCoordinatePair("89.23 145.99")).toEqual({latitude: 89.23, longitude: 145.99});
    expect(Parsing.parseCoordinatePair("89°23\' 145°99\'")).toEqual({latitude: 89.38333, longitude: 146.65,});
    expect(Parsing.parseCoordinatePair("89°23\'11\" 145°99\'11\"")).toEqual({latitude: 89.38639, longitude: 146.65306});
    //using ", " as separator
    expect(Parsing.parseCoordinatePair("89.23, 145.99")).toEqual({latitude: 89.23, longitude: 145.99});
    expect(Parsing.parseCoordinatePair("89°23\', 145°99\'")).toEqual({latitude: 89.38333, longitude: 146.65,});
    expect(Parsing.parseCoordinatePair("89°23\'11\", 145°99\'11\"")).toEqual({latitude: 89.38639, longitude: 146.65306});

}
test("Testing for testParseCoordinatePairValid DMS", testParseCoordinatePairValid);

test('ParseCoordinates throws on non-numeric', () => {
    expect(() => {
        Parsing.parseCoordinatePair("cat dog");
    }).toThrow();
});

test('ParseCoordinatesPair throws on single number', () => {
    expect(() => {
        Parsing.parseCoordinatePair("21345");
    }).toThrow();
});

/*test('ParseCoordinatesPair throws on non-alphanumeric characters', () => {
    expect(() => {
        Parsing.parseCoordinatePair("9=0 180");
    }).toThrow();
});*/

test('ParseCoordinates returns NaN on non-numeric', () => {
    expect(() => {
        Parsing.parseCoordinate("cat dog").toBe(NaN)
    });
});

/*TODO add case for out of bounds coordinate ex(777778.23)
*todo How to handle the following cases? - Done
* " 1234.5 12435 "
 */
function testParseCoordPairOneInvalid() {
    expect(() => {
        Parsing.parseCoordinatePair("1234.5 90");
    }).toThrow();
}
test("Testing for testParseCoordPairOneInvalid", testParseCoordPairOneInvalid);

function testPlacesValid() {
    let placesIn = [{latitude: "11", longitude: "11"}, {latitude: "22", longitude: "22"}];
    let placesOut = Parsing.parseObject(placesIn);
    expect(placesOut).toEqual([{latitude: "11", longitude: "11"}, {latitude: "22", longitude: "22"}]);
}
test("Testing for testPlacesValid", testPlacesValid);

function testPlacesInvalid() {
    let placesIn = [{latitude: "1111", longitude: "1111"}, {latitude: "2222", longitude: "yayeet"}];
    expect(() => {
        Parsing.parseObject(placesIn)
    }).toThrow();
}
test("Testing for testPlaceInvalid", testPlacesInvalid);

function testMatchExact() {
    expect(Parsing.matchExact(/[A-Za-z]+/, "abc")).toEqual(true);
    expect(Parsing.matchExact(/[A-Za-z]+/, "abc1")).toEqual(false);
    expect(Parsing.matchExact(/[A-Za-z]+/, "a1bc")).toEqual(false);
    expect(Parsing.matchExact(/[A-Za-z]+/, "1abc")).toEqual(false);
    expect(Parsing.matchExact(/[A-Za-z]+/, "abc def")).toEqual(false);
    expect(Parsing.matchExact(/[+-]?[0-9]+/, "123")).toEqual(true);
    expect(Parsing.matchExact(/[+-]?[0-9]+/, "-123")).toEqual(true);
    expect(Parsing.matchExact(/[+-]?[0-9]+/, "+123")).toEqual(true);
    expect(Parsing.matchExact(/[+-]?[0-9]+/, "+-123")).toEqual(false);
}
test("Testing that the exactMatch function returns correctly", testMatchExact);