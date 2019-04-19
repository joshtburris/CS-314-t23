package com.tripco.t23.misc;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertArrayEquals;
import java.util.HashMap;
import java.util.Map;

public class TestTwoOpt {

    private Map<String, Object> csu, boulder;
    private final int version = 4;
    private final double earthRadiusMiles = 3958;


    @Before
    public void createDataForTestCases() {
        csu = new HashMap<>();
        csu.put("latitude", "30");
        csu.put("longitude", "-104");
        csu.put("name", "Kinda Colorado");
        boulder = new HashMap<>();
        boulder.put("latitude", "40");
        boulder.put("longitude", "-106");
        boulder.put("name", "Boulder");
    }

    @Test
    public void testTwoOptSinglePlace() {
        Optimizer nn = new TwoOpt(new Map[] {csu}, earthRadiusMiles);

        long [] expectedDistances = {0};
        Map[]  expectedPlaces = new Map[] {csu};

        long[] actualDistances = nn.getDistances();
        Map[] actualPlaces = nn.getPlaces();
        assertArrayEquals("Incorrect Distances", expectedDistances, actualDistances);
        assertArrayEquals("Incorrect Places", expectedPlaces, actualPlaces);
    }

    @Test
    public void testTwoOptTwoPlace() {
        Optimizer nn = new NearestNeighbor(new Map[] {csu, boulder}, earthRadiusMiles);

        long [] expectedDistances = {700,700};
        Map[]  expectedPlaces = new Map[] {csu, boulder};

        long[] actualDistances = nn.getDistances();
        Map[] actualPlaces = nn.getPlaces();
        assertArrayEquals("Incorrect Places", expectedPlaces, actualPlaces);
        assertArrayEquals("Incorrect Distances", expectedDistances, actualDistances);
    }

}
