package com.tripco.t23.misc;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class NearestNeighbor extends Optimizer {

    private final transient Logger log = LoggerFactory.getLogger(NearestNeighbor.class);

    public NearestNeighbor(Map[] places, double earthRadius) {
        this.places = places;
        ordPlaces = new Map[places.length];
        ordDistances = new long[places.length];
        if (places.length == 0)
            return;
        generateDistances(earthRadius);
        int[] route = circleToStart(getBestRoute());
        order(route);
    }

    public Map[] getPlaces() { return ordPlaces; }

    public long[] getDistances() { return ordDistances; }

    private int[] getBestRoute() {
        int len = places.length;
        long bestTotDistance = -1; //used as a placeholder
        int[] bestRoute = new int[len];

        for (int i = 0; i < len; i++) {
            int[] testRoute = getNNRoute(i);
            long testDist = getDistFromRoute(testRoute);
            if (testDist < bestTotDistance || bestTotDistance == -1) {
                bestTotDistance = testDist;
                bestRoute = testRoute;
            }
        }

        return bestRoute;
    }

    //Route is the index locations corresponding with each place
    private long getDistFromRoute(int[] route) {
        long dist = 0;
        for (int i = 0; i < route.length; i++) {
            dist += distances[route[i]][route[(i+1)%route.length]];
        }
        return dist;
    }

}
