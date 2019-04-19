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
    private Map<String, Object> foco;
    private Map<String, Object> dnvr;
    private Map<String, Object> bldr;
    private final int version = 3;

    @Before
    public void createDataForTestCases() {
        csu = new HashMap<>();
        csu.put("latitude", "40.576179");
        csu.put("longitude", "-105.080773");
        csu.put("name", "Oval, Colorado State University, Fort Collins, Colorado, USA");

        dnvr = new HashMap<>();
        dnvr.put("latitude", "39.7392");
        dnvr.put("longitude", "-104.9903");
        dnvr.put("name", "Denver");

        bldr = new HashMap<>();
        bldr.put("latitude", "40.01499");
        bldr.put("longitude", "-105.27055");
        bldr.put("name", "Boulder");

        foco = new HashMap<>();
        foco.put("latitude", "40.585258");
        foco.put("longitude", "-105.084419");
        foco.put("name", "Fort Collins");

        options = new HashMap<>();
        options.put("title", "itinerary");
        options.put("earthRadius", "3958.761316");
        options.put("optimizations", "none");
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
        TIPItinerary trip = new TIPItinerary(version, options, new Map[]{dnvr, bldr, foco});
        trip.buildResponse();
        long[] expect = {24,41,59};
        long[] actual = trip.getDistances();
        assertArrayEquals("Sample from tip.md", expect, actual);
    }

   @Test
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

    @Test
    public void testNN() {
        /*options.put("optimizations", "short");
        TIPItinerary trip = new TIPItinerary(version, options, new Map[]{csu,foco,bldr,dnvr});
        trip.buildResponse();
        Map[] expectP = new Map[]{csu, foco, bldr, dnvr};
        Map[] actualP = trip.getPlaces();
        assertArrayEquals("Places", expectP, actualP);
        long[] expectD= {1, 41, 24, 58}; //from team 5
        long[] actualD= trip.getDistances();
        assertArrayEquals("Distance", expectD, actualD);*/
    }
}

