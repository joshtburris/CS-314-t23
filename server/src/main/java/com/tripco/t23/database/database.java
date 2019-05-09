package com.tripco.t23.database;

import java.sql.*;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

public class database {
    // db configuration information
    private static String myDriver = "com.mysql.jdbc.Driver";
    private static String myUrl = "jdbc:mysql://faure.cs.colostate.edu/cs314";
    private static String user="cs314-db";
    private static String pass="eiK5liet1uej";

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

    //Function which has a prebuilt request to the database to return everything matching the string requested
    //match: String searched for in database
    public static Map[] callLoginAll(String match){
        String countString = "select count(id) from world where id like \'%" + match + "%\' or name like \'%" + match
                                + "%\' or municipality like \'%" + match +"%\' or type like \'%" + match + "%\' or latitude like \'%"
                                + match + "%\' or longitude like \'%" + match + "%\' order by name;";
        String searchString = "select id,name,municipality,type,latitude,longitude from world where id like \'%" + match + "%\' or name like \'%" + match
                                + "%\' or municipality like \'%" + match +"%\' or type like \'%" + match + "%\' or latitude like \'%"
                                + match + "%\' or longitude like \'%" + match + "%\' order by name;";
        return login(countString, searchString);
    }

    //function that builds a request to the database to return everything matching the string requested
    //while also filtering by variables
    //match: String searched for in database
    //narrow: Array of maps containing "name" and "variables" keys. "name" specifies the item to filter by
    //        and "variables" specifies an array containing the items to filter by in "name"
    public static Map[] callLoginAllFiltered(String match, ArrayList<Map> narrow){
        String filterName;
        ArrayList<String> filterValues;
        String finalFilter = "";
        for(Map filter : narrow){
            //get each name variable
            filterName = filter.get("name").toString();
            if (filterName.equals("country")){
                filterName = "iso_country";
            }
            //get the values variable corresponding to the names variable
            filterValues = (ArrayList) filter.get("values");

            if(filterValues.size() > 0) {
                //build the end of the countString/searchString using the variables defined prior
                finalFilter += " and (";

                //goes through each map and builds the string for each filter
                for (int i = 0; i < filterValues.size(); i++) {
                    finalFilter += filterName + " like \'%" + filterValues.get(i) + "%\'";

                    //add an or for the next item in the list, if it exists
                    if (i + 1 < filterValues.size()) {
                        finalFilter += " or ";
                    }
                }
                //build the end of the string
                finalFilter += ")";
            }
        }
        //build the end of the string
        finalFilter += " order by name;";

        //temporary copy of calLoginAll while tools to build final string are constructed
        String countString = "select count(id) from world where (id like \'%" + match + "%\' or name like \'%" + match
                + "%\' or municipality like \'%" + match +"%\' or type like \'%" + match + "%\' or latitude like \'%"
                + match + "%\' or longitude like \'%" + match + "%\')" + finalFilter;
        String searchString = "select id,name,municipality,type,latitude,longitude from world where (id like \'%" + match + "%\' or name like \'%" + match
                + "%\' or municipality like \'%" + match +"%\' or type like \'%" + match + "%\' or latitude like \'%"
                + match + "%\' or longitude like \'%" + match + "%\')" + finalFilter;
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
        // get the number of columns
        ResultSetMetaData meta = query.getMetaData();
        int columns = meta.getColumnCount();

        // determine the number of results that match the query
        count.next();
        int results = count.getInt(1);

        Map[] values = new Map[results];
        int index = results;

        while(query.next()){
            Map tempMap = new HashMap();
            for(int i = 1; i <= columns; ++i){
                tempMap.put(meta.getColumnName(i), query.getObject(i));
            }
            values[results - index] = tempMap;
            --index;
        }
        return values;
    }
}
