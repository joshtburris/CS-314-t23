package com.tripco.t23.TIP;

public abstract class TIPHeader {
  protected Integer requestVersion;
  protected String requestType;

  public abstract void buildResponse();

  @Override
  public String toString(){
    return getClass().getName() + String.format("\tRequest Version: %d\tRequest Type: %s",requestVersion,requestType);
  }
}
