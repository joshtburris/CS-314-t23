package com.tripco.t23.misc;

import java.util.Map;
import java.util.Arrays;

import org.eclipse.jetty.util.LazyList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TwoOpt extends Optimizer {

    private final transient Logger log = LoggerFactory.getLogger(TwoOpt.class);

    public TwoOpt(Map[] places, double earthRadius) {
        this.places = places;
        ordPlaces = new Map[places.length];
        ordDistances = new long[places.length];
        if (places.length == 0)
            return;
        generateDistances(earthRadius);
        int[] route = circleToStart(findOptimalRoute());
        order(route);
    }

    public Map[] getPlaces() { return this.ordPlaces; }

    public long[] getDistances(){
        return this.ordDistances;
    }

    private int[] findOptimalRoute() {

        int len = places.length;
        int[] bestRoute = null;
        for (int plc = 0; plc < len; ++plc) {
            int[] route = getNNRoute(plc);
            boolean improvement = true;
            while (improvement) {
                improvement = false;
                if (len <= 4) return route;
                for (int i = 0; i < len-2; ++i) {
                    for (int k = i + 2; k < len; ++k) {
                        long delta =    -distance(route, i, i+1) - distance(route, k, k+1)
                                        + distance(route, i, k) + distance(route, i+1, k+1);
                        if (delta < 0) { //improvement?
                            reverse(route, i+1, k);
                            improvement = true;
                        }
                    }
                }
                if (bestRoute == null || distance(route, 0, len-1) < distance(bestRoute, 0, len-1))
                    bestRoute = route;
            }
        }

        return bestRoute;
    }

    private void reverse(int[] route, int beg, int end) { // reverse in place
        while (beg < end) {
            int temp = route[beg];
            route[beg] = route[end];
            route[end] = temp;
            ++beg;
            --end;
        }
    }

    private long distance(int[] route, int beg, int end) {
        long dist = 0;
        for (int i = beg; i < end; i++) {
            dist += distances[ route[i] ][ route[(i+1)%route.length] ];
        }
        return dist;
    }

}
