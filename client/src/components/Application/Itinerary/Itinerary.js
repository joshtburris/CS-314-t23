import React, { Component } from 'react'
import {sendServerRequestWithBody} from "../../../api/restfulAPI";
import Pane from "../Pane";
import {Container, Row, Col} from 'reactstrap'
import {Map, Marker, Popup, TileLayer, Polyline} from "react-leaflet";
import { Button } from 'reactstrap'

export default class Itinerary extends Component {
    constructor(props) {
        super(props);
        this.state={
            'options': {title: "null", earthRadius: this.props.options.units[this.props.options.activeUnit]},
            'places': [],
            'distances': [],
            fileContent: null,
            errorMessage: null
        }
        this.loadFile = this.loadFile.bind(this);
        this.generateItinerary = this.generateItinerary.bind(this);
        this.generateItinerary = this.generateItinerary.bind(this);
        this.saveFile = this.saveFile.bind(this);
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
                              <form onSubmit={this.saveFile}>
                                  <Button type='submit'  color="link" > Save </Button>
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
                <Polyline positions = {[this.getLL()]}/>
            </Map>
        )
    }

    csuOvalGeographicCoordinates() {
        return L.latLng(40.576179, -105.080773);
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

    saveFile(){
        let saveFile = new File("Itinerary.json", "write");
        saveFile.open();
        saveFile.write(this.state.fileContent);
        console.log(this.state.places[0].name);
        console.log(this.state.distances[0]);
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
                'places': fileInfo.places,
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
