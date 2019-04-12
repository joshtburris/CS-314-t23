package com.tripco.t23.TIP;

import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class TestTIPFind {
    private TIPFind finder;

    private Map[] data = new Map[3];

    @Test
    public void testFindFour(){
        TIPFind findOne = new TIPFind("Capri", 3);
        findOne.buildResponse();
        long expect = 4;
        long actual = findOne.getFound();
        assertEquals("Finding four objects", expect, actual);
    }

    @Test
    public void findDtc(){
        TIPFind dtc = new TIPFind("Dtc North Heliport");
        dtc.buildResponse();
        Map expect = new HashMap();
        expect.put("id", "US-0073");
        expect.put("name", "Dtc North Heliport");
        expect.put("municipality","Denver");
        expect.put("type", "heliport");
        expect.put("latitude", 39.6349983215);
        expect.put("longitude", -104.898002625);
        System.out.print(dtc.getPlaces());
        Map actual = dtc.getPlaces().get(0);
        assertEquals("maps are equal", expect, actual);
    }
}