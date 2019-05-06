package com.tripco.t23.TIP;

import org.junit.Test;

import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;

import static org.junit.Assert.assertEquals;

public class TestTIPFind {
    private TIPFind finder;

    private Map[] data = new Map[3];

    @Test
    public void testFindFour(){
        TIPFind findFour = new TIPFind("Capri", 3);
        findFour.buildResponse();
        long expect = 4;
        long actual = findFour.getFound();
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
        expect.put("latitude", "39.6349983215");
        expect.put("longitude", "-104.898002625");
        Map actual = dtc.getPlaces().get(0);
        assertEquals("maps are equal", expect, actual);
    }

    @Test
    public void FindWithFilter(){
        ArrayList<Map> filter = new ArrayList<>();
        Map filterEntry = new HashMap();
        ArrayList<String> valuesEntry = new ArrayList<>();
        filterEntry.put("name", "type");
        valuesEntry.add("heliport");
        filterEntry.put("values", valuesEntry);
        filter.add(filterEntry);

        TIPFind dtc = new TIPFind("Capri", 0, filter);
        dtc.buildResponse();

        ArrayList<Map> expect = new ArrayList<>();
        Map expectItem = new HashMap();
        expectItem.put("id", "CO32");
        expectItem.put("name", "Capri Heliport");
        expectItem.put("municipality", "Denver");
        expectItem.put("type", "heliport");
        expectItem.put("latitude", "39.85279846191406");
        expectItem.put("longitude", "-104.97699737548828");
        expect.add(expectItem);
        Map expectItem2 = new HashMap();
        expectItem2.put("id", "AR-0133");
        expectItem2.put("name", "El Capricho Heliport");
        expectItem2.put("municipality","Chenaut");
        expectItem2.put("type", "heliport");
        expectItem2.put("latitude", "-34.2325");
        expectItem2.put("longitude", "-59.3158");
        expect.add(expectItem2);

        ArrayList<Map> actual = dtc.getPlaces();
        assertEquals("maps are equal", expect, actual);
    }

    @Test
    public void FindWithFilterMulti(){
        ArrayList<Map> filter = new ArrayList<>();
        Map filterEntry = new HashMap();
        ArrayList<String> valuesEntry = new ArrayList<>();
        filterEntry.put("name", "type");
        valuesEntry.add("heliport");
        filterEntry.put("values", valuesEntry);
        filter.add(filterEntry);
        Map filterEntry2 = new HashMap();
        ArrayList<String> valuesEntry2 = new ArrayList<>();
        filterEntry2.put("name", "iso_country");
        valuesEntry2.add("US");
        filterEntry2.put("values", valuesEntry2);
        filter.add(filterEntry2);

        TIPFind dtc = new TIPFind("Capri", 0, filter);
        dtc.buildResponse();

        ArrayList<Map> expect = new ArrayList<>();
        Map expectItem = new HashMap();
        expectItem.put("id", "CO32");
        expectItem.put("name", "Capri Heliport");
        expectItem.put("municipality", "Denver");
        expectItem.put("type", "heliport");
        expectItem.put("latitude", "39.85279846191406");
        expectItem.put("longitude", "-104.97699737548828");
        expect.add(expectItem);

        ArrayList<Map> actual = dtc.getPlaces();
        assertEquals("find capri heliport with multiple filters", expect, actual);
    }

    @Test
    public void testToString(){
        TIPFind findFour = new TIPFind("Capri", 1);
        findFour.buildResponse();

        ArrayList<Map> expectArray = new ArrayList<>();
        Map expectItem = new HashMap();
        expectItem.put("id", "IT-0417");
        expectItem.put("name", "Aviosuperficie Coraine");
        expectItem.put("municipality", "Caprino Veronese (VR)");
        expectItem.put("type", "closed");
        expectItem.put("latitude", "45.588562");
        expectItem.put("longitude", "10.755719");
        expectArray.add(expectItem);

        String expect = String.format("com.tripco.t23.TIP.TIPFind\tMatch: %s\tLimit: %d\tFound: %d\tPlaces: %s","Capri",1,4,expectArray);
        String actual = findFour.toString();
        assertEquals("Finding four objects", expect, actual);
    }
}