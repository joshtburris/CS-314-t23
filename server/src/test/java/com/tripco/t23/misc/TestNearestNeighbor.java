package com.tripco.t23.misc;

import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import java.util.*;
import java.io.*;

public class TestNearestNeighbor {

    private Map[] singleLocation;
    private Map[] locations;
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
    public void testNoPlaces() {
        Optimizer nn = new NearestNeighbor(new Map[] {}, earthRadiusMiles);

        long[] actualDistances = nn.getDistances();
        Map[] actualPlaces = nn.getPlaces();

        assertArrayEquals("Incorrect Distances", new long[] {}, actualDistances);
        assertArrayEquals("Incorrect Places", new Map[] {}, actualPlaces);
    }

    @Test
    public void testNNSinglePlace() {
        Optimizer nn = new NearestNeighbor(singleLocation, earthRadiusMiles);

        long[] actualDistances = nn.getDistances();
        Map[] actualPlaces = nn.getPlaces();

        assertArrayEquals("Incorrect Distances", new long[] {0}, actualDistances);
        assertArrayEquals("Incorrect Places", singleLocation, actualPlaces);
    }

    @Test
    public void testNN() {
        Optimizer nn = new NearestNeighbor(locations, earthRadiusMiles);

        long[] expectedDistances = {202, 179, 74, 224, 16};
        Map[] expectedLocations = { getLocation("Brighton", "39.87", "-104.33"),
                                    getLocation("Springfield", "37.3", "-102.54"),
                                    getLocation("Alamosa", "37.57", "-105.79"),
                                    getLocation("Pagosa Springs", "37.2", "-107.05"),
                                    getLocation("Littleton", "39.64", "-104.33")};

        long[] actualDistances = nn.getDistances();
        Map[] actualPlaces = nn.getPlaces();

        assertArrayEquals("Incorrect Distances", expectedDistances, actualDistances);
        assertArrayEquals("Incorrect Places", expectedLocations, actualPlaces);
    }

    @Test
    public void testNNTimeLong() {
        try {

            ArrayList<Map> locs = new ArrayList<>();
            FileReader fr = new FileReader("TestDataLong.txt");
            BufferedReader br = new BufferedReader(fr);
            String line;
            while ((line = br.readLine()) != null) {
                String[] data = line.split(",");
                locs.add(getLocation(data[0], data[1], data[2]));
            }
            long start = System.currentTimeMillis();
            Optimizer nn = new NearestNeighbor((Map[])locs.toArray(), earthRadiusMiles);
            long end = System.currentTimeMillis();

            assertEquals(true, ((end-start) < 1000) ? true : false);

        } catch (Exception e ) {}
    }

    @Test
    public void testOrderedData() {
        Map[] locations = {
                getLocation("Brighton", "39.87", "-104.33"),
                getLocation("Springfield", "37.3", "-102.54"),
                getLocation("Alamosa", "37.57", "-105.79"),
                getLocation("Pagosa Springs", "37.2", "-107.05"),
                getLocation("Littleton", "39.64", "-104.33")};

        Optimizer nn = new NearestNeighbor(locations, earthRadiusMiles);

        long[] expectedDistances = {202, 179, 74, 224, 16};

        long[] actualDistances = nn.getDistances();
        Map[] actualPlaces = nn.getPlaces();

        assertArrayEquals("Incorrect Distances", expectedDistances, actualDistances);
        assertArrayEquals("Incorrect Places", locations, actualPlaces);
    }

}
