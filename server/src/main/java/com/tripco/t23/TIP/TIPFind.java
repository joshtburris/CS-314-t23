package com.tripco.t23.TIP;

import com.tripco.t23.database.database;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.ArrayList;

public class TIPFind extends TIPHeader {
    private String match;
    private ArrayList<Map> narrow;
    private int limit;
    private int found;
    private ArrayList<Map> places;

    private final transient Logger log = LoggerFactory.getLogger(TIPFind.class);

    //Should include "version" variable for requestversion?

    TIPFind(String match, int limit, ArrayList<Map> filter){
        this();
        this.requestVersion = 4;
        this.match = match;
        this.narrow = filter;
        this.limit = limit;
        this.found  = 0;
        this.places = new ArrayList<>();
    }
  
    TIPFind(String match, int limit) {
        this(match, limit, new ArrayList<>());
    }

    TIPFind(String match) {
        this(match, 0);
    }

    private TIPFind() {
        this.requestType = "find";
    }


    @Override
    public void buildResponse() {
        int lim = this.limit;
        Map[] returnedItems;

        //make any non-alphanumeric, non-underscore character a wildcard (?)
        String newMatch = this.match.replaceAll("[^a-zA-Z_]", "_");
        this.match = newMatch;

        if(this.narrow == null){
            this.narrow = new ArrayList<>();
        }
        if(this.narrow.isEmpty()){
            //narrow is empty, check all areas
            returnedItems = database.callLoginAll(this.match);
        }
        else{
            //narrow has items, filter by narrow
            returnedItems = database.callLoginAllFiltered(this.match, this.narrow);
        }

        for (Map location : returnedItems){
            //Already sorted in database, so we only need to count
            if(lim > 0 || this.limit == 0) {
                this.places.add(location);
                lim--;
            }
            this.found++;
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

    public ArrayList<Map> getPlaces(){
        return this.places;
    }

    @Override
    public String toString(){
        return getClass().getName() + String.format("\tMatch: %s\tLimit: %d\tFound: %d\tPlaces: %s",getMatch(),getLimit(),getFound(),getPlaces().toString());
    }
}
