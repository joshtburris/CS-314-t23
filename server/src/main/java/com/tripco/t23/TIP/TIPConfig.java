package com.tripco.t23.TIP;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

/** This class defines the Config response that provides the client
 * with server specific configuration information.
 *  
 * When used with restful API services,
 * An object is created from the request JSON by the MicroServer using GSON.
 * The buildResponse method is called to set the configuration information.
 * The MicroServer constructs the response JSON from the object using GSON.
 *  
 * When used for testing purposes,
 * An object is created using the constructor below.
 * The buildResponse method is called to set the configuration information.
 * The getDistance method is called to obtain the distance value for comparisons.
 */
public class TIPConfig extends TIPHeader {
  private String serverName;
  private List<String> placeAttributes;
  private List<String> optimizations;
  private List<Map<String, Object>> filters;

  private final transient Logger log = LoggerFactory.getLogger(TIPConfig.class);


  public TIPConfig() {
    this.requestType = "config";
    this.requestVersion = 4;
    this.serverName = "t23 Byte Me";
    this.placeAttributes = Arrays.asList("latitude", "longitude", "name", "id", "municipality", "altitude", "type");
    this.optimizations = Arrays.asList("none", "short");
    this.filters = Arrays.asList(new HashMap<String, Object>() {{put("name", "type"); put("values", Arrays.asList("airport","heliport","balloonport","closed"));}});
  }


  @Override
  public void buildResponse() {
    log.trace("buildResponse -> {}", this);
  }


  String getServerName() {
    return this.serverName;
  }

  public String getType(){
    return this.requestType;
  }

  public int getVersion(){
    return this.requestVersion;
  }

  public List<String> getPlaceAttributes() {
    return this.placeAttributes;
  }

  public List<String> getOptimizations() { return  this.optimizations; }

  @Override
  public String toString(){
    return getClass().getName() + String.format("\tServer Name: %s\tPlace Attributes: %s",getServerName(),getPlaceAttributes().toString());
  }
}
