import React, { Component } from 'react'
import Pane from "../Pane";
import {Button} from 'reactstrap'
import { Table } from 'reactstrap';

export default class ItineraryTable extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(this.renderTable());
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
        myItinerary.push(<thead><tr>{this.itineraryHeader()}</tr></thead>);
        if(this.props.places.length > 0){
            myItinerary.push(<tbody>{this.getItineraryRows()}</tbody>);
        }
        return(myItinerary);
    }

    getItineraryRows(){
        let tempList = [], dist = 0;
        tempList.push(<tr>{this.getLine(this.props.places[0].name, 0, 0, 0)}</tr>);
        dist = dist + this.props.distances[0];
        for(let place in this.props.places){
            if (place == 0) continue;
            tempList.push(<tr>{this.getLine(this.props.places[place].name, place, this.props.distances[place-1], dist)}</tr>);
            dist = dist + this.props.distances[place];
        }
        if(this.props.places.length > 1){
            tempList.push(<tr>{this.getLine(this.props.places[0].name, 0, this.props.distances[this.props.distances.length-1], dist)}</tr>);
        }
        return(tempList);
    }

    getLine(name, index, legDist, dist){
        let markup=[], temp = '';
        for(let detail in this.props.details) {
            temp = detail.toLowerCase();
            if(this.props.details[detail] === true) {
                if (detail === 'Leg Distance') markup.push(<td>{legDist}</td>);
                else if (detail === 'Total Distance') markup.push(<td>{dist}</td>);
                else markup.push(<td>{this.props.places[index][temp]}</td>);
            }
        }
        let tag = 'remove'+index;
        markup.push(<td><Button id={tag} type='submit' color="link" onClick={()=>{this.removeLocation(index);}} > <b>Del</b> </Button>
            <Button id={tag} type='submit' color="link" onClick={() => {this.rearrange(index, 1);}}> <b>↑</b> </Button>
            <Button id={tag} type='submit' color="link" onClick={() => {this.rearrange(index, 0);}}> <b>↓</b> </Button>
        </td>);
        return(markup);
    }

    itineraryHeader(){
        let markup=[];
        for(let detail in this.props.details)
            if(this.props.details[detail] === true)
                markup.push(<th><b>{detail}</b></th>);
        markup.push(<th><b>Remove</b></th>)
        return(markup);
    }

    removeLocation(index){
        let places = [];
        Object.assign(places, this.props.places);
        places.splice(index,1);
        this.props.updateItineraryInfo("places", places);
    }

    //Function that moves an index in the itinerary up or down by one
    //index: the index of the item to be moved
    //direction: 0 for down, 1 for up
    rearrange(index, direction){
        let itinLen = this.props.places.length;
        let copyPlaces = [];
        Object.assign(copyPlaces, this.props.places);

        //console.log(index-1);
        //console.log(copyPlaces[index-1]);

        if(direction == 0){
            //swap the selected index and the one below it
            let temp = copyPlaces[(parseInt(index)+1) % itinLen]
            copyPlaces[(parseInt(index)+1) % itinLen] = copyPlaces[index];
            copyPlaces[index] = temp;
        }
        else{
            if(parseInt(index) == 0) {
                //swap the selected index's item and the last item
                let temp = copyPlaces[itinLen-1]
                copyPlaces[itinLen-1] = copyPlaces[index];
                copyPlaces[index] = temp;
            }
            else {
                //swap the selected index and the one above it
                let temp = copyPlaces[index - 1]
                copyPlaces[index - 1] = copyPlaces[index];
                copyPlaces[index] = temp;
            }
        }
        //put new array into the proper area
        this.props.updateItineraryInfo('places', copyPlaces);
    }
}
