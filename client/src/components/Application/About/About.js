import React, { Component } from 'react'
import { Container, Row, Col, Media } from 'reactstrap'
import InfoPane from './InfoPane'
import Pane from '../Pane'
import KurtImage from '../../../../../team/KurtWimer/Kurt.jpg'
import CalebImg from '../../../../../team/CalebET/Caleb.jpg'
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
                    <InfoPane name='Caleb Tong' image={CalebImg}
                        description={'My full name is Caleb Eddrick Tong Yiu Shywin. I am born and raised overseas, in Malaysia specifically. I am currently studying in '+
                                    'CSU for an undergraduate degree majoring in Computer Science and minoring in Math. I particularly enjoy the seas as that is the kind of '+
                                    'environment I grew up in. I also enjoy reading and some video gaming. My personality is that of an INTP, which apparently have some '+
                                    'shortcomings in the emotional department, (which I do apologise in advance if I do insult you unintentionally) so I hope that you can '+
                                    'bear with me and/or tell me directly what I can do about it.'}/>
                </Row>
                <Row>
                    <InfoPane name='Josh Burris' image={JoshImg}
                        description={'I\'m a Junior at Colorado State University majoring in Computer Science and minoring in '+
                                     'Mathematics. I have a big interest in cyber security that I hope I can pursue after '+
                                     'college. I also love cooking and video games like Skyrim, Red Dead Redemption 2, and '+
                                     'Pokemon Go.'}/>
                </Row>
                <Row>
                    <InfoPane name='Kurt Wimer' image={KurtImage}
                        description={'I am a third year CS Major born and raised in Fort Collins. Currently I work as a teaching '+
                                     'assistant for CS370, Operating Systems. Outside of class I spend my time playing Video Games, '+
                                     'spinning poi, and listening to Music. I am partial to EDM and Rock but enjoy just about every genre from Jazz to Jam Bands.'}/>
                </Row>
                <Row>
                    <InfoPane name='Tim Rooney' image={TimImg}
                        description={'I am a CSU Senior, majoring in Computer Science. I have lived in Longmont, Colorado for most of my life. '+
                                     'In my free time, I enjoy playing video games, chatting with friends, and generally relaxing.'}/>
                </Row>
            </Container>
        );
    }
}
