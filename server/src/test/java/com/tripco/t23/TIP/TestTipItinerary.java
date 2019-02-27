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
    private final int version = 2;

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

    @Test
    public void testSample() {
        Map<String, Object>dnvr = new HashMap<>();
        dnvr.put("latitude", "39.7392");
        dnvr.put("longitude", "-104.9903");
        dnvr.put("name", "Denver");

        Map<String, Object>bldr = new HashMap<>();
        bldr.put("latitude", "40.01499");
        bldr.put("longitude", "-105.27055");
        bldr.put("name", "Boulder");

        Map<String, Object>foco = new HashMap<>();
        foco.put("latitude", "40.585258");
        foco.put("longitude", "-105.084419");
        foco.put("name", "Fort Collins");

        Map<String, Object> options = new HashMap<>();
        options.put("title", "My Trip");
        options.put("earthRadius", "3958.761316");

        TIPItinerary trip = new TIPItinerary(version, options, new Map[]{dnvr, bldr, foco});
        trip.buildResponse();
        long[] expect = {24,41,59};
        long[] actual = trip.getDistances();
        assertArrayEquals("Sample from tip.md", expect, actual);
    }
  
    public void testNoPlaces() {
        TIPItinerary trip = new TIPItinerary(version, options, new Map[0]);
        trip.buildResponse();;
        long[] expect = {};
        long[] actual = trip.getDistances();
        assertArrayEquals("No places", expect, actual);
    }

    @Test
    public void testOnePlace() {
        TIPItinerary trip = new TIPItinerary(version, options, new Map[]{csu});
        trip.buildResponse();
        long[] expect = {0};
        long[] actual = trip.getDistances();
        assertArrayEquals("One place", expect, actual);
    }
}

