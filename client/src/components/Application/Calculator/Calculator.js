import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Button } from 'reactstrap'
import { Form, Label, Input } from 'reactstrap'
import { sendServerRequestWithBody } from '../../../api/restfulAPI'
import Pane from '../Pane';
import coordinates from 'parse-coords'

export default class Calculator extends Component {
  constructor(props) {
    super(props);

    this.updateLocationOnChange = this.updateLocationOnChange.bind(this);
    this.calculateDistance = this.calculateDistance.bind(this);
    this.createInputField = this.createInputField.bind(this);

    this.state = {
        origin: '',
        originIsValid: true,
        destination: '',
        destinationIsValid: true,
        distance: 0,
        errorMessage: null
    };
  }

  render() {
    return (
      <Container>
        { this.state.errorMessage }
        <Row>
          <Col>
            {this.createHeader()}
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6} md={4} lg={3}>
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
        <Pane header={'Calculator'}
              bodyJSX={<div>Determine the distance between the origin and destination.
                Change the units on the <b>Options</b> page.
              Valid formats are as follows with examplesl, note that only DMS accepts N/S/E/W and it may NOT be comma seperated.
                  <table><tbody><tr><td>Decimal Degree</td><td><p>41.40338, 2.17403</p></td></tr>
                      <tr><td>Degrees Decimal Minutes</td><td><p>47°38.938 122° 20.887</p></td></tr>
                  <tr><td>Degrees Minutes Decimal Seconds</td><td><p>41°24'12.2"N 2°10'26.5"E</p></td></tr></tbody></table>
              </div>}/>
    );
  }

  createInputField(stateVar, location) {
    let updateStateVarOnChange = (event) => {
      this.updateLocationOnChange(stateVar, event.target.value)};

    let capitalizedCoordinate = location.charAt(0).toUpperCase() + location.slice(1);
    let color = this.validateCoordinates(stateVar) ? "black": "red";
    return (
      <Input name={location} placeholder={capitalizedCoordinate}
             id={`${stateVar}${capitalizedCoordinate}`}
             value={this.state[stateVar]}
             onChange={updateStateVarOnChange}
             style={{width: "100%", borderColor: color}} />
    );

  }

  createForm(stateVar) {
    return (
      <Pane header={stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}
            bodyJSX={
              <Form >
                {this.createInputField(stateVar, 'default text')}
              </Form>
            }
      />);
  }

  createDistance() {
    return(
      <Pane header={'Distance'}
            bodyJSX={
              <div>
              <h5>{this.state.distance} {this.props.options.activeUnit}</h5>
              <Button onClick={this.calculateDistance}>Calculate</Button>
            </div>}
      />
    );
  }

  calculateDistance() {
    if (!this.validateCoordinates("origin") || !this.validateCoordinates("destination")) return;
    const tipConfigRequest = {
      'type'        : 'distance',
      'version'     : 2,
      'origin'      : {'latitude': coordinates(this.state.origin).lat, 'longitude': coordinates(this.state.origin).lng},
      'destination' : {'latitude': coordinates(this.state.destination).lat, 'longitude': coordinates(this.state.destination).lng},
      'earthRadius' : this.props.options.units[this.props.options.activeUnit]
    };

    sendServerRequestWithBody('distance', tipConfigRequest, this.props.settings.serverPort)
      .then((response) => {
        if(response.statusCode >= 200 && response.statusCode <= 299) {
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

  validateCoordinates(statevar){
    try {
        if(!coordinates(this.state[statevar]) || !coordinates(this.state[statevar]).lat || !coordinates(this.state[statevar]).lng){
            return false;
        }
        else return true;    
    }  
    catch (e) {
        return false;
    }
  }

  updateLocationOnChange(stateVar, value) {
      this.setState({[stateVar]: value}, () => {this.calculateDistance()});
  }
}
