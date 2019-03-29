import React, {Component} from 'react';
import {Container, Row, Col} from 'reactstrap';
import Interop from './Interop';
import CustomUnit from './CustomUnit'
import Pane from '../Pane';

/**
 * The Settings component.
 * This component is responsible for managing global client settings, such as
 * the server and default options.
 */
export default class Settings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Row>
          <Col xs="12">
            {this.heading()}
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="12" md="6" lg="4" xl="3">
            <Interop serverPort={this.props.settings.serverPort}
                     serverConfig={this.props.serverConfig}
                     updateSetting={this.props.updateSetting}/>
          </Col>
          <Col xs="12" sm="12" md="10" lg="8" xl="6">
              <CustomUnit updateStateVar={this.props.updateStateVar}
                          updateSetting={this.props.updateSetting}
                          planOptions={this.props.planOptions}/>
          </Col>
        </Row>
      </Container>
    );
  }


  heading() {
    return (
        <Pane header={'Settings'}>
            {'Change global client settings...'}
        </Pane>
    );
  }

}
