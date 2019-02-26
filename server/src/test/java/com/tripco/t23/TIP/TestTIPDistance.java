package com.tripco.t23.TIP;

import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

/** Verifies the operation of the TIP distance class and its buildResponse method.
 */
public class TestTIPDistance {

  /* Radius and location values shared by test cases */
  private final double radiusMiles = 3958;
  private Map<String, Object> csu;
  private final int version = 2;

  @Before
  public void createLocationsForTestCases() {
    csu = new HashMap<>();
    csu.put("latitude", "40.576179");
    csu.put("longitude", "-105.080773");
    csu.put("name", "Oval, Colorado State University, Fort Collins, Colorado, USA");
  }

  @Test
  public void testOriginDestinationSame() {
    TIPDistance trip = new TIPDistance(version, csu, csu, radiusMiles);
    trip.buildResponse();
    long expect = 0L;
    long actual = trip.getDistance();
    assertEquals("origin and destination are the same", expect, actual);
  }

  @Test
  public void testDeciMiliMeters() {
    HashMap origin = new HashMap<>();
    origin.put("latitude", "40.5853");
    origin.put("longitude", "-105.0844");
    HashMap destination = new HashMap<>();
    destination.put("latitude", "-33.8688");
    destination.put("longitude", "151.2093");
    TIPDistance trip = new TIPDistance(version, origin, destination, 63710087714d);
    trip.buildResponse();
    long expect = 134318595145L;
    long actual = trip.getDistance();
    assertEquals("DeciMiliMeters", expect, actual);
  }

  @Test
  public void testPrecisionKilometers() {
    HashMap origin = new HashMap<>();
    origin.put("latitude", "40.5853");
    origin.put("longitude", "-105.0844");
    HashMap destination = new HashMap<>();
    destination.put("latitude", "-33.8688");
    destination.put("longitude", "151.2093");
    TIPDistance trip = new TIPDistance(version, origin, destination, 6371.0087714d);
    trip.buildResponse();
    long expect = 13432L;
    long actual = trip.getDistance();
    assertEquals("Precision kilometers", expect, actual);
  }

  @Test
  public void testMeters() {
    HashMap origin = new HashMap<>();
    origin.put("latitude", "40.5853");
    origin.put("longitude", "-105.0844");
    HashMap destination = new HashMap<>();
    destination.put("latitude", "-33.8688");
    destination.put("longitude", "151.2093");
    TIPDistance trip = new TIPDistance(version, origin, destination, 6371008.7714d);
    trip.buildResponse();
    long expect = 13431860L;
    long actual = trip.getDistance();
    assertEquals("Test meters", expect, actual);
  }
}
