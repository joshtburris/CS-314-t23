import React, { Component } from 'react'
import {sendServerRequestWithBody} from "../../../api/restfulAPI";
import Pane from "../Pane";
import {Container, Row, Col} from 'reactstrap'
import {Map, Marker, Popup, TileLayer, Polygon} from "react-leaflet";
import FileSaver from "file-saver";

export default class Itinerary extends Component {
    constructor(props) {
        super(props);
        this.state={
            'options': {title: "null", earthRadius: this.props.options.units[this.props.options.activeUnit]},
            'itPlaces': [],
            'distances': [],
            fileContent: null,
            errorMessage: null
        }
        this.loadFile = this.loadFile.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.generateItinerary = this.generateItinerary.bind(this);
        this.itineraryHeader = this.itineraryHeader.bind(this);
    }

    render(){
        return(
            <Container>
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
                                  <input type="submit" value="Save..." id="saveButton" color="link" onClick={this.saveFile} />
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
            <Map center={this.csuOvalGeographicCoordinates()} zoom={10}
                 style={{height: 500, maxwidth: 700}}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                           attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <Polygon positions = {[this.getLL()]}/>
            </Map>
        )
    }

    csuOvalGeographicCoordinates() {
        return L.latLng(40.576179, -105.080773);
    }

    getLL(){
        let LL = [];
        for (let place in this.state.places) {
            LL.push(L.latLng([place.latitude, place.longitude]))
        }
        return LL
    }

    generateItinerary(){
        let myItinerary = [];
        let place = [];
        let dist = 0;
        let tempLoc = [];
        myItinerary.push(this.itineraryHeader());

        for(place in this.state.itPlaces){
            tempLoc.push(this.state.itPlaces[place].name);
            myItinerary.push(
                <div key={"places_"+place}> <Row> <Col xs="6" sm="6" md="6" lg="6" xl="6">
                        {this.state.itPlaces[place].name}
                    </Col>
                    <Col xs="5" sm="5" md="5" lg="5" xl="5">
                        {dist}
                    </Col> </Row> </div>
            );
            dist = dist + this.state.distances[place];
        }
        if(this.state.itPlaces[0]){
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

    saveFile(){
        var file = new Blob([JSON.stringify(this.state)], {type: "text/plain;charset=utf-8"});  // Source="https://www.npmjs.com/package/file-saver/v/1.3.2"
        saveAs(file, "MyItinerary.txt");
    }

    loadFile(){
        let fileReader;
        const handleFileRead = (e) => {
            //read the text-format file to a string
            const content = fileReader.result;

            //parse the string into a JSON file
            let fileInfo = JSON.parse(content);

            //set places and distances equal to the JSON file's places and distances
            this.setState({
                'itPlaces': fileInfo.places,
                'distances': fileInfo.distances,
                fileContent: fileInfo
            });
            console.log(fileInfo);
        };

        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        //read the first file in
        //NOTE: File must be formatted in double quotations (")
        fileReader.readAsText(event.target.files[0]);

    }

    calculateDistances(){
        const tipConfigRequest = {
            'type'        : 'itinerary',
            'version'     : 2,
            'options'      : this.state.options,
            'places' : this.state.itPlaces,
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
