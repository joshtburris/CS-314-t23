import React, { Component } from 'react'
import {sendServerRequestWithBody} from "../../../api/restfulAPI";
import Pane from "../Pane";
import {Container, Row, Col} from 'reactstrap'
import {Map, Marker, Popup, TileLayer, Polygon} from "react-leaflet";
import { Button } from 'reactstrap'

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
        this.generateItinerary = this.generateItinerary.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.generateItinerary = this.generateItinerary.bind(this);
    }

    render(){
        return(
            <Container>
                <Row> <Col xs={12} sm={12} md={7} lg={8} xl={9}>
                    {this.renderMap()}
                </Col>
                <Col xs={12} sm={12} md={5} lg={4} xl={3}>
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
                              <form onSubmit={this.uploadFile}>
                                  <Button type='submit'  color="link" > Submit </Button>
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
        var myItinerary = [];
        var place = [];
        var dist = 0;
        for(place in this.state.itPlaces){
            myItinerary.push(
                <div key={"places_"+place}> <Row> <Col xs="5" sm="5" md="5" lg="5" xl="5">
                        {this.state.itPlaces[place].name}
                    </Col>
                    <Col xs="5" sm="5" md="5" lg="5" xl="5">
                        {this.state.distances[place]}
                    </Col> </Row> </div>
            );

        }
    }

    saveFile(){

    }

    loadFile(){
        let fileReader;

        const handleFileRead = (e) => {
            //read the text-format file to a string
            const content = fileReader.result;

            //parse the string into a JSON file
            var fileInfo = JSON.parse(content);

            //set places and distances equal to the JSON file's places and distances
            this.setState({
                'itPlaces': fileInfo.places,
                'distances': fileInfo.distances,
            });
            console.log(this.state.itPlaces);
            console.log("distances: " + this.state.distances);
        };

        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        //read the first file in
        //NOTE: File must be formatted in double quotations (")
        fileReader.readAsText(event.target.files[0]);
        this.setState({
            fileContent: fileReader
        });
    }

    uploadFile(file) {
        file.preventDefault();
        let place = [];
        let tempLoc = [];
        let tempDis = [];
        for (place in this.state.itPlaces){
            tempLoc.push(this.state.itPlaces[place].name);
            tempDis.push(this.state.distances[place]);
        }

        console.log(tempLoc);
        console.log(tempDis);
        this.props.itineraryLocation.locations = tempLoc;
        this.props.itineraryLocation.distances = tempDis;
        let updateLoc = this.props.itineraryLocation.locations;
        let updateDis = this.props.itineraryLocation.distances;
        this.props.updateItineraryLocation('locations', updateLoc);
        this.props.updateItineraryLocation('distances', updateDis);
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
