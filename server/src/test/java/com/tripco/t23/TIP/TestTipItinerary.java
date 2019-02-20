package com.tripco.t23.TIP;

import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertArrayEquals;

public class TestTipItinerary {
    /* Radius and location values shared by test cases */
    private Map<String, Object> csu;
    private Map<String, Object> options;
    private final int version = 1;

    @Before
    public void createDataForTestCases() {
        csu = new HashMap<>();
        csu.put("latitude", "40.576179");
        csu.put("longitude", "-105.080773");
        csu.put("name", "Oval, Colorado State University, Fort Collins, Colorado, USA");
        options = new HashMap<>();
        options.put("title", "itinerary");
        options.put("earthRadius", "3958");
    }



    @Test
    public void testOriginDestinationSame() {
        TIPItinerary trip = new TIPItinerary(version, options, new Map[]{csu, csu});
        trip.buildResponse();
        long[] expect = {0, 0};
        long[] actual = trip.getDistances();

        assertArrayEquals("origin and destination are the same", expect, actual);
    }
}
