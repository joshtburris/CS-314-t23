import React, { Component } from 'react'
import {sendServerRequestWithBody} from "../../../api/restfulAPI";


export default class Itinerary extends Component {
    constructor(props) {
        super(props);

        this.state={
            'options'        : {title: "null", earthRadius: this.props.options.units[this.props.options.activeUnit]},
            'places'         : [],
            'distances'      : []
        }
    }

    render(){

    }

    addElement(id){

    }

    removeElement(id){

    }

    saveFile(){

    }

    loadLoadFile(){

    }

    calculateDistances() {
        const tipConfigRequest = {
            'type'        : 'itinerary',
            'version'     : 2,
            'options'      : this.state.options,
            'places' : this.state.places,
        };

        sendServerRequestWithBody('itinerary', tipConfigRequest, this.props.settings.serverPort)
            .then((response) => {
                if(response.statusCode >= 200 && response.statusCode <= 299) {
                    this.setState({
                        distances: response.body.distances,
                        errorMessage: null
                    });
                }
                else {
                    this.setState({
                        errorMessage: this.props.createErrorBanner(
                            response.statusText,
                            response.statusCode,
                            `Request to ${ this.props.settings.serverPort } failed: invalid input.`
                        )
                    });
                }
            });
    }
}
