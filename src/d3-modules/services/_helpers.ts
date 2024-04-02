import { IGraphMapping, IMappingOption } from "@local/d3_types";

var trimColumns =  function(json,neededColumns) {

    json.forEach( (week,i) => {
        Object.keys(week).forEach( (key) => {
            if (neededColumns.indexOf(key) < 0) {
                delete week[key];
            }
        });
    });
    return json;
};


var trimColumnsAndOrder =  function(json,neededColumns) {

    let newArray = [];
    let newObject;

    json.forEach( (obj,i) => {

        newObject = {};
        neededColumns.forEach( (nc) => {
            newObject[nc] = obj[nc];
        });

        newArray.push(newObject)

    });

    return newArray;
}

var hasValue = function(array,value) {

    return array.filter( (i) =>{

        return i[value] !== null;
    })
}


export function thousands(number) {

    return number.toLocaleString('nl-NL');
}

export function miljarden(number) : string{
    return (number / 1000).toString();
}

export function convertToCurrency(number: number) {

    number = Math.ceil(number);

    return number.toLocaleString('nl-NL', {style: 'currency', currency: 'EUR', minimumFractionDigits: 0 });
}

export function convertToCurrencyInTable(number: number) {

    const toString = (number: number) => number.toLocaleString('nl-NL', {style: 'currency', currency: 'EUR', minimumFractionDigits: 0 });

    number = Math.ceil(number);
    return (number < 0) ? "(" + toString(-number) + ")" : toString(number)    
}


export function convertToLocale(n: string) {

    let f = parseFloat(n); 
    
    return f.toLocaleString('nl-NL');
}

export function convertToMillions(number: number) {


    return thousands(Math.round((number / (1000 * 1000)))).toString()  + 'M'
}

export function sanitizeCurrency(string: string) {

    let s = string.replace('€&nbsp;', '').split('.').join("");
    let number;

    if (s[0] == '(') {
        s = s.replace('(', '').replace(')', '')

        number = -parseFloat(s)
    } else if(s[0] == '-') {
        number = 0;
    } else if (!isNaN(parseFloat(s))){
        number = parseFloat(s)
    } 

    return number != undefined ? number : s;
}



export function shortenCurrency(string) {

    if (string.length < 7) {
        return string;
    } else if (string.length < 11) {
        return string.slice(0,string.length - 4) + 'K';
    } else {
        return string.slice(0,string.length - 6) + 'M';
    }
}

export function displayDate(date) {

    date = new Date(date);
    return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
}

export function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

// export function getFirstMapping(o: GraphObject) {

//         let m: any = o.mapping[0];

//         while (true) {

//             if (!m.column) {
//                 m = m[0]              
//             } else {
               
//                 return {
//                     column : m.column || "",
//                     label: m.label,
//                     colour: m.colour,
//                     units: m.units,
//                     format: m.format
//                 }
//             }

//         }
// }

export function getParameter(o: IGraphMapping, i: number) {

    // if(o && o != true) {
    
        let m: any = o.parameters[i];

        while (true) {

            if (!m.column) {
                m = m[0]              
            } else {
            
                return {
                    column : m.column || "",
                    label: m.label,
                    colour: m.colour,
                    units: m.units,
                    format: m.format
                }
            }
        }
    // }
}

export function getMappingKey(m: IMappingOption, key: string) : string {

    return  m[key].toString();
}

export function flattenColumn(column: string | string[]) : string {

    return Array.isArray(column) ? column[0] : column;
} 

export function flattenArray(array: any[]) {
    var result = [];
    array.forEach(function (a) {
        if (Array.isArray(a)) {
            a.forEach( (aa,i) => {
                result.push(aa);
            });
        } else {
            result.push(a);
        }
    });
    return result;
}


export function groupBy<T>(arr: T[], fn: (item: T) => any) {
    return arr.reduce<Record<string, T[]>>((prev, curr) => {
        const groupKey = fn(curr);
        const group = prev[groupKey] || [];
        group.push(curr);
        return { ...prev, [groupKey]: group };
    }, {});
}


export const bePositive = (n: number) => n < 0 ? -n : n

export const standardDeviation = (arr, usePopulation = false) => {
    const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
    
    const stdev =  Math.sqrt(
      arr
        .reduce((acc, val) => acc.concat((val - mean) ** 2), [])
        .reduce((acc, val) => acc + val, 0) /
        (arr.length - (usePopulation ? 0 : 1))
    );

    return {
        mean,
        stdev
    }
  };