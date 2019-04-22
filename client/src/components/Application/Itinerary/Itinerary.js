import React, { Component } from 'react';
import {CustomInput, Alert, Container, Row, Col, Button, Dropdown, DropdownMenu, DropdownToggle, DropdownItem} from 'reactstrap';
import ItineraryTable from "./ItineraryTable";
import Ajv from 'ajv';
import {sendServerRequestWithBody} from "../../../api/restfulAPI";
import Pane from "../Pane";
import schema from './TIPItinerarySchema';
import Parsing from '../Parsing'
import Saver from './Saver';
import Optimizations from './Optimizations';
import ClassMap from '../ClassMap';

export default class Itinerary extends Component {
    constructor(props) {
        super(props);
        this.state={
            errorMessage: null,
            dropdownOpen: false,
            tableDropdownOpen: false,
        };
        this.loadFile = this.loadFile.bind(this);
        this.addLocation = this.addLocation.bind(this);
        this.calculateDistances = this.calculateDistances.bind(this);
        this.calculateDistances();
        this.toggleSave = this.toggleSave.bind(this);
    }

    render() {
        return(
            <Container>
                { this.state.errorMessage }
                <Row>
                    <Col xs={12} sm={12} md={7} lg={8} xl={8}>
                    {this.renderMap()}
                    </Col>
                    <Col xs={12} sm={12} md={5} lg={4} xl={4}>
                    {this.renderItinerary()}
                    {this.tableOptions()}
                    </Col>
                </Row>
                <Row> <Col xl={12}>
                    <ItineraryTable     itineraryPlan={this.props.itineraryPlan}
                                        headerOptions={this.props.headerOptions}
                                        updateStateVar={this.props.updateStateVar}
                                        setStateVar={this.props.setStateVar}
                                        addLocation={this.addLocation}
                                        getNextPlaceID={this.props.getNextPlaceID}
                                        getTableOpts={this.getTableOpts}/>

                </Col> </Row>
            </Container>
        );
    }

    renderOptimizations() {
        return(
            <Optimizations optimizations={this.props.config.optimizations}
                           activeOpt={this.props.options.optimization}
                           updateStateVar={this.props.updateStateVar}/>
        );
    }

    tableOptions() {
        return(
            <Pane header={'Header Options'}>
                {<Container>
                    <Button type="submit" value="Reverse" id="reverseButton" onClick={(e) => this.reverseItinerary(e)}>Reverse</Button>
                    <Button type="submit" value="ToggleAll" id="markerToggleAll" onClick={(e) => this.allMarkerToggle()}>Markers Toggle</Button>
                    <Button type="submit" value="Update" id="updateButton" onClick={(e) => this.calculateDistances()}>Update Distances</Button>
                    {this.renderOptimizations()}
                </Container>}
            </Pane>
        );
    }

    addLocation(name, latitude, longitude) {
        name = name.trim();
        if (this.checkLocationInput(name, latitude, longitude)) {
            let newPlan = {};
            let nextID = this.props.getNextPlaceID();
            Object.assign(newPlan, this.props.itineraryPlan);
            newPlan["places"].push({id: nextID, name: name, latitude: latitude.toString(), longitude: longitude.toString()});
            newPlan["markers"][nextID] = false;
            this.props.setStateVar("itineraryPlan", newPlan);
        }
    }

    checkLocationInput(name, lat, lon) {
        if (    Parsing.isNameValid(name)
            &&  Parsing.validateCoordinates(lat+" "+lon))
            return true;
        return false;
    }

    reverseItinerary() {
        let itin = {};
        let rPlaces = [];
        Object.assign(itin, this.props.itineraryPlan);
        Object.assign(rPlaces, this.props.itineraryPlan.places);
        itin.places = rPlaces.reverse();
        itin.distances = [];
        this.props.setStateVar('itineraryPlan', itin);
    }

    //used for dropDown toggle
    toggleSave() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }



    renderItinerary() {
        return(
            <Pane header={'Save/Upload Your Itinerary'}>
                <Container>
                    <input type="file" name="" id="loadButton" onChange={this.loadFile} />
                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleSave}>
                        <DropdownToggle caret>
                            Save File
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem id="saveJSON" onClick={(e) => this.saveFile(e, "json")}>JSON</DropdownItem>
                            <DropdownItem id="saveCSV" onClick={(e) => this.saveFile(e, "csv")}>CSV</DropdownItem>
                            <DropdownItem id="saveSVG" onClick={(e) => this.saveFile(e, "svg")}>SVG</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Container>
            </Pane>
        );
    }

    renderMap() {
        return (
            <Pane header={'Itinerary'}>
                <ClassMap   options={this.state.planOptions}
                            places={this.props.itineraryPlan.places}
                            markers={this.props.itineraryPlan.markers}
                            headerOptions={this.props.headerOptions}
                            setMarkers={this.setMarkers}/>
            </Pane>
        );
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
        let markers = {};
        Object.assign(places, Parsing.parseObject(fileInfo.places));
        for (let i = 0; i < places.length; ++i) {
            let nextID = this.props.getNextPlaceID();
            places[i].id = nextID;
            markers[nextID] = false;
        }

        let newPlan = {};
        Object.assign(newPlan, this.props.itineraryPlan);
        newPlan["places"] = places;
        newPlan["markers"] = markers;
        this.props.setStateVar("itineraryPlan", newPlan);

        this.setState({errorMessage: ""});
    }

    calculateDistances() {
        const tipConfigRequest = {
            'requestType'        : 'itinerary',
            'requestVersion'     : 5,
            'options'            : {title: "null", earthRadius: this.props.options.units[this.props.options.activeUnit].toString(),
                                    optimization: this.props.options.optimization},
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
        let markerList = {};
        if(Object.keys(this.props.itineraryPlan.markers).length === 0){ markerList = this.setMarkers(); }
        else{
            Object.assign(markerList, this.props.itineraryPlan.markers);
            let temp = Object.values(markerList);
            let key;
            for(let i=0; i < Object.keys(markerList).length; i++){
                key = this.props.itineraryPlan.places[i].id;
                if(temp.indexOf(true) !== -1){ markerList[key] = false; }
                else{ markerList[key] = !markerList[key]; }
            }
        }
        this.props.updateStateVar('itineraryPlan', 'markers', markerList);
    }

    setMarkers() {
        let markerList = {};
        for (let i = 0; i < this.props.itineraryPlan.places.length; i++) {
            markerList[this.props.itineraryPlan.places[i].id] = false;
        }
        return markerList;
    }

}
