package com.tripco.t23.misc;

import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertArrayEquals;


public class TestNearestNeighbor {
    private Map<String, Object> csu, boulder;
    private final int version = 3;
    private final double earthRadiusMiles = 3958;


    @Before
    public void createDataForTestCases() {
        csu = new HashMap<>();
        csu.put("latitude", "40.576179");
        csu.put("longitude", "-105.080773");
        csu.put("name", "Oval, Colorado State University, Fort Collins, Colorado, USA");
        boulder = new HashMap<>();
        boulder.put("latitude", "40.0150");
        boulder.put("longitude", "-105.2705");
        boulder.put("name", "Boulder");
    }


    @Test
    public void testNNSinglePlace(){
        Optimizer nn = new NearestNeighbor(new Map[]{csu}, earthRadiusMiles);

        long [] expectedDistances = {0};
        Map[]  expectedPlaces = new Map[]{csu};

        long[] actualDistances = nn.getDistances();
        Map[] actualPlaces = nn.getPlaces();
        assertArrayEquals("Incorrect Distances", expectedDistances, actualDistances);
        assertArrayEquals("Incorrect Places", expectedPlaces, actualPlaces);
    }
    @Test
    public void testNNTwoPlace(){
        Optimizer nn = new NearestNeighbor(new Map[]{csu, boulder}, earthRadiusMiles);

        long [] expectedDistances = {40,40};
        Map[]  expectedPlaces = new Map[]{csu, boulder};

        long[] actualDistances = nn.getDistances();
        Map[] actualPlaces = nn.getPlaces();
        assertArrayEquals("Incorrect Places", expectedPlaces, actualPlaces);
        assertArrayEquals("Incorrect Distances", expectedDistances, actualDistances);
    }
}
