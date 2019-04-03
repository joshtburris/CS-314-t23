export default class Parsing{

    //takes a places object with coordinates in any supported format and returns in LL format
    //return null object if any parse fails
    public parseObject(places){
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

    public parseCoordinatePair(coordinates){
        //separate
        let separatorIndex = coordinates.indexOf(", ");
        let cord1 = "";
        let cord2 = "";
        if (separatorIndex === -1){ // separated only by space
            separatorIndex = coordinates.indexOf(" ");
            if( separatorIndex === -1){
                throw "invalid coordinate formatting"
            }
            cord2 = coordinates.substring(separatorIndex+1,coordinates.length);
        }
        else{// separated by ", "
            cord2 = coordinates.substring(separatorIndex+2,coordinates.length);
        }
        cord1 = coordinates.substring(0,separatorIndex);

        //parse each
        cord1 = this.parseCoordinate(cord1);
        cord2 = this.parseCoordinate(cord2);
        //return object with latitude and longitude
        return {latitude: cord1, longitude: cord2}
    }

    //returns numeric LL coordinate on success NaN on failure
    public parseCoordinate(){
        //caleb will do this
    }
}