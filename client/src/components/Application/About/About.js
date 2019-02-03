import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import Pane from '../Pane';
import KurtImage from '../../../../../team/KurtWimer/Kurt.jpg'
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
                    <Col xs="9">
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
                  bodyJSX={
                      <div> <Row> <Col xs="3">
                          <img
                              style={{width: 200,height: 200, alignitems: 'center', justifycontent: 'center'}}
                              src={KurtImage}
                          /> </Col>
                          <Col xs="9"> <p>
                              I am a third year CS Major born and raised in Fort Collins. Currently I work as a teaching assistant for CS370, Operating Systems.
                              Outside of class I spend my time playing Video Games, spinning poi, and listening to Music.
                              I am partial to EDM and Rock but enjoy just about every genre from Jazz to Jam Bands.
                          </p> </Col> </Row> </div>
                  }
            />
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