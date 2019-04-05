import coord from 'parse-coords';

export default class Parsing{

    //takes a places object with coordinates in any supported format and returns in LL format
    //return null object if any parse fails
    parseObject(places){
        console.log("inside parseObject");
        let placesCopy = [];
        for (let place in places){
                let lat = this.parseCoordinate(place.latitude);
                let lon = this.parseCoordinate(place.longitude);
                if (isNaN(lat) || isNaN(lon)){
                    throw "invalid coordinate found";
                }
                let temp = Object.assign({}, place);
                temp.latitude = lat; // does this work? does this modify the original object?
                temp.longitude = lon;
                placesCopy.append(temp);
        }
        return placesCopy;
    }

    parseCoordinatePair(coordinates){
        //separate
        let separatorIndex = coordinates.indexOf(",");
        let cord1 = "";
        let cord2 = "";
        let temp;
        if (separatorIndex === -1){ // separated only by space
            separatorIndex = coordinates.indexOf(" ");
            if( separatorIndex === -1){ throw "invalid coordinate formatting" }
            cord2 = coordinates.substring(separatorIndex+1,coordinates.length);
        }
        else{ cord2 = coordinates.substring(separatorIndex+2,coordinates.length); } // separated by ", "
        cord1 = coordinates.substring(0,separatorIndex);
        //parse each
        cord1 = this.parseCoordinate(cord1);
        cord2 = this.parseCoordinate(cord2);
        if(cord1 === undefined || cord2 === undefined){
            temp = coord(coordinates);
            if(temp !== undefined){
                cord1 = temp.lat;
                cord2 = temp.lng;
            }
        }
        if((cord1 > 90 || cord1 < -90) || (cord2 > 180 || cord2 < -180)){ throw "Coordinate out of bounds!" } // check lat lng bounds
        if(cord1 === undefined || cord2 === undefined){ throw "Invalid Input!" }
        return {latitude: cord1, longitude: cord2} //return object with latitude and longitude
    }

    //returns numeric LL coordinate on success NaN on failure
    parseCoordinate(input){
        //caleb will do this
        let regex = /^\s*([+-]?\d{1,3}\s+\d{1,2}'?\s+\d{1,2}"?[NSEW]?|\d{1,3}(:\d{2}){2}\.\d[NSEW]\s*){1,2}$|\d{1,3}(.\d{1,9})?/;
        let parts;
        let dd;
        if(regex.test(input)) {
            parts = input.split(/[^-?+?\d\w\.]+/);
            if (parts[parts.length - 1] === "S" || parts[parts.length - 1] === "W") { // testing for  SW
                for (let i = 0; i < parts.length-1; i++ ){ parts[i] = parts[i] * -1;}
            }
            else if (!(parts[parts.length - 1] === "N" || parts[parts.length - 1] === "E")) { // tesing for no NSEW
                if(parts[0] < 0){ for (let i = 1; i < parts.length; i++){ parts[i] = parts[i] * -1; } }
                parts.push("0");                    //push an empty last element
            }
            else if(Number(parts[0]) < 0){return NaN}
            dd = this.calculateDegrees(parts); // if has NE, jump straight to here
        }
        else{ dd = undefined; }
        return dd;
    }

    calculateDegrees(parts){
        let lengthOfParts = parts.length;
        let dd;
        switch (lengthOfParts){
            case 2: dd = Number(parts[0]); break;
            case 3: dd = Number(parts[0]) + Number(parts[1])/60; break;
            case 4: dd = Number(parts[0]) + Number(parts[1])/60 + Number(parts[2])/(60*60); break;
        }
        return dd;
    }

}