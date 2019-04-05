import React, { Component } from 'react';
import Pane from "../Pane";
import {Button} from 'reactstrap';
import { Table } from 'reactstrap';

export default class ItineraryTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(this.renderTable());
    }

    renderTable() {
        return(
            <Pane header={'Your Itinerary'}>
                <Table hover>
                    {this.generateItinerary()}
                </Table>
            </Pane>
        );
    }

    generateItinerary() {
        let myItinerary = [];
        myItinerary.push(<thead><tr>{this.itineraryHeader()}</tr></thead>);
        if (this.props.itineraryPlan.places.length > 0){
            myItinerary.push(<tbody>{this.getItineraryRows()}</tbody>);
        }
        return(myItinerary);
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
        if (this.props.itineraryPlan.places.length > 1){
            list.push(<tr>{this.getLine(    this.props.itineraryPlan.distances[this.props.itineraryPlan.distances.length-1],
                                            dist,
                                            0)}</tr>);
        }
        return(list);
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
            if (this.props.headerOptions[opt] === true) {
                markup.push(<td>{headers[i]}</td>);
            }
            ++i;
        }

        let tag = 'remove'+index;
        markup.push(<td><Button id={tag} type='submit' color="link" onClick={()=>{this.removeLocation(index);}} > <b>X</b> </Button>
            <Button id={tag} type='submit' color="link" size="lg" onClick={() => {this.rearrange(index, 1);}}> <b>↑</b> </Button>
            <Button id={tag} type='submit' color="link" size="lg" onClick={() => {this.rearrange(index, 0);}}> <b>↓</b> </Button>
            <Button id={tag} type='submit' color="link" size="lg" onClick={() => {this.moveTop(index);}}> <b>↑↑</b> </Button>
        </td>);
        return(markup);
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
        //markup.push(<th><b>Remove</b></th>);
        return(markup);
    }

    removeLocation(index) {
        let places = [];
        Object.assign(places, this.props.itineraryPlan.places);
        places.splice(index,1);
        this.props.updateStateVar('itineraryPlan', 'places', places);
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
        }
        else {
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
    moveTop(index){
        let copyPlaces = [];
        Object.assign(copyPlaces, this.props.itineraryPlan.places);
        let temp = copyPlaces[index];

        //copy objects from 0-index down by 1, then replace index 0
        for(let i=parseInt(index); i > 0; i--){
            copyPlaces[i] = copyPlaces[i-1];
        }
        copyPlaces[0] = temp;

        //put new array into the proper area
        this.props.updateStateVar('itineraryPlan', 'places', copyPlaces);
    }
}
