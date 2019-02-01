import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import Pane from '../Pane';
import KurtImage from '../../../../../team/KurtWimer/Kurt.jpg'
import CalebImg from '../../../../../team/CalebET/Caleb.jpg'
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
                    <Col xs="3">
                        {this.renderKurtImg()}
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
                  bodyJSX={
                      <div> <Row> <Col xs="3">
                          <img
                          style={{width: 200,height: 200, alignitems: 'center', justifycontent: 'center'}}
                          src={CalebImg}
                          /> </Col>
                            <Col xs="9"> <p>
                                My full name is Caleb Eddrick Tong Yiu Shywin. I am born and raised overseas, in Malaysia specifically. I am currently studying in
                                CSU for an undergraduate degree majoring in Computer Science and minoring in Math. I particularly enjoy the seas as that is the kind of
                                environment I grew up in. I also enjoy reading and some video gaming. My personality is that of an INTP, which apparently have some
                                shortcomings in the emotional department, (which I do apologise in advance if I do insult you unintentionally) so I hope that you can
                                bear with me and/or tell me directly what I can do about it.
                            </p> </Col> </Row> </div>
                          }
                />
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
                  bodyJSX={'I am a third year CS Major born and raised in Fort Collins. Currently I work as a teaching assistant for CS370, Operating Systems.\ ' +
                  'Outside of class I spend my time playing Video Games, spinning poi, and listening to Music./' +
                  'I am partial to EDM and Rock but enjoy just about every genre from Jazz to Jam Bands.'}/>
        );
    }
    renderKurtImg(){
        return(
            <img
                style={{width: 200,height: 200, alignitems: 'center', justifycontent: 'center'}}
                src={KurtImage}
            />
        );
    }


    renderJosh(){
        return(
            <Pane header={'Joshua Burris'}
                  bodyJSX={'Insert biography here...'}/>
        );
    }

    renderKelyn() {
        return (
            <Pane header={'Kelyn Shaffner'}
                  bodyJSX={'I am a Senior at CSU, majoring in ACT, and this is the last class I need to graduate.' +
                  ' I am working full-time while taking this class online. In my free time, I enjoy ' +
                  'playing video games, hanging out with friends, and doing things outdoors. '}/>
        );
    }


}
