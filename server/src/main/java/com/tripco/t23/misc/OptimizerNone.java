package com.tripco.t23.misc;

import com.tripco.t23.misc.GreatCircleDistance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

public class OptimizerNone extends Optimizer{
    private Map[] places;
    private long[] distances;
    private double earthRadius;

    private final transient Logger log = LoggerFactory.getLogger(OptimizerNone.class);

    public OptimizerNone(Map[] places, double earthRadius) {
        log.debug("places", places);
        this.places = places;
        this.distances = new long[places.length];
        this.earthRadius = earthRadius;
    }

    public Map[] getPlaces(){
        return places;
    }

    public long[] getDistances() {
        for (int i = 0; i < places.length; i++) {
            distances[i] = GreatCircleDistance.getDistance(places[i], places[(i+1)%places.length], earthRadius);
        }
        return distances;
    }
}
