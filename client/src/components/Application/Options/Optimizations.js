import {Button, ButtonGroup, Card, CardBody, CardHeader} from "reactstrap";
import React, {Component} from 'react'

export default class Optimizations extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Card className='text-center'>
                <CardHeader className='bg-csu-gold text-white font-weight-semibold'>Optimizations</CardHeader>
                <CardBody>
                    <ButtonGroup vertical className='w100'>
                        {this.renderOptButtons()}
                    </ButtonGroup>
                </CardBody>
            </Card>
        );
    }


    renderOptButtons() {
        return this.props.optimizations.map( (opt) =>
            <Button
            className='btn-csu w-100 text-left'
            key={"button_" + opt}
            active={this.props.activeOpt === opt}
            value={opt}
            onClick={(event) => this.props.updateStateVar('planOptions', 'optimizations', event.target.value)}
            >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </Button>
        )
    }
}