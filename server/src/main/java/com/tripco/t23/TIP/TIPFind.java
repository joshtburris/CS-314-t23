package com.tripco.t23.TIP;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

public class TIPFind extends TIPHeader {
    private String match;
    private int limit;
    private int found;
    private Map[] places;

    private final transient Logger log = LoggerFactory.getLogger(TIPFind.class);

    TIPFind(String match) {
        this();
        this.requestVersion = 3;
        this.match = match;
        this.limit = 3;
        this.found  = 0;
    }

    private TIPFind() {
        this.requestType = "find";
    }


    //TODO: finish build response
    @Override
    public void buildResponse() {
        int lim = this.limit;
        for (Map location : places){ //TODO: Replace 'places' in this line with the appropriate list of items
            if(location.containsValue(this.match)){
                if(lim > 0) {
                    this.places[this.limit - lim] = location;
                    lim--;
                }
                this.found++;
            }
        }
        log.trace("buildResponse -> {}", this);
    }


    public String getMatch(){
        return this.match;
    }

    public int getLimit(){
        return this.limit;
    }

    public int getFound(){
        return this.found;
    }

    public Map[] getPlaces(){
        return this.places;
    }

    @Override
    public String toString(){
        return getClass().getName() + String.format("\tMatch: %s\tLimit: %f\tFound: %f\tPlaces: %s",getMatch(),getLimit(),getFound(),getPlaces().toString());
    }
}
