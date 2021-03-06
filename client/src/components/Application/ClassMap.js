import 'leaflet/dist/leaflet.css';
import React, {Component} from 'react';
import Saver from './Itinerary/Saver';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {Map, TileLayer, Polyline, Marker, Popup} from "react-leaflet";

export default class classMap extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(this.renderLeafletMap());
    }

    renderLeafletMap() {
        // initial map placement can use either of these approaches:
        // 1: bounds={this.coloradoGeographicBoundaries()}
        // 2: center={this.csuOvalGeographicCoordinates()} zoom={10}
        // L.latLng(40.576179, -105.080773)
        let corner1 = L.latLng(40.076179, -105.580773),
            corner2 = L.latLng(41.076179, -104.580773),
            c_location;
        if (this.props.getUserLocationBounds === undefined) {c_location = L.latLngBounds([corner1, corner2]);}
        else {c_location = this.props.getUserLocationBounds()}
        return (
            <Map maxBounds={L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180))}
                 minZoom={1.15}
                 bounds={this.checkForBounds(c_location)}
                 style={{height: 400, maxwidth: 700}}
                 id={'map'}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                           attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {this.getPolylines()}
                {this.renderHomeMarker()}
                {this.renderMarkers(this.props.places)}
            </Map>
        )
    }

    checkForBounds(currentBounds){
        if(this.props.currentLocation === undefined){
            let bounds = this.getBounds();
            return bounds;
        }
        return currentBounds;
    }

    getBounds() {
        if(this.props.places.length === 0){
            // northwest and southeast Itinerary-Map corners of the state of Colorado
            return L.latLngBounds(L.latLng(41, -109), L.latLng(37, -102));
        }
        if(this.props.places.length === 1){
            return this.getSingleLoc();
        }
        let tLat = [];
        let tLon = [];
        for(let place in this.props.places) {
            tLat.push(this.props.places[place].latitude);
            tLon.push(this.props.places[place].longitude);
        }
        let maxLat = Math.max.apply(null, tLat);let maxLon = Math.max.apply(null, tLon);
        let minLat = Math.min.apply(null, tLat);let minLon = Math.min.apply(null, tLon);
        if (maxLat == minLat){
            return this.getSingleLoc();
        }
        return L.latLngBounds(L.latLng(minLat, minLon), L.latLng(maxLat, maxLon));
    }

    getSingleLoc() {
        let locLat = parseFloat(this.props.places[0].latitude);
        let locLon = parseFloat(this.props.places[0].longitude);
        return L.latLngBounds(L.latLng(locLat-0.05, locLon-0.05), L.latLng(locLat+0.05, locLon+0.05));
    }

    getPolylines(){
        if(this.props.places.length > 1){
            return (<Polyline positions = {[this.getLL()]}/>);
        }
    }

    //<Polyline positions = {[this.getLL()]}/>

    getLL() {
        let LL;
        let places = Object.assign([], this.props.places);
        try {
            LL = Saver.wrapLoc(places);

        }catch(err){ console.log("error: ", err); }
        return LL;
    }

    getMarkerInfo(markerItem){
        let mInfo = "";
        for (let i in markerItem){
            if (i !== 'id'){
                mInfo = mInfo + i.charAt(0).toUpperCase() + i.slice(1) + ": " + markerItem[i] + " ";
            }
        }
        return mInfo;
    }

    renderHomeMarker(){
        if(this.props.currentLocation !== undefined){
            let loc = L.latLng(40.576179, -105.080773);
            if (this.props.getUserLocationBounds() !== undefined){loc = L.latLng(this.props.currentLocation.lat, this.props.currentLocation.lon);}
            return (
                <Marker position={loc}
                        icon={this.markerIcon()}
                        id={'mapMarker'}>
                    <Popup className="font-weight-extrabold">Latitude: {this.getHomePin(loc.lat)}, Longitude: {this.getHomePin(loc.lng)}</Popup>
                </Marker>
            );
        }
        return undefined;
    }

    getHomePin(loc){
        return loc.toString();
    }

    renderMarkers(placeList) {
        if(this.props.headerOptions === undefined){
            return;
        }
        //Extract only true markers
        let markerList = [];
        for(let i=0; i < placeList.length; i++){
            if(this.props.markers[placeList[i].id]){
                markerList.push(placeList[i]);
            }
        }
        //Array.map() creates a new array with the results of calling a provided function on every element in the calling array.
        return markerList.map((markerItem) =>
            <Marker
                position={L.latLng(markerItem.latitude, markerItem.longitude)}
                id={markerItem.id}
                title={markerItem.name}
                icon={L.icon({iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12,40]})}>
                <Popup className="font-weight-extrabold">
                    {this.getMarkerInfo(markerItem)}
                </Popup>
            </Marker>
        );
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