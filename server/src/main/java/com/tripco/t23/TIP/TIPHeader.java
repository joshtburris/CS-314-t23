package com.tripco.t23.TIP;

public abstract class TIPHeader {
  protected Integer requestVersion;
  protected String requestType;

  public abstract void buildResponse();
}
