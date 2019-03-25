package com.tripco.t23.TIP;

import com.tripco.t23.misc.NearestNeighbor;
import com.tripco.t23.misc.Optimizer;
import com.tripco.t23.misc.OptimizerNone;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

public class TIPItinerary extends TIPHeader{
    private Map options;
    private Map[] places;
    private long[] distances;

    private final transient Logger log = LoggerFactory.getLogger(TIPItinerary.class);

    TIPItinerary(Integer version, Map options, Map[] places) {
            this();
            this.requestVersion = version;
            this.options = options;
            this.places = places;
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
        Optimizer optimizer;
        if (this.requestVersion >=3) {
            switch (this.options.get("optimization").toString()) {
                case "short":
                    optimizer = new NearestNeighbor(this.places, earthRadius);
                    break;
                default:
                    optimizer = new OptimizerNone(this.places, earthRadius);
            }
        }
        else{
            optimizer = new OptimizerNone(this.places, earthRadius);
        }
        this.distances = optimizer.getDistances();
        this.places = optimizer.getPlaces();

        log.trace("buildResponse -> {}", this);
    }


}
