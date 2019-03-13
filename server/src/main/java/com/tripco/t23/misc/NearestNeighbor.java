package com.tripco.t23.misc;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class NearestNeighbor implements Optimizer{

    private final transient Logger log = LoggerFactory.getLogger(NearestNeighbor.class);

    private Map[] places;
    private Map[] ordPlaces;
    private long[] ordDistances;
    private long[][] distances;


    public NearestNeighbor(Map[] places, double earthRadius){
        this.places = places;
        this.ordPlaces = new Map[places.length];
        this.ordDistances = new long[places.length];
        this.generateDistances(earthRadius);
        int [] route = this.findOptimalRoute();
        order(route);
        return;
    }

    public Map[] getPlaces(){
        for(int i= 0; i<this.places.length; i++){
            log.debug("places {}", this.places[i]);
        }
        for(int i=0; i<this.ordPlaces.length;i++){
            log.debug("ordPlaces: {}", this.ordPlaces[i]);
        }
        return this.ordPlaces;
    }

    public long[] getDistances(){
        return this.ordDistances;
    }

    //Create a table for easy distance lookup
    private void generateDistances(double earthRadius){
        int len = this.places.length;
        this.distances = new long[len][len];
        for (int i =0; i < len; i++){
            this.distances[i][i] = 0;
            for(int j = i+1; j <len; j++){
                long dist = GreatCircleDistance.getDistance(this.places[i], this.places[j], earthRadius);
                this.distances[i][j] = dist;
                this.distances[j][i] = dist;
            }
        }
    }

    //Returns and integer array of indice locations corresponding to places
    private int[] findOptimalRoute(){
        int len = this.places.length;
        long bestTotDistance = -1; //used as a placeholder
        int [] bestRoute = new int[len];

        //start route from each places
        for (int i = 0; i < len; i++){
            int [] testRoute = new int[len];
            boolean [] visited = new boolean[len]; //false by default

            //route not complete
            for(int count = 0; count < len; count++){
                long bestDistance = -1; //placeholder values
                int nextPlace = -1;
                //find nearest neighbor
                for(int j = 0; j<len; j++){
                    if(visited[j]) continue;
                    if (this.distances[i][j] < bestDistance || bestDistance == -1){
                        bestDistance = this.distances[i][j];
                        nextPlace = j;
                    }
                }
                testRoute[count] = nextPlace;
                visited[nextPlace] = true;
            }

            long testDist = getDistFromRoute(testRoute);
            if (testDist < bestTotDistance || bestTotDistance == -1){
                bestTotDistance = testDist;
                bestRoute = testRoute;
            }
        }
        //make sure route starts at original location
        int i =0;
        //find starting location
        while(bestRoute[i] != 0){
            i++;
        }
        int[] myRoute = new int[len];
        for(int j = 0; j <len; j++){
            myRoute[j] = bestRoute[i++%len];
        }
        return myRoute;
    }

    //Route is the index locations corresponding with each place
    private long getDistFromRoute(int[] route){
        long dist = 0;
        for (int i = 0; i <route.length; i++){
            dist += this.distances[route[i]][route[(i+1)%route.length]];
        }
        return dist;
    }

    private void order(int [] route){
        for (int i = 0; i < route.length; i++){
            this.ordPlaces[i] = this.places[route[i]];
            this.ordDistances[i] = this.distances[route[i]][route[(i+1)%route.length]];
        }
    }
}
