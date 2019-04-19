import React, { Component } from 'react';
import {Alert, Container, Row, Col, CustomInput, Button} from 'reactstrap';
import {Map, TileLayer, Polyline, Marker, Popup} from "react-leaflet";
import ItineraryTable from "./ItineraryTable";
import Ajv from 'ajv';
import { saveAs } from 'file-saver';
import {sendServerRequestWithBody} from "../../../api/restfulAPI";
import Pane from "../Pane";
import schema from './TIPItinerarySchema';
import Parsing from '../Parsing'
import Saver from './Saver'
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export default class Itinerary extends Component {
    constructor(props) {
        super(props);
        this.state={
            'options': {title: "null", earthRadius: this.props.options.units[this.props.options.activeUnit].toString(),
                optimizations: this.props.options.optimizations},
            errorMessage: null,
        };
        this.loadFile = this.loadFile.bind(this);
        this.addLocation = this.addLocation.bind(this);
        this.calculateDistances = this.calculateDistances.bind(this);
        this.setMarkers = this.setMarkers.bind(this);
        this.calculateDistances();
    }

    componentDidUpdate(prevProps) {
        //check if units have changed
        if ((prevProps.activeUnit !== this.props.aciveUnit)
            || (prevProps.optimizations !== this.props.optimizations)) {
            this.calculateDistances();
            return;
        }
        //check if places has changed
        let len = this.props.itineraryPlan.places.length,
            prevLen = prevProps.itineraryPlan.places.length;
        if (prevLen !== len) {
            this.calculateDistances();
            return;
        }
        for (let i = 0; i < prevLen && i < len; i++) {
            if (prevProps.itineraryPlan.places[i].name !== this.props.itineraryPlan.places[i].name) { //this assumes all places have a name
                this.calculateDistances();
                return;
            }
        }
        //nothing has changed
    }

    render() {
        return(
            <Container>
                { this.state.errorMessage }
                <Row> <Col xs={12} sm={12} md={7} lg={8} xl={8}>
                    {this.renderMap()}
                </Col> <Col xs={12} sm={12} md={5} lg={4} xl={4}>
                    {this.renderItinerary()}
                    {this.checkList()}
                </Col> </Row>
                <Row> <Col xl={12}>
                    <ItineraryTable     itineraryPlan={this.props.itineraryPlan}
                                        headerOptions={this.props.headerOptions}
                                        updateStateVar={this.props.updateStateVar}
                                        addLocation={this.addLocation}
                                        getNextPlaceID={this.props.getNextPlaceID}/>
                </Col> </Row>
            </Container>
        );
    }

    checkList() {
        return(
            <Pane header={'Header Options'}>
                {<Container>{this.getCheckbox()}</Container>}
            </Pane>
        );
    }

    getCheckbox() {
        let list =[];
        let i = 0;
        let labels = ['Name', 'Leg Distance', 'Total Distance', 'Latitude', 'Longitude'];
        for (let detail in this.props.headerOptions) {
            list.push(<CustomInput
                type="checkbox"
                id={detail+i}
                checked={this.props.headerOptions[detail]}
                label={labels[i]}
                onClick={() => {this.toggleCheckbox(detail, (!this.props.headerOptions[detail]))}}/>);
            i++;
        }
        list.push(<Button type="submit" value="Reverse" id="reverseButton" onClick={(e) => this.reverseItinerary(e)}>Reverse</Button>);
        list.push(<Button type="submit" value="ToggleAll" id="markerToggleAll" onClick={(e) => this.allMarkerToggle()}>Markers On/Off</Button>);
        return(list);
    }

    toggleCheckbox(option, value) {
        this.props.updateStateVar('headerOptions', option, value);
    }

    addLocation(name, latitude, longitude) {
        name = name.trim();
        if (this.checkLocationInput(name, latitude, longitude)) {
            console.log("Location added.");
            let newPlan = {};
            let nextID = this.props.getNextPlaceID();
            Object.assign(newPlan, this.props.itineraryPlan);
            newPlan["places"].push({id: nextID, name: name, latitude: latitude.toString(), longitude: longitude.toString()});
            newPlan["markers"][nextID] = false;
            this.props.setStateVar("itineraryPlan", newPlan);
        }
    }

    checkLocationInput(name, lat, lon) {
        if (    Parsing.matchExact(/[A-Za-z\\ ]+/, name)
            &&  Parsing.validateCoordinates(lat+" "+lon))
            return true;
        return false;
    }

    reverseItinerary() {
        let rPlaces = [];
        Object.assign(rPlaces, this.props.itineraryPlan.places);
        rPlaces.reverse();
        this.props.updateStateVar('itineraryPlan', 'places', rPlaces);
    }

    renderItinerary() {
        return(
            <Pane header={'Save/Upload Your Itinerary'}>
                <Container>
                    <Row>
                        <input type="file" name="" id="loadButton" onChange={this.loadFile} />
                        <form>
                            <input type="submit" value="Save File" id="saveButton" color="link" onClick={(e) => this.saveFile(e, "csv")} />
                        </form>
                    </Row>
                </Container>
            </Pane>
        );
    }

    renderMap() {
        return (
            <Pane header={'Itinerary'}>
                {this.renderLeafletMap()}
            </Pane>
        );
    }

    renderLeafletMap() {
        // initial map placement can use either of these approaches:
        // 1: bounds={this.coloradoGeographicBoundaries()}
        // 2: center={this.csuOvalGeographicCoordinates()} zoom={10}

        return (
            <Map bounds={this.getBounds()}
                 style={{height: 500, maxwidth: 700}}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                           attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <Polyline positions = {[this.getLL()]}/>
                {this.renderMarkers(this.props.itineraryPlan.places)}
            </Map>
        )
    }

    renderMarkers(placeList) {
        //Extract only true markers
        let markerList = [];
        for (let i=  0; i < placeList.length; i++) {
            if (this.props.itineraryPlan.markers[placeList[i].id]) {
                markerList.push(placeList[i]);
            }
        }

        //Array.map() creates a new array with the results of calling a provided function on every element in the calling array.
        return markerList.map((markerItem) =>
            <Marker
                position={L.latLng(markerItem.latitude, markerItem.longitude)}
                id={markerItem.id}
                title={markerItem.name}
                icon={L.icon({iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12,40]})}>
                <Popup className="font-weight-extrabold">
                    {this.getMarkerInfo(markerItem)}
                </Popup>
            </Marker>
        );
    }

    getBounds() {
        if (this.props.itineraryPlan.places.length == 0) {
            // northwest and southeast Itinerary-Map corners of the state of Colorado
            return L.latLngBounds(L.latLng(41, -109), L.latLng(37, -102));
        }
        if (this.props.itineraryPlan.places.length == 1) {
            return this.getSingleLoc();
        }
        let tLat = [];
        let tLon = [];
        for (let place in this.props.itineraryPlan.places) {
            tLat.push(this.props.itineraryPlan.places[place].latitude);
            tLon.push(this.props.itineraryPlan.places[place].longitude);
        }
        let maxLat = Math.max.apply(null, tLat); let maxLon = Math.max.apply(null, tLon);
        let minLat = Math.min.apply(null, tLat); let minLon = Math.min.apply(null, tLon);

        return L.latLngBounds(L.latLng(minLat, minLon), L.latLng(maxLat, maxLon));
    }

    getSingleLoc() {
        let locLat = parseFloat(this.props.itineraryPlan.places[0].latitude);
        let locLon = parseFloat(this.props.itineraryPlan.places[0].longitude);
        return L.latLngBounds(L.latLng(locLat-0.05, locLon-0.05), L.latLng(locLat+0.05, locLon+0.05));
    }

    getLL() {
        let LL = [];
        for (let i in this.props.itineraryPlan.places) {
            LL.push(L.latLng(parseFloat(this.props.itineraryPlan.places[i].latitude), parseFloat(this.props.itineraryPlan.places[i].longitude)))
        }
        if (this.props.itineraryPlan.places[0] != null) {
            LL.push(L.latLng(parseFloat(this.props.itineraryPlan.places[0].latitude), parseFloat(this.props.itineraryPlan.places[0].longitude)));
        }
        return LL
    }

    saveFile(event, fileType) {
        event.preventDefault();
        Saver.save(this.props.itineraryPlan.places, fileType);
    }

    loadFile(e) {
        let fileReader;
        const handleFileRead = (e) => {
            //read the text-format file to a string
            const content = fileReader.result;
            //parse the string into a JSON file
            try {
                this.loadFileContent(content);
            } catch (err) {
                this.setState({
                    errorMessage: <Alert className='bg-csu-canyon text-white font-weight-extrabold'>
                        Error(0): Invalid file found. Please select a valid itinerary file.</Alert>
                });
                this.props.updateStateVar('itineraryPlan', 'places', []);
                this.props.updateStateVar('itineraryPlan', 'distances', []);
            }
        };
        try {e.preventDefault();
            fileReader = new FileReader();
            fileReader.onloadend = handleFileRead;
            //read the first file in
            //NOTE: File must be formatted in double quotations (")
            fileReader.readAsText(event.target.files[0]);
        } catch (error){
            this.props.updateStateVar('itineraryPlan', 'places', []);
            this.props.updateStateVar('itineraryPlan', 'distances', []);
        }
    }

    loadFileContent(content) {
        let fileInfo = JSON.parse(content);
        let places = [];
        Object.assign(places, Parsing.parseObject(fileInfo.places));
        for (let i = 0; i < places.length; ++i)
            places[i].id = this.props.getNextPlaceID();
        this.props.updateStateVar('itineraryPlan', 'places', places);
        this.setMarkers();
        this.setState({errorMessage: ""});
    }

    calculateDistances() {
        const tipConfigRequest = {
            'requestType'        : 'itinerary',
            'requestVersion'     : 4,
            'options'            : this.state.options,
            'places'             : this.props.itineraryPlan.places,
        };

        sendServerRequestWithBody('itinerary', tipConfigRequest, this.props.settings.serverPort)
            .then((response) => {
                if(response.statusCode >= 200 && response.statusCode <= 299) {
                    //validate response
                    var ajv = new Ajv();
                    var valid = ajv.validate(schema, response.body);
                    if (!valid){
                        console.log(ajv.errors);
                        this.setState({
                            errorMessage: this.props.createErrorBanner(
                                "Invalid response from server"
                            )
                        });
                        return;
                    }
                    this.setState({
                        errorMessage: null
                    });
                    this.props.updateStateVar('itineraryPlan', 'places', response.body.places);
                    this.props.updateStateVar('itineraryPlan', 'distances', response.body.distances);
                }
                else {
                    this.setState({
                        errorMessage: this.props.createErrorBanner(
                            response.statusText,
                            response.statusCode,
                            `Request to ${ this.props.settings.serverPort } failed: invalid input.`
                        )
                    });
                }
            });
    }

    getMarkerInfo(markerItem) {
        let mInfo = "";
        for (let i in markerItem) {
            if (i !== 'id') {
                mInfo = mInfo + i.charAt(0).toUpperCase() + i.slice(1) + ": " + markerItem[i] + " ";
            }
        }
        return mInfo;
    }

    allMarkerToggle() {
        let markerList = {};
        if (Object.keys(this.props.itineraryPlan.markers).length === 0)
            markerList = this.setMarkers();
        else {
            Object.assign(markerList, this.props.itineraryPlan.markers);
            let temp = Object.values(markerList);
            let key;
            for (let i = 0; i < Object.keys(markerList).length; i++) {
                key = this.props.itineraryPlan.places[i].id;
                if (temp.indexOf(true) !== -1) markerList[key] = false;
                else markerList[key] = !markerList[key];
            }
        }
        this.props.updateStateVar('itineraryPlan', 'markers', markerList);
    }

    setMarkers() {
        let markerList = {};
        for (let i = 0; i < this.props.itineraryPlan.places.length; i++) {
            markerList[this.props.itineraryPlan.places[i].id] = false;
        }
        this.props.updateStateVar('itineraryPlan', 'markers', markerList);
        return markerList;
    }

}
