import React, { Component } from 'react'
import {sendServerRequestWithBody} from "../../../api/restfulAPI";
import Pane from "../Pane";
import {Container, Row, Col} from 'reactstrap'
import {Map, Marker, Popup, TileLayer, Polygon} from "react-leaflet";

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
                          <Row>
                              <input type="file" name="" id="input" onChange={this.loadFile} />
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
