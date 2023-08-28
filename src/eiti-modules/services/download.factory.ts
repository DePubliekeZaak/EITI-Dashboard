import { sanitizeCurrency } from "../../d3-modules/services/_helpers";



export const tableToCSV = (element:  HTMLElement) => {

    // Variable to store the final csv data
    var csv_data = [];
    
    // Get each row data
    var rows = element.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
    
        // Get each column data
        var cols = rows[i].querySelectorAll('td,th');
    
        // Stores each csv row data
        var csvrow = [];
        for (var j = 0; j < cols.length; j++) {
    
            // Get the text data of each cell of
            // a row and push it to csvrow
            const v = sanitizeCurrency(cols[j].innerHTML);
            csvrow.push(v);
        }
    
        // Combine each column value with comma
        csv_data.push(csvrow.join(","));
    }
    // combine each row data with new line character
    return csv_data.join('\n');
    
    /* We will use this function later to download
    the data in a csv file downloadCSVFile(csv_data);
    */
}