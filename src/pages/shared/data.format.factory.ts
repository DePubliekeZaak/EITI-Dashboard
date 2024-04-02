import {  GeoJsonFeature, Line, Lines } from "./types_graphs";
import { DataPart } from "./types";


export const filterUnique = (data: any[],key: string): (string|number)[] => {

    const uniques: (string|number)[] = [];

    for (const report of data) {

        const slug = report[key];
        if (uniques.indexOf(slug) < 0) {
            uniques.push(slug); 
        }
    }

    return uniques;
}

export const uniques = (array : string[]): string[] => {

    const uniques: (string)[] = [];

    for (const s of array) {

        if (uniques.indexOf(s) < 0) {
            uniques.push(s); 
        }
    }

    return uniques;
}

export const uniquesWithCount = (data: any[],key: string): { [key: string] : number } => {

    const o = {};
    const uniques: (string|number)[] = [];

    for (const report of data) {

        const slug = report[key];
        if (uniques.indexOf(slug) < 0) {
            uniques.push(slug); 
        }
    }

    for (const u of uniques) {

        o[u] = data.filter( d => d[key] == u).length
    }

    return o;
}

export const filterUniqueGeoFeatures = (data: GeoJsonFeature[],key: string): (string|number)[] => {

    const uniques: (string|number)[] = [];

    for (const feature of data) {

        const slug = feature.properties[key];
        if (uniques.indexOf(slug) < 0) {
            uniques.push(slug); 
        }
    }

    return uniques;
}

export const formatLines = (data: any, keyForLine: string, keyForValue: string, keyForLabel: string): Lines => { 
    // data = (EitiReport|EitiPayments)

    let readyForLines: Lines = [];

    for (const unique of filterUnique(data,keyForLine)) {

        const line : Line = [];

        for (const year of filterUnique(data,"year").slice()) {

            const object = data.find( (r)  => r[keyForLine] == unique && r.year == year);
            const value = object != undefined ? object[keyForValue] : 0;
            const label = object != undefined || object != null ? object[keyForLabel] : "";

            if(label != null) {

                line.push({
                    label,
                    time: year,
                    value
                })

            }
        }

        readyForLines.push(line);
    }

    readyForLines = readyForLines.filter( (line) => {

        let bool = false;
        const values = line.map( l => l.value);

        for (const v of values) {
            if (v != 0) {
                bool = true
            }
        }
        

        return bool
    })

    return readyForLines;
    
}