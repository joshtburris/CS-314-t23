import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Container} from 'reactstrap';
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
                optimizations: 'none'
            },
            calculatorInput: {
                origin:'',
                destination:''
            },
            itineraryPlan: {
                places:[],
                distances:[]
            },
            headerOptions: {
                name:true,
                legDistance:true,
                totalDistance:true,
                lat:false,
                lon:false
            },
            clientSettings: {
                serverPort: getOriginalServerPort()
            },
            errorMessage: null,
            currentLocation: {
                lat: 40.576179,
                lon: -105.080773
            }
        };

        this.updateStateVar = this.updateStateVar.bind(this);
        this.updateClientSetting = this.updateClientSetting.bind(this);
        this.createApplicationPage = this.createApplicationPage.bind(this);
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
        if(field === 'serverPort')
            this.setState({clientSettings: {serverPort: value}}, this.updateServerConfig);
        else {
            let newSettings = Object.assign({}, this.state.planOptions);
            newSettings[field] = value;
            this.setState({clientSettings: newSettings});
        }
    }

    updateStateVar(stateVar, option, value) {
        let copy = Object.assign({}, this.state[stateVar]);
        copy[option] = value;
        switch (stateVar) {
            case 'planOptions':
                this.setState({'planOptions': copy});
                break;
            case 'calculatorInput':
                this.setState({'calculatorInput': copy});
                break;
            case 'itineraryPlan':
                this.setState({'itineraryPlan': copy});
                break;
            case 'headerOptions':
                this.setState({'headerOptions': copy});
                break;
        }
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
            return L.latLng(this.state.currentLocation.lat, this.state.currentLocation.lon);
        }
    }

    updateServerConfig() {
        sendServerRequest('config', this.state.clientSettings.serverPort).then(config => {
            console.log(config);
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
                                  createErrorBanner={this.createErrorBanner}
                                  settings={this.state.clientSettings}
                                  serverConfig={this.state.serverConfig}
                                  itineraryPlan={this.state.itineraryPlan}
                                  headerOptions={this.state.headerOptions}
                                  updateStateVar={this.updateStateVar}/>;

            default:
                return <Home  currentLocation={this.state.currentLocation}
                              getUserLocation={this.getUserLocation}/>;
        }
    }

    processConfigResponse(config) {
        if(config.statusCode >= 200 && config.statusCode <= 299) {
            console.log("Switching to server ", this.state.clientSettings.serverPort);
            //validate response
            var ajv = new Ajv();
            var valid = ajv.validate(schema, config.body);
            if (!valid) {
                console.log(ajv.errors);
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
            });
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
}
