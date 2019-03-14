import React, { Component } from 'react'
import { Container, Row, Col, Media } from 'reactstrap'
import Pane from '../Pane';
import KurtImage from '../../../../../team/KurtWimer/Kurt.jpg'
import CalebImg from '../../../../../team/CalebET/Caleb.jpg'
import KelynImage from '../../../../../team/kshaffner/Kelyn.jpg'
import JoshImg from '../../../../../team/joshtburris/Josh.jpg'
import TimImg from '../../../../../team/tprooney/TimImage.jpg'
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
                    {this.renderCaleb()}
                </Row>
                <Row>
                    {this.renderJosh()}
                </Row>
                <Row>
                    {this.renderKurt()}
                </Row>
                <Row>
                    {this.renderTim()}
                </Row>
            </Container>
        );
    }
//gSize={3} smSize={12} mdSize={12}
    renderCaleb(){
        return(
            <Pane header={'Caleb Tong'}>
                      <Row>
                        <Col style={{flex: 1}}>
                            <Media style={{maxHeight: 300, maxWidth: 300, flex: 1}} src={CalebImg}/>
                        </Col>
                        <Col>
                              My full name is Caleb Eddrick Tong Yiu Shywin. I am born and raised overseas, in Malaysia specifically. I am currently studying in
                              CSU for an undergraduate degree majoring in Computer Science and minoring in Math. I particularly enjoy the seas as that is the kind of
                              environment I grew up in. I also enjoy reading and some video gaming. My personality is that of an INTP, which apparently have some
                              shortcomings in the emotional department, (which I do apologise in advance if I do insult you unintentionally) so I hope that you can
                              bear with me and/or tell me directly what I can do about it.
                        </Col>
                      </Row>
            </Pane>
        );
    }


    renderTim(){
        return(
            <Pane header={'Timothy Rooney'}>
                      <Row>
                          <Col style={{flex: 1}}>
                             <Media style={{maxHeight: 300, maxWidth: 300, flex: 1}} src={TimImg}/>
                          </Col>
                          <Col style={{flexWrap: 'wrap'}}>
                              I am a CSU Senior, majoring in Computer Science. I have lived in Longmont, Colorado for most of my life.
                              In my free time, I enjoy playing video games, chatting with friends, and generally relaxing.
                          </Col>
                      </Row>
            </Pane>
        );
    }

    renderKurt() {
        return (
            <Pane header={'Kurt Wimer'}>
                      <Row>
                          <Col style={{flex: 1}}>
                            <Media style={{maxHeight: 300, maxWidth: 300, flex: 1}} src={KurtImage}/>
                          </Col>
                          <Col>
                              I am a third year CS Major born and raised in Fort Collins. Currently I work as a teaching
                              assistant for CS370, Operating Systems.
                              Outside of class I spend my time playing Video Games, spinning poi, and listening to
                              Music.
                              I am partial to EDM and Rock but enjoy just about every genre from Jazz to Jam Bands.
                          </Col>
                      </Row>
            </Pane>
        );
    }


    renderJosh(){
        return(
            <Pane header={'Joshua Burris'}>
                      <Row>
                        <Col style={{flex: 1}}>
                          <Media style={{maxHeight: 300, maxWidth: 300, flex: 1}} src={JoshImg}/>
                        </Col>
                        <Col>
                          I'm a Junior at Colorado State University majoring in Computer Science and minoring in
                          Mathematics. I have a big interest in cyber security that I hope I can pursue after
                          college. I also love cooking and video games like Skyrim, Red Dead Redemption 2, and
                          Pokemon Go.
                         </Col>
                      </Row>
            </Pane>
        );
    }

}
