import React, { Component } from 'react';
import {Dropdown, DropdownMenu, DropdownToggle, DropdownItem} from 'reactstrap';
import Pane from "../Pane";
import {Button, CustomInput, Input, Table, Row, Col} from 'reactstrap';
import Parsing from '../Parsing';

export default class ItineraryTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            LL: {
                latitude: 0.0,
                longitude: 0.0
            }
        };

        this.addNewLocation = this.addNewLocation.bind(this);
        this.showMarkerPerLocation = this.showMarkerPerLocation.bind(this);
        this.toggleTable = this.toggleTable.bind(this);
    }

    getStyle(){
        if (this.props.places.length >= 3){
            return({height: '400px', overflowX: 'scroll', overflowY: 'scroll'});
        }
        return({overflowX: 'scroll'});
    }

    render() {
        return this.renderTable();
    }

    renderTable() {
        return(
            <Pane header={'Your Itinerary'}>
                {this.getTableOpts()}
                <div style={this.getStyle()}> <Table hover>
                    {this.generateItinerary()}
                </Table> </div>
                <thead><b>
                    Add Location
                </b></thead>
                <tbody>
                    {this.newLocationInput()}
                </tbody>
            </Pane>
        );
    }

    getTableOpts() {
        let list =[];
        let i = 0;
        for (let detail in this.props.headerOptions) {
            list.push(
                <DropdownItem
                    active={this.props.headerOptions[detail]}
                    onClick={() => {this.toggleCheckbox(detail, (!this.props.headerOptions[detail]))}}
                    id={detail}
                >{detail}</DropdownItem>
            );
            i++;
        }
        return(<Dropdown isOpen={this.state.tableDropdownOpen} toggle={this.toggleTable}>
            <DropdownToggle caret>
                Modify Table
            </DropdownToggle>
            <DropdownMenu>
                {list}
            </DropdownMenu>
        </Dropdown>);
    }

    //used for dropDown toggle
    toggleTable() {
        this.setState(prevState => ({
            tableDropdownOpen: !prevState.tableDropdownOpen
        }));
    }

    toggleCheckbox(option, value) {
        this.props.updateStateVar('headerOptions', option, value);
    }

    generateItinerary() {
        let myItinerary = [];
        myItinerary.push(<thead key={"itineraryHeader"}><tr key={"HeaderRow"}>{this.itineraryHeader()}</tr></thead>);
        if (this.props.itineraryPlan.places.length > 0) {
            myItinerary.push(<tbody key={"itineraryBody"}>{this.getItineraryRows()}</tbody>);
        }
        return myItinerary;
    }

    itineraryHeader() {
        let markup = [];
        for (let detail in this.props.headerOptions) {
            if (this.props.headerOptions[detail] === true)
                markup.push(<th><b>{detail.substring(0,1).toUpperCase() + detail.substring(1)}</b></th>);
        }
        return markup;
    }

    getItineraryRows() {
        let list = [], dist = 0, index = 0;
        list.push(<tr key={"TableRow_0_top"}>{this.getLine(0, dist, index)}</tr>);
        dist = dist + this.props.itineraryPlan.distances[0];
        for (let place in this.props.itineraryPlan.places) {
            if (place == 0) continue;
            list.push(<tr key={"TableRow_" + place-1}>{this.getLine(this.props.itineraryPlan.distances[place-1],
                                            dist,
                                            index+1)}</tr>);
            list.push(<tr>{this.getLine(this.props.itineraryPlan.distances[place-1], dist, index+1)}</tr>);
            dist = dist + this.props.itineraryPlan.distances[place];
            ++index;
        }
        //Push a copy of first places to end the trip
        if (this.props.itineraryPlan.places.length > 1) {
            list.push(<tr key={"TableRow_0_bottom"}>{
                this.getLine(this.props.itineraryPlan.distances[this.props.itineraryPlan.distances.length-1],dist,0)
            }</tr>);
        }
        return list;
    }

    getLine(legDist, tDist, index) {
        let markup = [];
        if (isNaN(tDist)){
            tDist ='';
        }
        for (let opt in this.props.headerOptions) {
            if (this.props.headerOptions[opt]) {
                let val = null;
                if (opt == "legDistance"){
                    val = legDist;
                }
                else if (opt == "totalDistance"){
                    val = tDist;
                }
                else {
                    val = this.props.itineraryPlan.places[index][opt];
                }
                markup.push(<td>{val}</td>);
            }
        }

        let key = this.props.itineraryPlan.places[index].id;
        let tag = 'editTable'+index;
        markup.push(<td><div style={{width:'200px'}}><Button id={tag} type='submit' color="link" onClick={()=>{this.removeLocation(index, key);}} > <b>X</b> </Button>
            <Button id={tag} type='submit' color="link" size="lg" onClick={() => {this.rearrange(index, 1);}}> <b>↑</b> </Button>
            <Button id={tag} type='submit' color="link" size="lg" onClick={() => {this.rearrange(index, 0);}}> <b>↓</b> </Button>
            <Button id={tag} type='submit' color="link" size="lg" onClick={() => {this.moveTop(index);}}> <b>↑↑</b> </Button>
            <CustomInput id={tag+"Marker"} checked={this.props.itineraryPlan.markers[key]} type="checkbox" label="Show Marker" onClick={() => {this.showMarkerPerLocation(key);}} />
        </div></td>);
        return(markup);
    }

    newLocationInput() {
        let list = [];
        list.push(
            <Row key={"newLocationInsert"}><Col>
                <Input
                    id={"newLocationName"}
                    placeholder={"Name"}
                    style={{width: "100%", borderColor: "black"}}
                    onChange={(e) => (this.updateAndValidateNameInput(e.target))}
                />
            </Col><Col>
                <Input
                    id={"newLocationLL"}
                    placeholder={"Latitude, Longitude"}
                    style={{width: "100%", borderColor: "black"}}
                    onChange={(e) => (this.updateAndValidateCoordinateInput(e.target))}
                />
            </Col><Col>
                <Button type='submit' color="link" onClick={()=>{this.addNewLocation();}}> <b>+</b> </Button>
            </Col></Row>
        );
        return list;
    }

    updateAndValidateNameInput(target) {
        if (Parsing.isNameValid(target.value)) {
            this.setState({
                name: target.value
            });
            target.style.borderColor = "black";
        } else {
            target.style.borderColor = "red";
        }
    }

    updateAndValidateCoordinateInput(target) {
        try {
            let ll = Parsing.parseCoordinatePair(target.value);
            this.setState({
                LL: {
                    latitude: ll.latitude,
                    longitude: ll.longitude
                }
            });
            target.style.borderColor = "black";
        } catch (e) {
            target.style.borderColor = "red";
        }
    }

    addNewLocation() {
        let nameElement = document.getElementById("newLocationName"),
            llElement = document.getElementById("newLocationLL");
        if (nameElement.style.borderColor !== "red" && llElement.style.borderColor !== "red") {
            this.props.addLocation(this.state.name, this.state.LL.latitude, this.state.LL.longitude);
            this.setState( {name: "", LL: {latitude: 0.0, longitude: 0.0}} );
            nameElement.style.borderColor = "black";
            nameElement.value = "";
            llElement.style.borderColor = "black";
            llElement.value = "";
        }
    }

    checkLocationInput(name, lat, lon) {
        if (    Parsing.isNameValid(name)
            &&  Parsing.validateCoordinates(lat+" "+lon))
            return true;
        return false;
    }

    removeLocation(index, key) {
        let itin = {}, places = [], markers = {};
        Object.assign(itin, this.props.itineraryPlan);
        Object.assign(places, this.props.itineraryPlan.places);
        Object.assign(markers, this.props.itineraryPlan.markers);
        places.splice(index, 1);
        delete markers[key];

        itin["places"] = places;
        itin["markers"] = markers;
        itin["distances"] = [];
        this.props.setStateVar('itineraryPlan', itin);
    }

    //Function that moves an index in the itinerary up or down by one
    //index: the index of the item to be moved
    //direction: 0 for down, 1 for up
    rearrange(index, direction) {
        let itinLen = this.props.itineraryPlan.places.length;
        let copyItin = {};
        Object.assign(copyItin, this.props.itineraryPlan);
        //invalidate distances
        copyItin.distances = [];
        let copyPlaces = Object.assign([], copyItin.places);

        if (direction == 0) {
            //swap the selected index and the one below it
            let temp = copyPlaces[(parseInt(index)+1) % itinLen];
            copyPlaces[(parseInt(index)+1) % itinLen] = copyPlaces[index];
            copyPlaces[index] = temp;
        } else {
            if (parseInt(index) == 0) {
                //swap the selected index's item and the last item
                let temp = copyPlaces[itinLen-1];
                copyPlaces[itinLen-1] = copyPlaces[index];
                copyPlaces[index] = temp;
            }
            else {
                //swap the selected index and the one above it
                let temp = copyPlaces[index - 1];
                copyPlaces[index - 1] = copyPlaces[index];
                copyPlaces[index] = temp;
            }
        }
        copyItin.places = copyPlaces;
        //put new array into the proper area
        this.props.setStateVar('itineraryPlan', copyItin);
    }

    //Function that moves the selected index to the top of the table
    //index: the index of the item to be moved
    moveTop(index) {
        let copyItin = {};
        Object.assign(copyItin, this.props.itineraryPlan);
        //invalidate distances
        copyItin.distances = [];
        let copyPlaces = copyItin.places;
        let temp = copyPlaces[index];

        //copy objects from 0-index down by 1, then replace index 0
        for (let i=parseInt(index); i > 0; i--) {
            copyPlaces[i] = copyPlaces[i-1];
        }
        copyPlaces[0] = temp;

        //put new array into the proper area
        this.props.setStateVar('itineraryPlan', copyItin);
    }

    showMarkerPerLocation(key) {
        let copyMarkers = {};
        Object.assign(copyMarkers, this.props.itineraryPlan.markers);

        copyMarkers[key] = !copyMarkers[key];
        this.props.updateStateVar('itineraryPlan', 'markers', copyMarkers);
    }

}
