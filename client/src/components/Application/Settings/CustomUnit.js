import React, {Component} from 'react'
import { Alert, Button, Input } from 'reactstrap'
import Pane from '../Pane'
import {Container, Row, Col} from 'reactstrap';

export default class CustomUnit extends Component{
    constructor(props) {
        super(props);
        this.state = {
            inputText: '',
            inputNum: '',
            errorMessage: ''
        };
        this.updateInputText = this.updateInputText.bind(this);
        this.updateInputNum = this.updateInputNum.bind(this);
        this.updateUnits = this.updateUnits.bind(this);
        this.header = this.header.bind(this);
        this.example = this.example.bind(this);
        this.addUnits = this.addUnits.bind(this);
    }

    render(){
        /*let myArray = [];
        myArray.push(<Row> <Col> </Col> </Row>)
        myArray.push(<Row> <Col> </Col> </Row>)*/
        return(
            <Pane header={'Units'}>
                {this.state.errorMessage}
                <Container>
                    <Row>
                        {this.header()}
                    </Row>
                    <Row>
                        {this.example()}
                    </Row>
                    {this.generateList()}
                    <Row>
                        {this.addUnits()}
                    </Row>
                </Container>
            </Pane>
        );
    }

    header(){
        return(
            <Container> <Row> <Col xs="5" sm="5" md="5" lg="5" xl="5">
                <b>
                    Unit Name
                </b>
            </Col>
            <Col xs="5" sm="5" md="5" lg="5" xl="5">
                <b>
                    Earth Radius
                </b>
            </Col>
                <Col xs="2" sm="2" md="2" lg="2" xl="2">
            </Col> </Row> </Container>
        );
    }

    example(){
        return(
            <Container> <Row> <Col xs="5" sm="5" md="5" lg="5" xl="5">
                Miles
            </Col>
            <Col xs="5" sm="5" md="5" lg="5" xl="5">
                3959
            </Col>
            <Col xs="2" sm="2" md="2" lg="2" xl="2">
            </Col> </Row> </Container>
        );
    }

    addUnits(){
        return(
            <Container> <Row> <Col xs="5" sm="5" md="5" lg="5" xl="5">
                <Input onChange={this.updateInputText}
                       value={this.state.inputText}
                       placeholder={"Name"}/>
            </Col>
            <Col xs="5" sm="5" md="5" lg="5" xl="5">
                <Input onChange={this.updateInputNum}
                       value={this.state.inputNum}
                       placeholder={"0"}/>
            </Col>
            <Col xs="2" sm="2" md="2" lg="2" xl="2">
                <form onSubmit={this.updateUnits}>
                    <Button type='submit'  color="link" > <b>+</b> </Button>
                </form>
            </Col> </Row> </Container>
        );
    }

    generateList(){
        var mylist = [];
        var unit = '';
        for(unit in this.props.planOptions.units){
            if(unit != 'miles' && unit != 'Nautical Miles' && unit != 'kilometers'){
                mylist.push(
                    <div key={"units_"+unit}>
                        <Row>
                            <Col xs="5" sm="5" md="5" lg="5" xl="5">
                                {unit}
                            </Col>
                            <Col xs="5" sm="5" md="5" lg="5" xl="5">
                                {this.props.planOptions.units[unit]}
                            </Col>
                            <Col xs="2" sm="2" md="2" lg="2" xl="2">
                                <Button type='submit' color="link" onClick={()=>{this.deleteUnits(unit);}} > <b>X</b> </Button>
                    </Col> </Row> </div>);
            }
        }
        return(mylist);
    }

    deleteUnits(unit){
        let temp = this.props.planOptions.units;
        for (let key in this.props.planOptions.units) {
            if (key === unit) {
                delete temp[key];
            }
        }
        this.props.updateStateVar('planOptions', 'units', temp);
        if (temp[unit] === temp[this.props.planOptions.activeUnit]){
            this.props.updateStateVar('planOptions', 'activeUnit', 'miles');
        }
    }

    updateInputText(event) {
        this.setState({inputText: event.target.value})
    }

    updateInputNum(event) {
        this.setState({inputNum: event.target.value})
    }

    updateUnits(unit) {
        unit.preventDefault();
        let flag = true;
        let temp = Number(this.state.inputNum);
        if(isNaN(temp)) {
            this.setState({
                errorMessage: <Alert className='bg-csu-canyon text-white font-weight-extrabold'>Error(0): Invalid input
                    found for earth radius. Please try again.</Alert>
            });
            flag = false;
        }
        else{this.setState({inputNum: Number(temp)})}
        let updatedUnits = Object.assign({}, this.props.planOptions.units);
        updatedUnits[this.state.inputText] = temp;
        this.setState({inputText: '', inputNum: ''});
        console.log(this.state);
        if(flag) {
            this.setState({errorMessage: ''});
            this.props.updateStateVar('planOptions', 'units', updatedUnits);
        }
    }
}