import React, { Component } from 'react'
import {sendServerRequestWithBody} from "../../../api/restfulAPI";
import Pane from "../Pane";
import Container from "reactstrap/es/Container";
import Col from "reactstrap/es/Col";
import {Map, Marker, Popup, TileLayer, Polygon} from "react-leaflet";

export default class Itinerary extends Component {
    constructor(props) {
        super(props);
        this.state={
            'options': {title: "null", earthRadius: this.props.options.units[this.props.options.activeUnit]},
            'places': [],
            'distances': []
        }
    }

    render(){
        return(
            <Container>
                <Col>
                    {this.renderMap()}
                </Col>
                <Col>
                    {this.renderItinerary()}
                </Col>
            </Container>
        );
    }

    renderItinerary(){
        return(
            <Pane header={'Save Your Itinerary'}
                  bodyJSX={
                      <div className="App">
                      <input type="file" name="" id="input" onChange={this.loadFile} />
                      </div>}/>
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
                <Polygon/>
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
    }

    saveFile(){

    }

    loadFile(){
        let fileReader;

        const handleFileRead = (e) => {
            const content = fileReader.result;
            this.setState({
                fileContents: content,
            });
        };

        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(event.target.files[0]);
    }

    calculateDistances(){
        const tipConfigRequest = {
            'type'        : 'itinerary',
            'version'     : 2,
            'options'      : this.state.options,
            'places' : this.state.places,
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
