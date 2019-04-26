import React, { Component } from 'react'
import { Row, Col, Media } from 'reactstrap'
import Pane from '../Pane'

//Takes name, description, and an image as props
export default class InfoPane extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <Pane header={this.props.name}>
        <Row>
          <Col style={{flex: 1}}>
            <Media style={{maxHeight: 300, maxWidth: 300, flex: 1}} src={this.props.image}/>
          </Col>
          <Col>
            {this.props.description}
          </Col>
        </Row>
      </Pane>
    );
  }
 }