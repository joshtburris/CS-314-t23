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
        distance: '',
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
              <div>Determine the distance between the origin and destination.
                Change the units on the <b>Options</b> page.
                Valid formats are as follows with examples, note that only DMS accepts N/S/E/W and it may NOT be comma separated.
                  <table><tbody><tr><td>Decimal Degree</td><td><p>41.40338, 2.17403</p></td></tr>
                      <tr><td>Degrees Decimal Minutes</td><td><p>47°38.938 122° 20.887</p></td></tr>
                  <tr><td>Degrees Minutes Decimal Seconds</td><td><p>41°24'12.2"N 2°10'26.5"E</p></td></tr></tbody></table>
              </div>
        </Pane>
    );
  }

  createInputField(stateVar) {
    let capitalizedCoordinate = stateVar.charAt(0).toUpperCase() + stateVar.slice(1);
    let color = this.validateCoordinates(stateVar) ? "black": "red";
    return (
      <Input name={stateVar}
             placeholder={capitalizedCoordinate}
             id={`${stateVar}${capitalizedCoordinate}`}
             value={this.props.calculatorInput[stateVar]}
             onChange={(e) => this.updateCalculatorInput(stateVar, e.target.value)}
             style={{width: "100%", borderColor: color}} />
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
    if (!this.validateCoordinates("origin") || !this.validateCoordinates("destination")){
        this.setState({
            distance: ''
        });
        return 0;
    }
    const tipConfigRequest = {
      'requestType'        : 'distance',
      'requestVersion'     : 5,
      'origin'      : {'latitude': Parsing.parseCoordinatePair(this.props.calculatorInput.origin).latitude.toString(), 'longitude': Parsing.parseCoordinatePair(this.props.calculatorInput.origin).longitude.toString()},
      'destination' : {'latitude': Parsing.parseCoordinatePair(this.props.calculatorInput.destination).latitude.toString(), 'longitude': Parsing.parseCoordinatePair(this.props.calculatorInput.destination).longitude.toString()},
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

  validateCoordinates(stateVar) {
      return Parsing.validateCoordinates(this.props.calculatorInput[stateVar]);
  }

  updateCalculatorInput(stateVar, value) {
      this.props.updateStateVar('calculatorInput', stateVar, value);
  }

}
