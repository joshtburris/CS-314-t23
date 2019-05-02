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
        if (places.length == 0) return;
        generateDistances(earthRadius);
        int[] route = circleToStart(findOptimalRoute());
        order(route);
    }

    public Map[] getPlaces() { return this.ordPlaces; }

    public long[] getDistances(){
        return this.ordDistances;
    }

    private int[] findOptimalRoute() {

        int[] bestRoute = new int[places.length];
        long bestRouteDist = Long.MAX_VALUE;

        for (int plc = 0; plc < places.length; ++plc) {
            int[] route = getNNRoute(plc);
            int n = route.length;
            if (n <= 4) return route;
            route = twoOpt(route, n);
            if (distance(route, 0, n) < bestRouteDist) {
                bestRoute = Arrays.copyOf(route, n);
                bestRouteDist = distance(bestRoute, 0, n);
            }
        }
        return bestRoute;
    }

    private int[] twoOpt(int[] route, int n) {
        boolean improvement = true;
        while (improvement) {
            improvement = false;
            for (int i = 0; i <= n-3; i++) {
                for (int k = i+2; k <= n-1; k++) {
                    long delta =
                            - dis(route, i, i+1)
                            - dis(route, k, k+1)
                            + dis(route, i, k)
                            + dis(route, i+1, k+1);
                    if (delta < 0) { //improvement?
                        reverse(route, i+1, k);
                        improvement = true;
                    }
                }
            }
        }
        return route;
    }

    private int[] reverse(int[] route, int beg, int end) { // reverse in place
        while (beg < end) {
            int temp = route[beg];
            route[beg] = route[end];
            route[end] = temp;
            ++beg;
            --end;
        }
        return route;
    }

    private long dis(int[] route, int beg, int end) {
        return distances[route[beg%route.length]][route[end%route.length]];
    }

    private long distance(int[] route, int beg, int end) {
        long dist = 0;
        while (beg != end) {
            dist += distances[route[beg%route.length]][route[(beg+1)%route.length]];
            ++beg;
        }
        return dist;
    }

}
