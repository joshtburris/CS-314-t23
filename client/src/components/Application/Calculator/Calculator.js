import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Form,  Input } from 'reactstrap';
import { sendServerRequestWithBody } from '../../../api/restfulAPI';
import Pane from '../Pane';
import Ajv from 'ajv';
import schema from './TIPDistanceSchema';
import Parsing from '../Parsing';

export default class Calculator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            distance: '0',
            errorMessage: null,
        };

        this.calculateDistance();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.calculatorInput !== this.props.calculatorInput){
            this.calculateDistance();
        }
    }

    render() {
        return (
          <Container>
            { this.state.errorMessage }
            <Row> <Col>
                {this.createHeader()}
            </Col> </Row>
            <Row> <Col xs={12} sm={6} md={4} lg={3}>
                {this.createForm('origin')}
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
                {this.createForm('destination')}
             </Col>
             <Col xs={12} sm={6} md={4} lg={3}>
                {this.createDistance()}
            </Col>
            </Row>
        </Container>
        );
    }

    createHeader() {
        return (
            <Pane header={'Calculator'}>
                <div><p>Determine the distance between the origin and destination.</p>
                    <p>Change the units on the <b>Options</b> page.</p>
                    Examples
                    <table><tbody><tr><td><p>Decimal Degree</p></td><td>41.40338, 2.17403</td></tr>
                    <tr><td><p>Degrees Decimal Minutes</p></td><td>47°38.938 122° 20.887</td></tr>
                    <tr><td><p>Degrees Minutes Decimal Seconds</p></td><td>41°24'12.2"N 2°10'26.5"E</td></tr></tbody></table>
                </div>
            </Pane>
        );
    }

    createInputField(stateVar) {
        let capitalizedCoordinate = stateVar.charAt(0).toUpperCase() + stateVar.slice(1);
        return (
            <Input name={stateVar}
                   placeholder={capitalizedCoordinate}
                   id={`${stateVar}${capitalizedCoordinate}`}
                   value={this.props.calculatorInput[stateVar]}
                   onChange={(e) => this.updateCalculatorInput(stateVar, e.target)}
                   style={{width: "100%", borderColor: "black"}} />
        );
    }

    createForm(stateVar) {
        return (
        <Pane header={stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}>
            <Form>
                {this.createInputField(stateVar)}
            </Form>
        </Pane>
        );
    }

    createDistance() {
        return(
        <Pane header={'Distance'}>
            <div>
                <h5>{this.state.distance} {this.props.options.activeUnit}</h5>
            </div>
        </Pane>
        );
    }

  calculateDistance() {
    if (    !Parsing.validateCoordinates(this.props.calculatorInput["origin"])
        ||  !Parsing.validateCoordinates(this.props.calculatorInput["destination"])) {
        return 0;
    }
    let origin = Parsing.parseCoordinatePair(this.props.calculatorInput.origin);
    let destination = Parsing.parseCoordinatePair(this.props.calculatorInput.destination);
    const tipConfigRequest = {
        'requestType'        : 'distance',
        'requestVersion'     : 5,
        'origin'      : {'latitude': origin.latitude.toString(), 'longitude': origin.longitude.toString()},
        'destination' : {'latitude': destination.latitude.toString(), 'longitude': destination.longitude.toString()},
        'earthRadius' : this.props.options.units[this.props.options.activeUnit]
    };

    sendServerRequestWithBody('distance', tipConfigRequest, this.props.settings.serverPort)
      .then((response) => {
        if(response.statusCode >= 200 && response.statusCode <= 299) {
            //validate response
            var ajv = new Ajv();
            var valid = ajv.validate(schema, response.body);
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
            distance: response.body.distance,
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

    updateCalculatorInput(stateVar, target) {
        this.props.updateStateVar('calculatorInput', stateVar, target.value);
        target.style.borderColor = (Parsing.validateCoordinates(target.value)) ? "black" : "red";
    }

}
