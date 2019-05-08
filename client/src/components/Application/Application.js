import React, {Component} from 'react';
import {Container} from 'reactstrap';
import {getOriginalServerPort, sendServerRequest} from '../../api/restfulAPI';
import Home from './Home';
import Options from './Options/Options';
import About from './About/About'
import Calculator from './Calculator/Calculator';
import Settings from './Settings/Settings';
import ErrorBanner from './ErrorBanner';
import Itinerary from "./Itinerary/Itinerary";
import Ajv from 'ajv'
import schema from './TIPConfigSchema';


/* Renders the application.
 * Holds the destinations and options state shared with the trip.
 */
export default class Application extends Component {
  constructor(props) {
    super(props);

        this.state = {
            serverConfig: null,
            planOptions: {
                units: {'miles':3959,'Nautical Miles':3440, 'kilometers':6371},
                activeUnit: 'miles',
                optimization: 'none'
            },
            calculatorInput: {
                origin:'',
                destination:''
            },
            itineraryPlan: {
                places:[],
                placesFound: [],
                distances:[],
                markers:{},
                match: '',
                limit: 0,
                narrow: [{name: "type", values: ["none"]}]
            },
            headerOptions: {
                name:true,
                legDistance:true,
                totalDistance:true,
                latitude:false,
                longitude:false
            },
            clientSettings: {
                serverPort: getOriginalServerPort()
            },
            errorMessage: null,
            currentLocation: {
                lat: 40.576179,
                lon: -105.080773
            },
            nextPlaceID: "0"
        };

        this.updateStateVar = this.updateStateVar.bind(this);
        this.setStateVar = this.setStateVar.bind(this);
        this.getNextPlaceID = this.getNextPlaceID.bind(this);
        this.updateClientSetting = this.updateClientSetting.bind(this);
        this.getUserLocation = this.getUserLocation.bind(this);

        this.updateServerConfig();
        this.getUserLocation();
    }

    render() {
        let pageToRender = this.state.serverConfig ? this.props.page : 'settings';

        return (
            <div className='application-width'>
                { this.state.errorMessage }{ this.createApplicationPage(pageToRender) }
            </div>
        );
    }

    updateClientSetting(field, value) {
        if (field === 'serverPort')
            this.setState({clientSettings: {serverPort: value}}, this.updateServerConfig);
        else {
            this.updateStateVar("planOptions", field, value);
        }
    }

    //Use to overwrite a sub-field of a stateVar
    updateStateVar(stateVar, option, value) {
        let copy = Object.assign({}, this.state[stateVar]);
        copy[option] = value;
        this.setState({[stateVar]: copy});
    }

    //Use to overwrite an entire stateVar
    setStateVar(stateVar, value) {
        this.setState({[stateVar]: value});
    }

    getNextPlaceID() {
        let nextID = this.state.nextPlaceID;
        this.setState({
            nextPlaceID: (parseInt(nextID)+1).toString()
        });
        return nextID;
    }

    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                loc => {
                    this.setState({
                        currentLocation: {
                            lat: loc.coords.latitude,
                            lon: loc.coords.longitude
                        }
                    });
                });
            //return L.latLng(this.state.currentLocation.lat, this.state.currentLocation.lon);
            return (L.latLngBounds(L.latLng(((this.state.currentLocation.lat -0.05) * 100) /100, ((this.state.currentLocation.lon-0.05) * 100) / 100),
                    L.latLng(((this.state.currentLocation.lat +0.05) * 100) /100, ((this.state.currentLocation.lon + 0.05) * 100) / 100)));
        }
    }

    updateServerConfig() {
        sendServerRequest('config', this.state.clientSettings.serverPort).then(config => {
            this.processConfigResponse(config);
        });
    }

    createErrorBanner(statusText, statusCode, message) {
        return (
            <ErrorBanner statusText={statusText}
                         statusCode={statusCode}
                         message={message}/>
        );
    }

    createApplicationPage(pageToRender) {
        switch(pageToRender) {
            case 'calc':
                return <Calculator options={this.state.planOptions}
                                   settings={this.state.clientSettings}
                                   createErrorBanner={this.createErrorBanner}
                                   calculatorInput={this.state.calculatorInput}
                                   updateStateVar={this.updateStateVar}/>;
            case 'options':
                return <Options options={this.state.planOptions}
                                config={this.state.serverConfig}
                                updateStateVar={this.updateStateVar}/>;
            case 'settings':
                return <Settings planOptions={this.state.planOptions}
                                 settings={this.state.clientSettings}
                                 serverConfig={this.state.serverConfig}
                                 updateSetting={this.updateClientSetting}
                                 updateStateVar={this.updateStateVar}/>;
            case 'about':
                return <About/>;
            case 'itinerary':
                return <Itinerary options={this.state.planOptions}
                                  config={this.state.serverConfig}
                                  settings={this.state.clientSettings}
                                  serverConfig={this.state.serverConfig}
                                  createErrorBanner={this.createErrorBanner}
                                  itineraryPlan={this.state.itineraryPlan}
                                  headerOptions={this.state.headerOptions}
                                  updateStateVar={this.updateStateVar}
                                  setStateVar={this.setStateVar}
                                  getNextPlaceID={this.getNextPlaceID}/>;

            default:
                return <Home  currentLocation={this.state.currentLocation}
                              getUserLocation={this.getUserLocation}
                              itineraryPlan={this.state.itineraryPlan}/>;
        }
    }

    processConfigResponse(config) {
        if (config.statusCode >= 200 && config.statusCode <= 299) {
            //validate response
            var ajv = new Ajv();
            var valid = ajv.validate(schema, config.body);
            console.log(config);
            if (!valid) {
                this.setState({
                    serverConfig: null,
                    errorMessage:
                        <Container>
                            {this.createErrorBanner(config.statusText, config.statusCode,
                                `Invalid config from ${ this.state.clientSettings.serverPort}. Please choose a valid server.`)}
                        </Container>
                });
                return;
            }
            this.setState({
                serverConfig: config.body,
                errorMessage: null
            }, this.processPlaceAttributes);
        }
        else {
            this.setState({
                serverConfig: null,
                errorMessage:
                    <Container>
                        {this.createErrorBanner(config.statusText, config.statusCode,
                            `Failed to fetch config from ${ this.state.clientSettings.serverPort}. Please choose a valid server.`)}
                    </Container>
            });
        }
    }

    processPlaceAttributes(){
        if (this.state.serverConfig == null) return; //what to do?
        let attributes = {};
        for (let att of this.state.serverConfig.placeAttributes) {
            let key = att.toString()
            Object.assign(attributes, {[att.toString()]:false})
        }
        Object.assign(attributes, this.state.headerOptions);
        this.setState({headerOptions: attributes});
    }
}
