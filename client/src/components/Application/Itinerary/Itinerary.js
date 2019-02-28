import React, { Component } from 'react'
import {sendServerRequestWithBody} from "../../../api/restfulAPI";
import Pane from "../Pane";
import { Alert } from 'reactstrap';
import {Container, Row, Col} from 'reactstrap'
import {Map, TileLayer, Polyline} from "react-leaflet";

export default class Itinerary extends Component {
    constructor(props) {
        super(props);
        this.state={
            'options': {title: "null", earthRadius: this.props.options.units[this.props.options.activeUnit]},
            'places': [],
            'distances': [],
            errorMessage: null,
            boundaries: null
        };
        this.loadFile = this.loadFile.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.generateItinerary = this.generateItinerary.bind(this);
        this.itineraryHeader = this.itineraryHeader.bind(this);
        this.addLocation = this.addLocation.bind(this);
        this.calculateDistances = this.calculateDistances.bind(this);
        this.getBounds = this.getBounds.bind(this);
    }

    addLocation(id, name, latitude, longitude){
        this.state.places.push({id: id, name: name, latitude: latitude, longitude: longitude})
    }


    render(){
        return(
            <Container>
                { this.state.errorMessage }
                <Row> <Col xs={12} sm={12} md={7} lg={8} xl={8}>
                    {this.renderMap()}
                </Col>
                <Col xs={12} sm={12} md={5} lg={4} xl={4}>
                    {this.renderItinerary()}
                </Col> </Row>
            </Container>
        );
    }

    renderItinerary(){
        return(
            <Pane header={'Save Your Itinerary'}
                  bodyJSX={
                      <Container>
                          {this.generateItinerary()}
                          <Row>
                              <input type="file" name="" id="input" onChange={this.loadFile} />
                              <form>
                                  <input type="submit" value="Save..." id="saveButton" color="link" onClick={(e) => this.saveFile(e)} />
                              </form>
                          </Row>
                      </Container>}/>
        );
    }

    renderMap() {
        return (
            <Pane header={'Itinerary'}
                  bodyJSX={this.renderLeafletMap()}/>
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
            </Map>
        )
    }

    coloradoGeographicBoundaries() {
        // northwest and southeas< Itinerary-Mapt corners of the state of Colorado
        return L.latLngBounds(L.latLng(41, -109), L.latLng(37, -102));
    }

    getBounds(){
        if(this.state.places.length == 0){
            return this.coloradoGeographicBoundaries();
        }
        let tLat = [];
        let tLon = [];
        for(let place in this.state.places) {
            tLat.push(this.state.places[place].latitude);
            tLon.push(this.state.places[place].longitude);
        }
        let maxLat = Math.max.apply(null, tLat);
        let maxLon = Math.max.apply(null, tLon);
        let minLat = Math.min.apply(null, tLat);
        let minLon = Math.min.apply(null, tLon);

        return L.latLngBounds(L.latLng(minLat, minLon), L.latLng(maxLat, maxLon));
    }

    getLL(){
        let LL = [];
        for (let i in this.state.places) {
            LL.push(L.latLng(parseFloat(this.state.places[i].latitude), parseFloat(this.state.places[i].longitude)))
        }
        if (this.state.places[0] != null) {
            LL.push(L.latLng(parseFloat(this.state.places[0].latitude), parseFloat(this.state.places[0].longitude)));
        }
        return LL
    }

    generateItinerary(){
        let myItinerary = [];
        let place = [];
        let dist = 0;
        let tempLoc = [];
        myItinerary.push(this.itineraryHeader());

        for(place in this.state.places){
            tempLoc.push(this.state.places[place].name);
            myItinerary.push(
                <div key={"places_"+place}> <Row> <Col xs="6" sm="6" md="6" lg="6" xl="6">
                    {this.state.places[place].name}
                </Col>
                    <Col xs="5" sm="5" md="5" lg="5" xl="5">
                        {dist}
                    </Col> </Row> </div>
            );
            dist = dist + this.state.distances[place];
        }
        if(this.state.places[0]){
            myItinerary.push(
                <div key={"places_round_trip"}> <Row> <Col xs="6" sm="6" md="6" lg="6" xl="6">
                    {tempLoc[0]}
                </Col>
                    <Col xs="5" sm="5" md="5" lg="5" xl="5">
                        {dist}
                    </Col> </Row> </div>
            );}
        return(myItinerary);
    }

    itineraryHeader(){
        let tempList = [];
        tempList.push(
            <div key={"itinerary_header"}> <Row> <Col xs="6" sm="6" md="6" lg="6" xl="6">
                <b>Destinations</b>
            </Col>
                <Col xs="6" sm="6" md="6" lg="5" xl="6">
                    <b>Total Distance</b>
                </Col> </Row> </div>);
        return(tempList);
    }

    saveFile(event){
        event.preventDefault();
        var file = new Blob([JSON.stringify(this.state)], {type: "text/plain;charset=utf-8"});  // Source="https://www.npmjs.com/package/file-saver/v/1.3.2"
        saveAs(file, "MyItinerary.txt");
    }

    loadFile(e){
        let fileReader;
        const handleFileRead = (e) => {
            //read the text-format file to a string
            const content = fileReader.result;
            //parse the string into a JSON file
            try{let fileInfo = JSON.parse(content);
                //set places and distances equal to the JSON file's places and distances
                this.setState({'places': fileInfo.places}, () => this.calculateDistances());}
            catch (err){
                this.setState({
                    'places': [],
                    'distances': [],
                    errorMessage: <Alert className='bg-csu-canyon text-white font-weight-extrabold'>
                                      Error(0): Invalid file found. Please select a valid itinerary file.</Alert>
                });}};
        try {e.preventDefault();
            fileReader = new FileReader();
            fileReader.onloadend = handleFileRead;
            //read the first file in
            //NOTE: File must be formatted in double quotations (")
            fileReader.readAsText(event.target.files[0]);
        }catch (error){
            this.setState({
                'places': [],
                'distances': []
            });
        }
    }

    calculateDistances(){
        const tipConfigRequest = {
            'type'        : 'itinerary',
            'version'     : 2,
            'options'     : this.state.options,
            'places'      : this.state.places,
        };

        sendServerRequestWithBody('itinerary', tipConfigRequest, this.props.settings.serverPort)
            .then((response) => {
                if(response.statusCode >= 200 && response.statusCode <= 299) {
                    this.setState({
                        distances: response.body.distances,
                        errorMessage: null
                    });
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
}
