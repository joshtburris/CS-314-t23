import React, { Component } from 'react';
import {Alert, Container, Row, Col, Button, Input, Form, Table,
    UncontrolledButtonDropdown, DropdownToggle, DropdownMenu , DropdownItem} from 'reactstrap';
import Ajv from 'ajv';
import schemaFind from './ItineraryTIPFindSchema';
import Pane from "../Pane";
import {sendServerRequestWithBody} from "../../../api/restfulAPI";

export default class Itinerary extends Component {
    constructor(props){
        super(props);
        this.state={
            narrow: [{name: "type", values: ['none']}]
        };
        this.updateTipFindLocation = this.updateTipFindLocation.bind(this);
        this.checkboxOnClick = this.checkboxOnClick.bind(this);
    }

    render(){
        return(
            <Pane header={'Search'}>
                <Container> { this.state.errorMessage } <Row>
                    <Col>
                        <div style={{width: '110px'}}>Insert keyword:</div>
                        {this.createInputFields('match', 'Search...')}
                    </Col> <Col>
                    <div style={{width: '100px'}}>Insert Limit:</div>
                    {this.createInputFields('limit', 'i.e. 10')}
                </Col> <Col>
                    <div style={{width: '100px'}}>Input Filters: </div>
                    <UncontrolledButtonDropdown>
                        <DropdownToggle caret color="primary"> Filters </DropdownToggle>
                        {this.getDropdownItems()}
                    </UncontrolledButtonDropdown>
                </Col> <Col>
                    <div style={{height: '20px'}}/>
                    <Form onSubmit={this.updateTipFindLocation}>
                        <Button outline  color="primary" > <b>Search</b> </Button>
                    </Form>
                </Col></Row></Container>
                {/*console.log(this.props.itineraryPlan)*/}
                {/*console.log(this.state.filter)*/}
                <Container><Row>
                    {this.TipFindTable()}
                </Row> </Container>
            </Pane>
        );
    }

    getDropdownItems(){
        return(
            <DropdownMenu>
                <DropdownItem color="primary" onClick={()=> {this.checkboxOnClick('airport'); this.checkState();}} active={this.state.narrow[0].values.includes('airport')}>Airport</DropdownItem>
                <DropdownItem color="primary" onClick={()=> {this.checkboxOnClick('heliport');this.checkState();}} active={this.state.narrow[0].values.includes('heliport')}>Heliport</DropdownItem>
                <DropdownItem color="primary" onClick={()=> {this.checkboxOnClick('balloonport');this.checkState();}} active={this.state.narrow[0].values.includes('balloonport')}>Balloonport</DropdownItem>
            </DropdownMenu>
        );
    }

    checkboxOnClick(str){
        const index = this.state.narrow[0].values.indexOf(str);
        if (index < 0) {
            this.state.narrow[0].values.push(str);
            this.state.narrow[0].values.push(str);
        } else {
            this.state.narrow[0].values.splice(index, 1);
            this.state.narrow[0].values.splice(index, 1);
        }
        if(this.state.narrow[0].values.indexOf('none') > -1) {
            this.state.narrow[0].values.splice(this.state.narrow[0].values.indexOf('none'), 1);
        }
        this.setState({ narrow: [{name: "type", values: [...this.state.narrow[0].values]}] });
        this.updateFindPlaces("narrow", this.state.narrow);
    }

    checkState(){
        if(this.state.narrow[0].values.length === 0){
            this.state.narrow[0].values.push("none");
        }
        this.setState({ narrow: [{name: "type", values: [...this.state.narrow[0].values]}] });
        this.updateFindPlaces("narrow", this.state.narrow);
    }

    createInputFields(stateVar, placeHolder){
        return (
            <Input name={stateVar} placeholder={placeHolder}
                   id={`${stateVar}${placeHolder}`}
                   value={this.props.itineraryPlan[stateVar]}
                   onChange={(e) => this.updateFindPlaces(stateVar, e.target.value)}/>
        );
    }

    updateFindPlaces(stateVar, value){
        this.props.updateStateVar('itineraryPlan', stateVar, value);
    }

    updateTipFindLocation(unit){
        unit.preventDefault();
        let flag = true, keyword = this.props.itineraryPlan.match, limit = this.props.itineraryPlan.limit, narrow = Object.assign(this.props.itineraryPlan.narrow);
        if(narrow.length === 1 && narrow[0].values.indexOf('none') > -1){
            narrow[0].values = ["airport", "heliport", "balloonport"]
        }
        if(keyword.length === 0){
            this.setState({
                errorMessage: <Alert className='bg-csu-canyon text-white font-weight-extrabold'>Error(0): Invalid input
                    found. Please enter a valid keyword for search.</Alert>
            });
            flag = false;
        }
        else{this.setState({errorMessage: ''});}
        if(flag){
            this.tipFindLocation(keyword, limit, narrow);
        }
    }

    tipFindLocation(keyword, limit, narrow){
        if(keyword.length === 0) return;
        const tipFindConfigRequest = {
            'requestType'    : 'find',
            'requestVersion' : 4,
            'match'          : keyword,
            'narrow'         : narrow,
            'limit'          : Number(limit),
            'found'          : 0,
            'places'         : []
        };
        sendServerRequestWithBody('find', tipFindConfigRequest, this.props.settings.serverPort)
            .then((response) => {
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    //validate response
                    console.log(response);
                    var ajv = new Ajv();
                    var valid = ajv.validate(schemaFind, response.body);
                    if (!valid) {
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
                    this.props.updateStateVar('itineraryPlan', 'placesFound', response.body.places);
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

    TipFindTable(){
        let placesFound = Object.assign({},this.props.itineraryPlan.placesFound);
        return(
            <div style={this.getStyle()}> <Table hover>
                <thead><tr>{this.generateFindLocationsHeaders()}</tr></thead>
                <tbody>{this.generateFindLocationsList(placesFound)}</tbody>
            </Table> </div>
        );
    }

    generateFindLocationsHeaders(){
        let header = ["Name", "Latitude", "Municipality", "Type", "Longitude", "Options"];
        let list = [];
        for (let i in header){
            list.push(<th key={"findHeader_"+ i}>{header[i]}</th>)
        }
        return list;
    }

    generateFindLocationsList(places){
        let list = [];
        for(let i in places){
            list.push( <tr key={"TipFindRow_"+i}>{this.findLocationsCol(places, i)}</tr> );
        }
        return list;
    }

    findLocationsCol(places, i){
        let tempList = [];
        let temp;
        let name = places[i].name;
        tempList.push(<td key={"placesFound_" + name}>{name}</td>);
        for(let j in places[i]){
            if(j !== "name" && j !== "id"){
                temp = places[i][j];
                tempList.push(<td key={"placesFound_"+i+"_"+temp}>{temp}</td>);
            }
        }
        console.log(places[i].id, places[i].name, places[i].latitude, places[i].longitude);
        tempList.push(<td key={"placesFoundButton_"+i+temp}><Button type='submit'  color="link" onClick={()=>{this.props.addLocation(places[i].name, Number(places[i].latitude), Number(places[i].longitude))} }> <b>+</b> </Button></td>)
        return tempList;
    }

    getStyle(){
        if (this.props.itineraryPlan.placesFound.length >= 3){
            return({height: '400px', overflowX: 'scroll', overflowY: 'scroll'});
        }
        return({overflowX: 'scroll'});
    }

}