import coord from 'parse-coords';

export default class Parsing{

    //takes a places object with coordinates in any supported format and returns in LL format
    //return null object if any parse fails
    static parseObject(places) {
        let placesCopy = [];
        for (let i = 0; i < places.length; i++){
                let lat = this.parseCoordinate(places[i].latitude);
                let lon = this.parseCoordinate(places[i].longitude);
                if (isNaN(lat) || isNaN(lon)){
                    throw "invalid coordinate found";
                }
                let temp = Object.assign({}, places[i]);
                temp.latitude = lat.toString(); //converted to string for submission to TIPITinerary
                temp.longitude = lon.toString();
                placesCopy.push(temp);
        }
        return placesCopy;
    }

    static parseCoordinatePair(coordinates) {
        //separate
        let separatorIndex = coordinates.indexOf(",");
        let cord1 = "";
        let cord2 = "";
        let temp;
        if (separatorIndex === -1) { // separated only by space
            separatorIndex = coordinates.indexOf(" ");
            if( separatorIndex === -1){ throw "invalid coordinate formatting" }
            cord2 = coordinates.substring(separatorIndex+1,coordinates.length);
        }
        else { cord2 = coordinates.substring(separatorIndex+2,coordinates.length); } // separated by ", "
        cord1 = coordinates.substring(0,separatorIndex);
        //parse each
        cord1 = this.parseCoordinate(cord1);
        cord2 = this.parseCoordinate(cord2);
        if (isNaN(cord1) || isNaN(cord2)) {
            temp = coord(coordinates);
            if (temp !== undefined) {
                cord1 = temp.lat;
                cord2 = temp.lng;
            }
        }
        if (isNaN(cord1) || isNaN(cord2)) { throw "Invalid Input!" }
        if (cord1 > 90 || cord1 < -90 || cord2 > 180 || cord2 < -180) { throw "Coordinate out of bounds!" } // check lat lng bounds
        return {latitude: cord1, longitude: cord2} //return object with latitude and longitude
    }

    //returns numeric LL coordinate on success NaN on failure
    static parseCoordinate(input) {
        //caleb will do this
        let regex = /^\s*([+-]?\d{1,3}\s+\d{1,2}'?\s+\d{1,2}"?[NSEW]?|\d{1,3}(:\d{2}){2}\.\d[NSEW]\s*){1,2}$|\d{1,3}(.\d{1,9})?/;
        let parts;
        let dd = NaN;
        if(regex.test(input)) {
            parts = input.split(/[^-?+?\d\w\.]+/);
            if (parts[parts.length - 1] === "S" || parts[parts.length - 1] === "W") { // testing for  SW
                for (let i = 0; i < parts.length-1; i++ ){ parts[i] = parts[i] * -1;}
            }
            else if (!(parts[parts.length - 1] === "N" || parts[parts.length - 1] === "E")) { // tesing for no NSEW
                if(parts[0] < 0){ for (let i = 1; i < parts.length; i++){ parts[i] = parts[i] * -1; } }
                if(parts.length < 4) {
                    if(parts[parts.length-1] === "") { parts[parts.length-1] = "0"; }
                    else { parts.push("0"); }                            //push an empty last element
                }
            }
            else if(Number(parts[0]) < 0){return NaN}
            dd = this.calculateDegrees(parts); // if has NE, jump straight to here
            dd = Math.round(dd * 100000) / 100000;
        }
        return dd;
    }

    static calculateDegrees(parts) {
        let lengthOfParts = parts.length;
        let dd;
        switch (lengthOfParts){
            case 2: dd = Number(parts[0]); break;
            case 3: dd = Number(parts[0]) + Number(parts[1])/60; break;
            case 4: dd = Number(parts[0]) + Number(parts[1])/60 + Number(parts[2])/(60*60); break;
        }
        return dd;
    }

    static validateCoordinates(coordinates) {
        try {
            let temp = Parsing.parseCoordinatePair(coordinates);
            return (temp !== null && !isNaN(temp.latitude) && !isNaN(temp.longitude));
        } catch (e) {
            return false;
        }
    }

    static validateLatitude(lat) {
        return this.validateCoordinates(lat + " 0.0");
    }

    static validateLongitude(lon) {
        return this.validateCoordinates("0.0 " + lon);
    }

    static matchExact(regex, str) {            // Source: "https://stackoverflow.com/questions/447250/matching-exact-string-with-javascript"
        if (typeof str !== "string") str = str.toString();
        let match = str.match(regex);
        return(match && str === match[0]);
    }

}