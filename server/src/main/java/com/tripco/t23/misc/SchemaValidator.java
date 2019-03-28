package com.tripco.t23.TIP;


import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.google.gson.JsonObject;
import org.everit.json.schema.SchemaException;
import org.everit.json.schema.loader.SchemaLoader;
import org.everit.json.schema.Schema;
import org.everit.json.schema.ValidationException;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//Code modified from tripco/SchemaValidator
public class SchemaValidator {

    private static final Logger log = LoggerFactory.getLogger(SchemaValidator.class);
    private JSONObject json;
    private Schema schema;


    public SchemaValidator(String json, String schema_path){
        try (InputStream inputStream = getClass().getResourceAsStream(schema_path)) {
            JSONObject rawSchema = new JSONObject(new JSONTokener(inputStream));
            this.schema = SchemaLoader.load(rawSchema);
        }
        catch (IOException e) {
            log.error(e.toString());
            return;
        }
        try{
            this.json = new JSONObject(json);
        }
        catch (JSONException e) {
            log.error("Caught exception when constructing JSON objects!");
            e.printStackTrace();
            return;
        }
        log.trace("SchemaValidator created");
        log.trace(this.json.toString());
        log.trace(this.schema.toString());
    }

    private static JSONObject parseJsonFile(String path) {
        // Here, we simply dump the contents of a file into a String (and then an object);
        // there are other ways of creating a JSONObject, like from an InputStream...
        // (https://github.com/everit-org/json-schema#quickstart)
        log.trace("Attempting to parse schema file");
        JSONObject parsedObject = null;
        try {
            byte[] jsonBytes = Files.readAllBytes(Paths.get(path));
            parsedObject = new JSONObject(new String(jsonBytes));
        }
        catch (IOException e) {
            log.error("Caught exception when reading files!");
            e.printStackTrace();
        }
        catch (JSONException e) {
            log.error("Caught exception when constructing JSON objects!");
            e.printStackTrace();
        }
        finally {
            log.trace("Succesfully parsed schema file");
            return parsedObject;
        }
    }

    public boolean performValidation() {
        boolean validationResult = true;
        try {
            // This is the line that will throw a ValidationException if anything doesn't conform to the schema!
            this.schema.validate(json);
        }
        catch (SchemaException e) {
            log.error("Caught a schema exception!");
            e.printStackTrace();
            validationResult = false;
        }
        catch (ValidationException e) {
            log.error("Caught validation exception when validating schema! Root message: {}", e.getErrorMessage());
            log.error("All messages from errors (including nested):");
            // For now, messages are probably just good for debugging, to see why something failed
            List<String> allMessages = e.getAllMessages();
            for (String message : allMessages) {
                log.error(message);
            }
            validationResult = false;
        }
        finally {
            return validationResult;
        }
    }
}