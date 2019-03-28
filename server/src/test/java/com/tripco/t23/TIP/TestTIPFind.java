package com.tripco.t23.TIP;

import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class TestTIPFind {
    private TIPFind finder;

    private Map[] data = new Map[3];
    @Test
    public void testFindOne(){
        TIPFind findOne = new TIPFind("Capri", 3);
        findOne.buildResponse();
        long expect = 1;
        long actual = findOne.getFound();
        assertEquals("one object is found", expect, actual);
    }

    @Test
    public void findDtc(){
        TIPFind dtc = new TIPFind("Dtc North Heliport", 0);
        dtc.buildResponse();
        Map expect = new HashMap();
        //TODO: Update when latitude and longitude are working
        expect.put("id", "US-0073");
        expect.put("name", "Dtc North Heliport");
        expect.put("municipality","Denver");
        expect.put("type", "heliport");
        System.out.print(dtc.getPlaces());
        Map actual = dtc.getPlaces().get(0);
        assertEquals("maps are equal", expect, actual);
    }
}