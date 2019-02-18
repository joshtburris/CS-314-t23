import React, {Component} from 'react';
import {Container, Row, Col} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { Map, Marker, Popup, TileLayer} from 'react-leaflet';
import Pane from './Pane'
import Itinerary from "./Itinerary/Itinerary"
import Units from "./Options/Options";

/*
 * Renders the home page.
 */
export default class Home extends Component {
    constructor(props){
        super(props);

        this.userLocationCoordinates = this.userLocationCoordinates.bind(this);
        this.handleFiles = this.handleFiles.bind(this);

        this.state={
            currentLocation: {
                lat: 40.576179,
                lon: -105.080773
            }
        }
    }
  render() {
    return (
      <Container>
        <Row>
          <Col xs={12} sm={12} md={7} lg={8} xl={9}>
            {this.renderMap()}
          </Col>
          <Col xs={12} sm={12} md={5} lg={4} xl={3}>
            <Row> <Col>
              {this.renderIntro()}
            </Col> </Row>
            <Row> <Col>
              {this.renderItinerary()}
            </Col> </Row>
          </Col>
        </Row>
      </Cont  ainer>
    );
  }

    renderMap() {
        return (
            <Pane header={'Where Am I?'}
                  bodyJSX={this.renderLeafletMap()}/>
        );
    }

    renderLeafletMap() {
        // initial map placement can use either of these approaches:
        // 1: bounds={this.coloradoGeographicBoundaries()}
        // 2: center={this.csuOvalGeographicCoordinates()} zoom={10}
        return (
            <Map center={this.userLocationCoordinates()} zoom={10}
                 style={{height: 500, maxwidth: 700}}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                           attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <Marker position={this.userLocationCoordinates()}
                        icon={this.markerIcon()}>
                    <Popup className="font-weight-extrabold">Colorado State University</Popup>
                </Marker>
            </Map>
        )
    }

    renderIntro() {
        return(
            <Pane header={'Bon Voyage!'}
                  bodyJSX={'Let us help you plan your next trip.'}/>
        );
    }

  /*<button onClick={this.handleUpload}>Upload</button>*/

  renderItinerary(){
    return(
      <Pane header={'Upload an Itinerary'}
            bodyJSX={
                <div className="App">
                    <input type="file" name="" id="input" onChange={this.handleFiles} />
                </div>
            }/>
      );
  }

  handleFiles(){

      let fileReader;

      const handleFileRead = (e) => {
          const content = fileReader.result;
          this.setState({
              fileContents: content,
          });
      }

      fileReader = new FileReader();
      fileReader.onloadend = handleFileRead;
      fileReader.readAsText(event.target.files[0]);
  }

    coloradoGeographicBoundaries() {
        // northwest and southeast corners of the state of Colorado
        return L.latLngBounds(L.latLng(41, -109), L.latLng(37, -102));
    }

    csuOvalGeographicCoordinates() {
        return L.latLng(40.576179, -105.080773);
    }

    userLocationCoordinates() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                loc => {
                    console.log(loc.coords.latitude);
                    console.log(loc.coords.longitude);
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

    markerIcon() {
        // react-leaflet does not currently handle default marker icons correctly,
        // so we must create our own
        return L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow,
            iconAnchor: [12,40]  // for proper placement
        })
    }
}
