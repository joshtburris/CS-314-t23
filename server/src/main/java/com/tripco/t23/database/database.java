package com.tripco.t23.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

public class database {
    // db configuration information
    private static String myDriver = "com.mysql.jdbc.Driver";
    private static String myUrl = "jdbc:mysql://faure.cs.colostate.edu/cs314";
    private static String user="cs314-db";
    private static String pass="eiK5liet1uej";

    // fill in SQL queries to count the number of records and to retrieve the data
    //private final static String count = "";
    //private final static String search = "";

    public static void loginInfo() {
        // Here are some environment variables. The first one is set by default in
        // Travis, and the other we set ourselves (see the other guide)
        String isTravis = System.getenv("TRAVIS");
        String isDevelopment = System.getenv("CS314_ENV");

        // If we're running on Travis, use the proper url + credentials
        if(isTravis != null && isTravis.equals("true")) {
            myUrl = "jdbc:mysql://127.0.0.1/cs314";
            user = "travis";
            pass = null;
        }

        // else, use our credentials; also account for if we have our own dev
        // environment variable (see the other guide) for connecting through an SSH
        // tunnel
        else if(isDevelopment != null && isDevelopment.equals("development")) {
            myUrl = "jdbc:mysql://127.0.0.1:some-port/cs314";
            user = "cs314-db";
            pass = "eiK5liet1uej";
        }

        // Else, we must be running against the production database directly
        else {
            myUrl = "jdbc:mysql://faure.cs.colostate.edu/cs314";
            user = "cs314-db";
            pass = "eiK5liet1uej";
        }
    }

    public static Map[] callLoginAll(String match){
        String countString = "select count(id) from colorado where id like \'%" + match + "%\' or name like \'%" + match
                                + "%\' or municipality like \'%" + match +"%\' or type like \'%" + match + "%\' or latitude like \'%"
                                + match + "%\' or longitude like \'%" + match + "%\' order by name;";
        String searchString = "select id,name,municipality,type from colorado where id like \'%" + match + "%\' or name like \'%" + match
                                + "%\' or municipality like \'%" + match +"%\' or type like \'%" + match + "%\' or latitude like \'%"
                                + match + "%\' or longitude like \'%" + match + "%\' order by name;";
        return login(countString, searchString);
    }


    public static Map[] callLoginAllFiltered(String match, ArrayList<Map> narrow){
        String filterName;
        ArrayList<String> filterValues = new ArrayList<>();
        for(Map filter : narrow){
            //get each name variable
            filterName = filter.get("name").toString();

            //get the values variable corresponding to the names variable
            filterValues = (ArrayList) filter.get("values");

            //TODO:
            //build part of the countString/searchString using these variables and store them
        }

        //temporary copy of calLoginAll while tools to build final string are constructed
        String countString = "select count(id) from colorado where id like \'%" + match + "%\' or name like \'%" + match
                + "%\' or municipality like \'%" + match +"%\' or type like \'%" + match + "%\' or latitude like \'%"
                + match + "%\' or longitude like \'%" + match + "%\' order by name;";
        String searchString = "select id,name,municipality,type from colorado where id like \'%" + match + "%\' or name like \'%" + match
                + "%\' or municipality like \'%" + match +"%\' or type like \'%" + match + "%\' or latitude like \'%"
                + match + "%\' or longitude like \'%" + match + "%\' order by name;";
        return login(countString, searchString);
    }

    // Arguments contain the username and password for the database
    public static Map[] login(String count, String search){
        try  {
            Class.forName(myDriver);
            // connect to the database and query
            loginInfo();
            try (Connection conn = DriverManager.getConnection(myUrl, user, pass);
                 Statement stCount = conn.createStatement();
                 Statement stQuery = conn.createStatement();
                 ResultSet rsCount = stCount.executeQuery(count);
                 ResultSet rsQuery = stQuery.executeQuery(search)
            ) {
                //Once connection is found, do stuff here
                return printJSON(rsCount, rsQuery);
            }
        } catch (Exception e) {
            System.err.println("Exception: "+e.getMessage());
            return new Map[] {};
        }
    }

    private static Map[] printJSON(ResultSet count, ResultSet query) throws SQLException {
        // determine the number of results that match the query
        count.next();
        int results = count.getInt(1);

        Map[] values = new Map[results];
        int index = results;

        while(query.next()){
            Map tempMap = new HashMap();
            tempMap.put("id", query.getString("id"));
            tempMap.put("name", query.getString("name"));
            tempMap.put("municipality", query.getString("municipality"));
            tempMap.put("type", query.getString("type"));
            //TODO: Fix latitude and longitude (should not use getString)
            //tempMap.put("latitude", query.getString("latitude"));
            //tempMap.put("longitude", query.getString("longitude"));
            values[results - index] = tempMap;
            --index;
        }
        return values;
    }
}
