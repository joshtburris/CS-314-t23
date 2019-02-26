package com.tripco.t23.misc;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class TestGreatCircleDistance {

    float radiusMiles = 3958;
    double latitude_1 = 40.5;
    double latitude_2 = 40.0;
    double longitude_1 = -105.1;
    double longitude_2 = -110.26;
    double latitude_NP = 90.00;
    double longitude_NP = 130.00; // North pole coordinates
    double latitude_SP = -90.00;
    double longitude_SP = 0.00; // South Pole Coordinates


    @Test
    public void testCoordinates() {
        long actualDistance_Test_1 = GreatCircleDistance.HaversineFormula(latitude_1, longitude_1, latitude_2, longitude_2, radiusMiles);
        long expect_1 = 274L;
        assertEquals("distance calculated are the same", expect_1, actualDistance_Test_1);


        long actualDistance_Test_2 = GreatCircleDistance.HaversineFormula(latitude_NP, longitude_NP, latitude_SP, longitude_SP, radiusMiles);
        long expect_2 = 12434L;
        assertEquals("distance calculated are the same", expect_2, actualDistance_Test_2);
    }


}
