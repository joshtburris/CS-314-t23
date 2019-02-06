package com.tripco.t23.TIP;

import com.tripco.t23.misc.GreatCircleDistance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.lang.Math;
import java.util.Map;


/** Defines the TIP distance object.
 *
 * For use with restful API services,
 * An object is created from the request JSON by the MicroServer using GSON.
 * The buildResponse method is called to determine the distance.
 * The MicroServer constructs the response JSON from the object using GSON.
 *
 * For unit testing purposes,
 * An object is created using the constructor below with appropriate parameters.
 * The buildResponse method is called to determine the distance.
 * The getDistance method is called to obtain the distance value for comparisons.
 *
 */
public class TIPDistance extends TIPHeader {
  private Map origin;
  private Map destination;
  private Float earthRadius;
  private Integer distance;

  private final transient Logger log = LoggerFactory.getLogger(TIPDistance.class);


  TIPDistance(int version, Map origin, Map destination, float earthRadius) {
    this();
    this.requestVersion = version;
    this.origin = origin;
    this.destination = destination;
    this.earthRadius = earthRadius;
    this.distance = 0;
  }


  private TIPDistance() {
    this.requestType = "distance";
  }


  @Override
  public void buildResponse() {
    this.distance = getDistance();
    log.trace("buildResponse -> {}", this);
  }


  int getDistance() {
    Double distance_to_round= (GreatCircleDistance.HaversineFormula(Double.parseDouble(this.origin.get("latitude").toString()), Double.parseDouble(this.origin.get("longitude").toString()),
            Double.parseDouble(this.destination.get("latitude").toString()), Double.parseDouble(this.destination.get("longitude").toString()),earthRadius)+.5); //.5 is added for rounding purposes
    return distance_to_round.intValue();
  }

  @Override
  public String toString(){
    return getClass().getName() + String.format("\tOrigin: %s\tDestination: %s\tRadius: %f",origin.toString(),destination.toString(),earthRadius);
  }
}
