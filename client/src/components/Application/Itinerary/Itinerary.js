import React, { Component } from 'react'
import {sendServerRequestWithBody} from "../../../api/restfulAPI";
import Pane from "../Pane";
import { Alert } from 'reactstrap';
import FileSaver from 'file-saver'; //
import {Container, Row, Col, CustomInput} from 'reactstrap'
import {Map, TileLayer, Polyline} from "react-leaflet";

export default class Itinerary extends Component {
    constructor(props) {
        super(props);
        this.state={
            'options': {title: "null", earthRadius: this.props.options.units[this.props.options.activeUnit]},
            'places': [],
            'distances': [],
            errorMessage: null,
            boundaries: null,
            details: {Name:true, Distance:true, T_Distance:true, Lat: false, Lng: false}
        };
        this.loadFile = this.loadFile.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.generateItinerary = this.generateItinerary.bind(this);
        this.addLocation = this.addLocation.bind(this);
        this.calculateDistances = this.calculateDistances.bind(this);
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
                    {this.checkList()}
                </Col>
                </Row>
                <Row> <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    {this.renderTable()}
                </Col> </Row>
            </Container>
        );
    }

    checkList(){
        return(
            <Pane header={'Detail Options'}
                  bodyJSX={
                      <Container>
                          <div>
                              <CustomInput type="checkbox" id="Name" defaultChecked="true" label="Destination" onClick={()=>{this.toggleCheckbox('Name', (!this.state.details['Name']))}}/>
                              <CustomInput type="checkbox" id="Distance" defaultChecked="true" label="Leg Distance" onClick={()=>{this.toggleCheckbox('Distance', (!this.state.details['Distance']))}}/>
                              <CustomInput type="checkbox" id="T_Distance" defaultChecked="true" label="Total Distance" onClick={()=>{this.toggleCheckbox('T_Distance', (!this.state.details['T_Distance']))}}/>
                              <CustomInput type="checkbox" id="Lat" label="Latitude" onClick={()=>{this.toggleCheckbox('Lat', (!this.state.details['Lat']))}}/>
                              <CustomInput type="checkbox" id="Lng" label="Longitude" onClick={()=>{this.toggleCheckbox('Lng', (!this.state.details['Lng']))}}/>
                          </div>
                      </Container>}/>
        );
    }

    toggleCheckbox(option, value){
        let inputCopy = Object.assign({}, this.state.details);
        inputCopy[option] = value;
        this.setState({'details': inputCopy});
    }

    renderItinerary(){
        return(
            <Pane header={'Save/Upload Your Itinerary'}>
                      <Container>
                          <Row>
                              <input type="file" name="" id="input" onChange={this.loadFile} />
                              <form>
                                  <input type="submit" value="Save..." id="saveButton" color="link" onClick={(e) => this.saveFile(e)} />
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
        if(this.state.places.length == 1){
            return this.getSingleLoc();
        }
        let tLat = [];
        let tLon = [];
        for(let place in this.state.places) {
            tLat.push(this.state.places[place].latitude);
            tLon.push(this.state.places[place].longitude);
        }
        let maxLat = Math.max.apply(null, tLat);let maxLon = Math.max.apply(null, tLon);
        let minLat = Math.min.apply(null, tLat);let minLon = Math.min.apply(null, tLon);

        return L.latLngBounds(L.latLng(minLat, minLon), L.latLng(maxLat, maxLon));
    }

    getSingleLoc(){
        let locLat = parseFloat(this.state.places[0].latitude);
        let locLon = parseFloat(this.state.places[0].longitude);
        return L.latLngBounds(L.latLng(locLat-0.05, locLon-0.05), L.latLng(locLat+0.05, locLon+0.05));
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

    renderTable(){
        return(
            <Pane header={'Your Itinerary'}>
                <Table hover>
                    {this.generateItinerary()}
                </Table>
            </Pane>
        );
    }

    generateItinerary(){
        let myItinerary = [];
        let dist = 0;
        let tempLoc = [];
        myItinerary.push(<thead><tr>{this.itineraryHeader()}</tr></thead>);
        if(this.state.places.length > 0){
            myItinerary.push(<tbody>{this.getItineraryRows()}</tbody>);
        }
        return(myItinerary);
    }

    getItineraryRows(){
        let tempList = [], dist = 0;
        tempList.push(<tr>{this.getLine(0, 0, 0)}</tr>);
        dist = dist + this.state.distances[0];
        for(let place in this.state.places){
            if (place == 0) continue;
            tempList.push(<tr>{this.getLine(place, this.state.distances[place-1], dist)}</tr>);
            dist = dist + this.state.distances[place];
        }
        if(this.state.places.length > 1){
            tempList.push(<tr>{this.getLine(0, this.state.distances[this.state.distances.length-1], dist)}</tr>);
        }
        return(tempList);
    }

    getLine(index, legDist, dist){
        let markup=[];
        for(let detail in this.state.details) {
            if(this.state.details[detail] === true) {
                if (detail === 'Name') markup.push(<td>{this.state.places[index].name}</td>);
                if (detail === 'Distance') markup.push(<td>{legDist}</td>);
                if (detail === 'T_Distance') markup.push(<td>{dist}</td>);
                if (detail === 'Lat') markup.push(<td>{this.state.places[index].latitude}</td>);
                if (detail === 'Lng') markup.push(<td>{this.state.places[index].longitude}</td>);
            }
        }
        return(markup);
    }

    itineraryHeader(){
        let markup=[];
        for(let detail in this.state.details) {
            if(this.state.details[detail] === true) {
                if (detail === 'Name') markup.push(<th><b>Destination</b></th>);
                if (detail === 'Distance') markup.push(<th><b>Leg Distance</b></th>);
                if (detail === 'T_Distance') markup.push(<th><b>Total Distance</b></th>);
                if (detail === 'Lat') markup.push(<th><b>Latitude</b></th>);
                if (detail === 'Lng') markup.push(<th><b>Longitude</b></th>);
            }
        }
        return(markup);
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
