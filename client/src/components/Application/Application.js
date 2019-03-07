import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Container} from 'reactstrap';

import Home from './Home';
import Options from './Options/Options';
import About from './About/About'
import Calculator from './Calculator/Calculator';
import Settings from './Settings/Settings';
import {getOriginalServerPort, sendServerRequest} from '../../api/restfulAPI';
import ErrorBanner from './ErrorBanner';
import Itinerary from "./Itinerary/Itinerary";


/* Renders the application.
 * Holds the destinations and options state shared with the trip.
 */
export default class Application extends Component {
  constructor(props){
    super(props);

    this.state = {
      serverConfig: null,
      planOptions: {
        units: {'miles':3959,'Nautical Miles':3440, 'kilometers':6371},
        activeUnit: 'miles' // This is where we will automatically update the units based on user location.
      },
      calculatorInput: {
        origin:'',
        destination:''
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

    this.updateCalculatorInput = this.updateCalculatorInput.bind(this);
    this.updatePlanOption = this.updatePlanOption.bind(this);
    this.updateClientSetting = this.updateClientSetting.bind(this);
    this.createApplicationPage = this.createApplicationPage.bind(this);
    this.updateServerConfig();
    this.getUserLocation();
    this.getUserLocation = this.getUserLocation.bind(this);
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

  updatePlanOption(option, value) {
    let optionsCopy = Object.assign({}, this.state.planOptions);
    optionsCopy[option] = value;
    this.setState({'planOptions': optionsCopy});
  }

  updateCalculatorInput(option, value){
    let inputCopy = Object.assign({}, this.state.calculatorInput);
    inputCopy[option] = value;
    this.setState({'calculatorInput': inputCopy});
  }

  getUserLocation(){
      if(navigator.geolocation) {
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
                           updateCalculatorInput={this.updateCalculatorInput}/>;
      case 'options':
        return <Options options={this.state.planOptions}
                        config={this.state.serverConfig}
                        updateOption={this.updatePlanOption}/>;
      case 'settings':
        return <Settings planOptions={this.state.planOptions}
                         settings={this.state.clientSettings}
                         serverConfig={this.state.serverConfig}
                         updateSetting={this.updateClientSetting}
                         updateOption={this.updatePlanOption}/>;
      case 'about':
        return <About/>;
      case 'itinerary':
        return <Itinerary options={this.state.planOptions}
                          createErrorBanner={this.createErrorBanner}
                          settings={this.state.clientSettings}
                          serverConfig={this.state.serverConfig}/>;

      default:
        return <Home  currentLocation={this.state.currentLocation}
                      getUserLocation={this.getUserLocation}/>;
    }
  }

  processConfigResponse(config) {
    if(config.statusCode >= 200 && config.statusCode <= 299) {
      console.log("Switching to server ", this.state.clientSettings.serverPort);
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
