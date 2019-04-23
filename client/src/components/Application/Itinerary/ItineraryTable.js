import React, { Component } from 'react';
import Pane from "../Pane";
import {Button, CustomInput, Input, Table} from 'reactstrap';
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
    }

    getStyle(){
        if (this.props.itineraryPlan.places.length >= 3){
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

    generateItinerary() {
        let myItinerary = [];
        myItinerary.push(<thead><tr>{this.itineraryHeader()}</tr></thead>);
        if (this.props.itineraryPlan.places.length > 0) {
            myItinerary.push(<tbody>{this.getItineraryRows()}</tbody>);
        }
        return myItinerary;
    }

    getItineraryRows() {
        let list = [], dist = 0, index = 0;
        list.push(<tr>{this.getLine(0, dist, index)}</tr>);
        dist = dist + this.props.itineraryPlan.distances[0];
        for (let place in this.props.itineraryPlan.places) {
            if (place == 0) continue;
            list.push(<tr>{this.getLine(    this.props.itineraryPlan.distances[place-1],
                                            dist,
                                            index+1)}</tr>);
            dist = dist + this.props.itineraryPlan.distances[place];
            ++index;
        }
        if (this.props.itineraryPlan.places.length > 1) {
            list.push(<tr>{this.getLine(    this.props.itineraryPlan.distances[this.props.itineraryPlan.distances.length-1],
                                            dist,
                                            0)}</tr>);
        }
        return list;
    }

    getLine(legDist, tDist, index) {
        let markup = [];
        let headers = [ this.props.itineraryPlan.places[index].name,
                        legDist,
                        tDist,
                        this.props.itineraryPlan.places[index].latitude,
                        this.props.itineraryPlan.places[index].longitude];
        let i = 0;
        for (let opt in this.props.headerOptions) {
            if (this.props.headerOptions[opt]) {
                markup.push(<td>{headers[i]}</td>);
            }
            ++i;
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
        list.push(<td>
            <Input
                id={"newLocationName"}
                placeholder={"Name"}
                style={{width: "100%", borderColor: "black"}}
                onChange={(e) => (this.updateAndValidateNameInput(e.target))}
            /></td>
        );
        list.push(<td>
            <Input
                id={"newLocationLL"}
                placeholder={"Latitude, Longitude"}
                style={{width: "100%", borderColor: "black"}}
                onChange={(e) => (this.updateAndValidateCoordinateInput(e.target))}
            /></td>
        );
        list.push(<td><Button type='submit' color="link" onClick={()=>{this.addNewLocation();}}> <b>+</b> </Button></td>);
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

    itineraryHeader() {
        let markup = [];
        let labels = ['Name', 'Leg Distance', 'Total Distance', 'Latitude', 'Longitude'];
        let i = 0;
        for (let detail in this.props.headerOptions) {
            if (this.props.headerOptions[detail] === true)
                markup.push(<th><b>{labels[i]}</b></th>);
            ++i;
        }
        return markup;
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
        this.props.setStateVar('itineraryPlan', itin);
    }

    //Function that moves an index in the itinerary up or down by one
    //index: the index of the item to be moved
    //direction: 0 for down, 1 for up
    rearrange(index, direction) {
        let itinLen = this.props.itineraryPlan.places.length;
        let copyPlaces = [];
        Object.assign(copyPlaces, this.props.itineraryPlan.places);

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
        //put new array into the proper area
        this.props.updateStateVar('itineraryPlan', 'places', copyPlaces);
    }

    //Function that moves the selected index to the top of the table
    //index: the index of the item to be moved
    moveTop(index) {
        let copyPlaces = [];
        Object.assign(copyPlaces, this.props.itineraryPlan.places);
        let temp = copyPlaces[index];

        //copy objects from 0-index down by 1, then replace index 0
        for (let i=parseInt(index); i > 0; i--) {
            copyPlaces[i] = copyPlaces[i-1];
        }
        copyPlaces[0] = temp;

        //put new array into the proper area
        this.props.updateStateVar('itineraryPlan', 'places', copyPlaces);
    }

    showMarkerPerLocation(key) {
        let copyMarkers = {};
        Object.assign(copyMarkers, this.props.itineraryPlan.markers);

        copyMarkers[key] = !copyMarkers[key];
        this.props.updateStateVar('itineraryPlan', 'markers', copyMarkers);
    }

}
