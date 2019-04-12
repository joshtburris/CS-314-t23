import { saveAs } from 'file-saver';

export default class Saver{
    //prevent object from being created

    static save(plan, fileType){
        switch (fileType) {
            case "json":
                Saver.saveJSON(plan);
                break;
            case "csv":
                Saver.saveCSV(plan);
                break;
            default:
                console.log("File-type error save aborted");

        }
    }

    static saveJSON(plan){
        let file = new Blob([JSON.stringify(plan)], {type: "text/plain;charset=utf-8"});  // Source="https://www.npmjs.com/package/file-saver/v/1.3.2"
        saveAs(file, "MyItinerary.json");
    }

    static saveCSV(places){
        //inefficient way of generating     file consider changing
        let CSV = "";
        console.log("places: ", places);
        for(let i in places){
            console.log("PLACE", places[i]);
            for(let attribute in places[i]){
                CSV = CSV + places[i][attribute].toString() + ", ";
            }
            CSV = CSV + "\n"
        }
        let file = new Blob([CSV],{type: "text/plain;charset=utf-8"});
        saveAs(file, "MyItinerary.csv")
    }
}