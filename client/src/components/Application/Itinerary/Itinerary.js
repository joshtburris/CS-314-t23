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
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export default class Itinerary extends Component {
    constructor(props) {
        super(props);
        this.state={
            'options': {title: "null", earthRadius: this.props.options.units[this.props.options.activeUnit].toString(), optimizations: this.props.options.optimizations},
            errorMessage: null,
        };
        this.loadFile = this.loadFile.bind(this);
        this.addLocation = this.addLocation.bind(this);
        this.calculateDistances = this.calculateDistances.bind(this);
        this.calculateDistances();
    }

    componentDidUpdate(prevProps) {
        //check if units have changed
        if((prevProps.activeUnit !== this.props.aciveUnit) || (prevProps.optimizations !== this.props.optimizations)){
            this.calculateDistances();
            return;
        }
        //check if places has changed
        if(prevProps.itineraryPlan.places.length !== this.props.itineraryPlan.places.length){

            this.calculateDistances();
            return;
        }
        for (let i = 0; i < prevProps.itineraryPlan.places.length && i < this.props.itineraryPlan.places.length; i++) {
            if (prevProps.itineraryPlan.places[i].name !== this.props.itineraryPlan.places[i].name){ //this assumes all places have a name
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
                <Row> <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <ItineraryTable     itineraryPlan={this.props.itineraryPlan}
                                        headerOptions={this.props.headerOptions}
                                        updateStateVar={this.props.updateStateVar}/>
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
            if (this.props.headerOptions[detail]) {
                list.push(<CustomInput type="checkbox" id={detail+i} defaultChecked="true" label={labels[i]} onClick={() => {this.toggleCheckbox(detail, (!this.props.headerOptions[detail]))}}/>);
            }
            else
                list.push(<CustomInput type="checkbox" id={detail+i} label={labels[i]} onClick={()=>{this.toggleCheckbox(detail, (!this.props.headerOptions[detail]))}}/>);
            i++;
        }
        list.push(<Button type="submit" value="Reverse" id="reverseButton" onClick={(e) => this.reverseItinerary(e)}>Reverse</Button>);
        list.push(<Button type="submit" value="ToggleAll" id="markerToggleAll" onClick={(e) => this.allMarkerToggle(e)}>Markers On/Off</Button>);
        return(list);
    }

    toggleCheckbox(option, value) {
        this.props.updateStateVar('headerOptions', option, value);
    }

    addLocation(id, name, latitude, longitude) {
        let placesCopy = [];
        Object.assign(placesCopy, this.props.itineraryPlan.places);
        placesCopy.push({id: id, name: name, latitude: latitude, longitude: longitude});
        this.props.updateStateVar('itineraryPlan', 'places', placesCopy);
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
                            <input type="submit" value="Save File" id="saveButton" color="link" onClick={(e) => this.saveFile(e)} />
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
        for(let i=0; i < placeList.length; i++){
            if(this.props.itineraryPlan.markers[placeList[i].id]){
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
                <Popup className="font-weight-extrabold">{markerItem.name}</Popup>
            </Marker>
        );
    }

    getBounds() {
        if(this.props.itineraryPlan.places.length == 0){
            // northwest and southeast Itinerary-Map corners of the state of Colorado
            return L.latLngBounds(L.latLng(41, -109), L.latLng(37, -102));
        }
        if(this.props.itineraryPlan.places.length == 1){
            return this.getSingleLoc();
        }
        let tLat = [];
        let tLon = [];
        for(let place in this.props.itineraryPlan.places) {
            tLat.push(this.props.itineraryPlan.places[place].latitude);
            tLon.push(this.props.itineraryPlan.places[place].longitude);
        }
        let maxLat = Math.max.apply(null, tLat);let maxLon = Math.max.apply(null, tLon);
        let minLat = Math.min.apply(null, tLat);let minLon = Math.min.apply(null, tLon);

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

    saveFile(event) {
        event.preventDefault();
        var file = new Blob([JSON.stringify(this.props.itineraryPlan)], {type: "text/plain;charset=utf-8"});  // Source="https://www.npmjs.com/package/file-saver/v/1.3.2"
        saveAs(file, "MyItinerary.txt");
    }

    loadFile(e) {
        let fileReader;
        const handleFileRead = (e) => {
            //read the text-format file to a string
            const content = fileReader.result;
            //parse the string into a JSON file
            try {let fileInfo = JSON.parse(content);
                //set places and distances equal to the JSON file's places and distances
                this.props.updateStateVar('itineraryPlan', 'places', Parsing.parseObject(fileInfo.places));
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

    allMarkerToggle(){
        if(Object.keys(this.props.itineraryPlan.markers).length != 0){
            this.props.updateStateVar('itineraryPlan', 'markers', {});
        }
        else{
            let markerList = {};
            for(let i=0; i < this.props.itineraryPlan.places.length; i++){
                markerList[this.props.itineraryPlan.places[i].id] = true;
            }
            this.props.updateStateVar('itineraryPlan', 'markers', markerList);
        }
    }
}
