import React, {Component} from 'react'
import {Container, Row, Col} from 'reactstrap'
import Pane from '../Pane'
import Units from './Units';
import Optimizations from '../Itinerary/Optimizations'

/* Options allows the user to change the parameters for planning
 * and rendering the trip map and itinerary.
 * The options reside in the parent object so they may be shared with the Distance object.
 * Allows the user to set the options used by the application via a set of buttons.
 */
export default class Options extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    return(
        <Container>
          <Row>
            <Col xs="12">
              {this.heading()}
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="12" md="6" lg="4" xl="3">
              <Units options={this.props.options}
                     activeUnit={this.props.options.activeUnit}
                     updateStateVar={this.props.updateStateVar}/>
            </Col>
          </Row>
        </Container>
    )
  }


  heading() {
    return (
        <Pane header={'Options'}>
            <p>Select a preferred distance unit.</p>
            <p>To make a custom unit (e.g. millimeters), got to the <b>⚙</b> page.</p>
        </Pane>
    );
  }

}
