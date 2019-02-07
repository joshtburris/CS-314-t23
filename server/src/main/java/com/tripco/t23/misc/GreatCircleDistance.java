package com.tripco.t23.misc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.Math;

/** Determines the distance between geographic coordinates.
 */
public class GreatCircleDistance {
    public static Double HaversineFormula(double lat_1, double lon_1, double lat_2, double lon_2, float earthRadius){
        /*
        * Code from: https://rosettacode.org/wiki/Haversine_formula#Java
        */
        double diff_lat = Math.toRadians(lat_2 - lat_1);
        double diff_lon = Math.toRadians(lon_2 - lon_1);
        lat_1 = Math.toRadians(lat_1);
        lat_2 = Math.toRadians(lat_2);
        double rad = Math.pow(Math.sin(diff_lat / 2), 2) + (Math.pow(Math.sin(diff_lon /2), 2) * Math.cos(lat_1) * Math.cos(lat_2));
        double theta = 2 * Math.asin(Math.sqrt(rad));
        Double finalValue = earthRadius * theta;

        Logger log = LoggerFactory.getLogger(GreatCircleDistance.class);
        log.trace("Haversine result ->{}",finalValue);

        return finalValue;
    }

    @Override
    public String toString() {
        return getClass().getName();
    }
}
