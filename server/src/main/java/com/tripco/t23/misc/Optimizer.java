package com.tripco.t23.misc;

import java.util.Map;
import java.util.Arrays;

public abstract class Optimizer {
    public abstract Map[] getPlaces();
    public abstract long[] getDistances();

    protected Map[] places;
    protected Map[] ordPlaces;
    protected long[] ordDistances;
    protected long[][] distances;

    /*
     * Create a table for easy distance lookup from starting place 'i' to ending place 'j'
     */
    protected void generateDistances(double earthRadius) {
        int len = places.length;
        distances = new long[len][len];
        for (int i = 0; i < len; i++) {
            distances[i][i] = 0;
            for (int j = i+1; j < len; j++) {
                long dist = GreatCircleDistance.getDistance(places[i], places[j], earthRadius);
                distances[i][j] = dist;
                distances[j][i] = dist;
            }
        }
    }

    protected int[] getNNRoute(int placeIndex) {
        int len = this.places.length;
        int[] route = new int[len];
        boolean[] visited = new boolean[len]; //false by default

        visited[placeIndex] = true;
        route[0] = placeIndex;
        int curPlace = placeIndex;
        for (int count = 1; count < len; ++count) {
            int nextPlace = -1;
            long bestDist = Long.MAX_VALUE;
            for (int i = 0; i < len; ++i) {
                if (!visited[i] && distances[curPlace][i] < bestDist) {
                    nextPlace = i;
                    bestDist = distances[curPlace][i];
                }
            }
            route[count] = nextPlace;
            visited[nextPlace] = true;
            curPlace = nextPlace;
        }

        return route;
    }

    protected void order(int[] route) {
        for (int i = 0; i < route.length; i++) {
            ordPlaces[i] = places[route[i]];
            ordDistances[i] = distances[route[i]][route[(i+1)%route.length]];
        }
    }

    protected int[] circleToStart(int[] route) {
        int i = 0, len = route.length;
        //find starting location
        while (route[i] != 0)
            ++i;
        int[] myRoute = new int[len];
        for (int j = 0; j < len; j++) {
            myRoute[j] = route[i++%len];
        }
        return myRoute;
    }

}
