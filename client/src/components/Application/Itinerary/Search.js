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
        this.state = {
            narrow: [{name: "type", values: ['none']}, {name: "iso_country", values: ['none']}],
            searchResultNumber: 0
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
                    <div style={{width: '110px'}}>Choose Filters: </div>
                    <UncontrolledButtonDropdown>
                        <DropdownToggle caret color="primary"> Location Type </DropdownToggle>
                        {this.getDropdownItems()}
                    </UncontrolledButtonDropdown>
                    <UncontrolledButtonDropdown>
                        <DropdownToggle caret color="primary"> Country </DropdownToggle>
                        {this.getDropdownItemsCountry()}
                    </UncontrolledButtonDropdown>
                    </Col> <Col>
                    <div style={{height: '20px'}}/>
                    <Form onSubmit={this.updateTipFindLocation}>
                        <Button outline  color="primary" > <b>Search</b> </Button>
                        <b>{this.getSearchResultNumber()}</b>
                    </Form></Col>
                </Row></Container>
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

    getDropdownItemsCountry(){
        //TODO: Replace smaller list for testing purposes with full list
        //TODO: try to get this to read from the config response
        let countryList = ["AD", "AE", "AF"];
        /*["AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AS","AT","AU","AW","AZ",
            "BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BQ","BR","BS","BT","BW","BY","BZ",
            "CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CR","CU","CV","CW","CX","CY","CZ",
            "DE","DJ","DK", "DM","DO","DZ","EC","EE","EG","EH","ER","ES","ET","FI","FJ","FK","FM","FO","FR",
            "GA","GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GT","GU","GW","GY",
            "HK","HN","HR","HT","HU","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM","JO","JP",
            "KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY",
            "MA","MC","MD","ME","MF","MG","MH","MK","ML","MM","MN","MO","MP","MQ","MS","MT","MU","MV","MW","MX","MY","MZ",
            "NA","NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM",
            "PA","PE","PF","PG","PH","PK","PL","PM","PR","PS","PT","PW","PY","QA","RE","RO","RS","RU","RW",
            "SA","SB","SC","SD","SE","SG","SH","SI","SK","SL","SM","SN","SO","SR","SS","ST","SV","SX","SY","SZ",
            "TC","TD","TF","TG","TH","TJ","TL","TM","TN","TO","TR","TT","TV","TW","TZ",
            "UA","UG","UM","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","XK","YE","YT","ZA","ZM","ZW"];*/

        //TODO: set this.state.narrow to second index ([1]) once the second half of the response stops getting deleted
        return(
            <DropdownMenu>
                {countryList.map((countryItem) =>
                    <DropdownItem
                        color="primary"
                        onClick={()=> {this.checkboxOnClick(countryItem); this.checkState();}}
                        active={this.state.narrow[0].values.includes(countryItem)}>
                        {countryItem}
                    </DropdownItem>
                )}
            </DropdownMenu>
        );
    }

    checkboxOnClick(str){
        const index = this.state.narrow[0].values.indexOf(str);
        if (index < 0) {
            this.state.narrow[0].values.push(str);
        } else {
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
            this.setState({ narrow: [{name: "type", values: [...this.state.narrow[0].values]}] });
            this.updateFindPlaces("narrow", this.state.narrow);
        }
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
            narrow = []
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
        if (keyword.length === 0) return;
        const tipFindConfigRequest = {
            "requestType"    : "find",
            "requestVersion" : 4,
            "match"          : String(keyword),
            "narrow"         : narrow,
            "limit"          : Number(limit),
            "found"          : 0,
            "places"         : []
        };
        sendServerRequestWithBody('find', tipFindConfigRequest, this.props.settings.serverPort)
            .then((response) => {
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    //validate response
                    console.log(response.body);
                    console.log(this.state.narrow);
                    var ajv = new Ajv();
                    var valid = ajv.validate(schemaFind, response.body);
                    console.log(schemaFind);
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
                        errorMessage: null,
                        searchResultNumber: response.body.places.length
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

    getSearchResultNumber() {
        return "\t" + this.state.searchResultNumber.toString() + " results";
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
        let list = [], header = this.getAttributes();
        for (let i in header){
            header[i] = header[i].charAt(0).toUpperCase() + header[i].slice(1);
            list.push(<th key={"findHeader_"+ i}>{header[i]}</th>)
        }
        list.push(<th key={"findHeader_Options"}>{"Options"}</th>)
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
        let tempList = [], temp, attributes = this.getAttributes();
        let name = places[i].name;
        tempList.push(<td key={"placesFound_" + name}>{name}</td>);
        for(let j in attributes){
            if(attributes[j] !== "name" && attributes[j] !== "id"){
                temp = places[i][attributes[j]];
                tempList.push(<td key={"placesFound_"+i+"_"+j}>{temp}</td>);
            }
        }
        console.log(places[i].id, places[i].name, places[i].latitude, places[i].longitude);
        tempList.push(<td key={"placesFoundButton_"+i+temp}><Button type='submit'  color="link" onClick={()=>{this.props.addLocation(places[i].name, Number(places[i].latitude), Number(places[i].longitude))} }> <b>+</b> </Button></td>)
        return tempList;
    }

    getAttributes(){
        let temp = Object.assign({}, this.props.placeAttributes), header = [];
        header.push("name");
        for (let i in temp){
            if (temp[i] !== "name" && temp[i] !== "id") {
                header.push(temp[i]);
            }
        }
        return header;
    }

    getStyle(){
        if (this.props.itineraryPlan.placesFound.length >= 3){
            return({height: '400px', overflowX: 'scroll', overflowY: 'scroll'});
        }
        return({overflowX: 'scroll'});
    }

}