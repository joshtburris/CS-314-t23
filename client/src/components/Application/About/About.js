import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import Pane from '../Pane';

/*
Information about the members of t23. (Name, 1 paragraph bio and pic)
*/

export default class About extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col xs="12">
                        {this.renderCaleb()}
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        {this.renderJosh()}
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        {this.renderKelyn()}
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        {this.renderKurt()}
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        {this.renderTim()}
                    </Col>
                </Row>
            </Container>
        );
    }

    renderCaleb(){
        return(
            <Pane header={'Caleb Tong'}
                  bodyJSX={'Insert biography here...'}/>
        );
    }

    renderTim(){
        return(
            <Pane header={'Timothy Rooney'}
                  bodyJSX={'Insert biography here...'}/>
        );
    }

    renderKurt(){
        return(
            <Pane header={'Kurt Wimer'}
                  bodyJSX={'Insert biography here...'}/>
        );
    }

    renderJosh(){
        return(
            <Pane header={'Joshua Burris'}
                  bodyJSX={'Insert biography here...'}/>
        );
    }

    renderKelyn(){
        return(
            <Pane header={'Kelyn Shaffner'}
                  bodyJSX={'Insert biography here...'}/>
        );
    }

}