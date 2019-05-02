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

  //TODO: check this.filters is getting two separate Objects and make a new hashmap in the array if not
  public TIPConfig() {
    this.requestType = "config";
    this.requestVersion = 5;
    this.serverName = "t23 Byte Me";
    this.placeAttributes = Arrays.asList("latitude", "longitude", "name", "id", "municipality", "altitude", "type");
    this.optimizations = Arrays.asList("none", "short", "shorter");
    this.filters = Arrays.asList((new HashMap<String, Object>() {{put("name", "type"); put("values", Arrays.asList("airport","heliport","balloonport","closed"));}}),
            (new HashMap<String, Object>() {{put("name", "iso_country");
            put("values", Arrays.asList("AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AS","AT","AU","AW","AZ",
                    "BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BQ","BR","BS","BT","BW","BY","BZ",
                    "CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CR","CU","CV","CW","CX","CY","CZ",
                    "DE","DJ","DK", "DM","DO","DZ","EC","EE","EG","EH","ER","ES","ET","FI","FJ","FK","FM","FO","FR",
                    "GA","GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GT","GU","GW","GY",
                    "HK","HN","HR","HT","HU","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM","JO","JP",
                    "KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY",
                    "MA","MC","MD","ME","MF","MG","MH","MK","ML","MM","MN","MO","MP","MQ","MS","MT","MU","MV","MW","MX","MY","MZ",
                    "NA","NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM",
                    "PA","PE","PF","PG","PH","PK","PL","PM","PR","PS","PT","PW","PY","QA","RE","RO","RS","RU","RW",
                    "SA","SB","SC","SD","SE","SG","SH","SI","SK","SL","SM","SN","SO","SR","SS","ST","SV","SX","SY","SZ",
                    "TC","TD","TF","TG","TH","TJ","TL","TM","TN","TO","TR","TT","TV","TW","TZ",
                    "UA","UG","UM","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","XK","YE","YT","ZA","ZM","ZW"));}}));
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

  public List<String> getOptimizations() { return this.optimizations; }

  @Override
  public String toString(){
    return getClass().getName() + String.format("\tServer Name: %s\tPlace Attributes: %s",getServerName(),getPlaceAttributes().toString());
  }
}
