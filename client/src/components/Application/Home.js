import React, {Component} from 'react';
import {Container, Row, Col} from 'reactstrap';
import ClassMap from './ClassMap';
import Pane from './Pane'

/*
 * Renders the home page.
 */
export default class Home extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col xs={12} sm={12} md={7} lg={8} xl={9}>
                        {this.renderMap()}
                    </Col>
                    <Col xs={12} sm={12} md={5} lg={4} xl={3}>
                        {this.renderIntro()}
                    </Col>
                </Row>
            </Container>
        );
    }

    renderMap() {
        return (
            <Pane header={'Where Am I?'}>
                <ClassMap   currentLocation={this.props.currentLocation}
                            getUserLocationBounds={this.props.getUserLocationBounds}
                            places={this.props.itineraryPlan.places}/>
            </Pane>
        );
    }

    renderIntro() {
        return (
            <Pane header={'Bon Voyage!'}>
                {'Let us help you plan your next trip.'}
            </Pane>
        );
    }

}