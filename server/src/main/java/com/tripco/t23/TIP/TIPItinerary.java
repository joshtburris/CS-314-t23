package com.tripco.t23.TIP;

import com.tripco.t23.misc.GreatCircleDistance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

public class TIPItinerary extends TIPHeader{
    private Map[] places;
    private long[] distances;
    private Map options;
    private Integer requestVersion;

    private final transient Logger log = LoggerFactory.getLogger(TIPDistance.class);

        TIPItinerary(int version, Map options, Map[] places) {
        this();
        this.requestVersion = version;
        this.places = places;
        this.options = options;
        this.distances = new long[places.length];
    }


    private TIPItinerary() {
            this.requestType = "itinerary";
        }


    long[] getDistances() {
        return distances;
    }

    @Override
    public void buildResponse() {
        double earthRadius = Double.parseDouble(options.get("earthRadius").toString());
        for (int i =0; i < places.length; i++){
            this.distances[i] = GreatCircleDistance.getDistance(places[i], places[(i+1)%places.length], earthRadius);
        }
        log.trace("buildResponse -> {}", this);
    }


}
