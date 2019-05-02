package com.tripco.t23.misc;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertArrayEquals;
import java.util.HashMap;
import java.util.Map;

public class TestTwoOpt {
    private Map[] singleLocation = new Map[1];
    private Map[] locations = new Map[5];
    private final int version = 5;
    private final double earthRadiusMiles = 3958;

    private static Map<String, Object> getLocation(String name, String lat, String lon) {
        Map<String, Object> loc = new HashMap<>();
        loc.put("name", name);
        loc.put("latitude", lat);
        loc.put("longitude", lon);
        return loc;
    }

    @Before
    public void createDataForTestCases() {
        singleLocation = new Map[] {getLocation("Brighton", "39.87", "-104.33")};
        locations = new Map[] { getLocation("Brighton", "39.87", "-104.33"),
                getLocation("Alamosa", "37.57", "-105.79"),
                getLocation("Littleton", "39.64", "-104.33"),
                getLocation("Pagosa Springs", "37.2", "-107.05"),
                getLocation("Springfield", "37.3", "-102.54")};
    }

    @Test
    public void testTwoOptSinglePlace() {
        Optimizer twoOpt = new TwoOpt(singleLocation, earthRadiusMiles);

        long[] actualDistances = twoOpt.getDistances();
        Map[] actualPlaces = twoOpt.getPlaces();

        assertArrayEquals("Incorrect Distances", new long[] {0}, actualDistances);
        assertArrayEquals("Incorrect Places", singleLocation, actualPlaces);
    }

    @Test
    public void testTwoOpt() {
        Optimizer twoOpt = new TwoOpt(locations, earthRadiusMiles);

        long[] expectedDistances = {16, 188, 179, 74, 236};
        Map[] expectedLocations = { getLocation("Brighton", "39.87", "-104.33"),
                                    getLocation("Littleton", "39.64", "-104.33"),
                                    getLocation("Springfield", "37.3", "-102.54"),
                                    getLocation("Alamosa", "37.57", "-105.79"),
                                    getLocation("Pagosa Springs", "37.2", "-107.05")
        };

        long[] actualDistances = twoOpt.getDistances();
        Map[] actualPlaces = twoOpt.getPlaces();

        assertArrayEquals("Incorrect Distances", expectedDistances, actualDistances);
        assertArrayEquals("Incorrect Places", expectedLocations, actualPlaces);
    }

}