

import { filterUnique } from '@local/eiti-services';
import { convertToCurrencyInTable, standardDeviation } from '../../shared/_helpers';
import { GroupControllerV1 } from '../../shared/group-v1';
import { IGroupMappingV2 } from '../../shared/interfaces';
import { DataObject, EitiData } from '../../shared/types';
import { TableData } from '../../shared/types_graphs';
import { formatReconData } from '../reconciliation.data';


export class ReconciliatieIntroGroupV1 extends GroupControllerV1 { 

    bars = {};
    bells = {};
    funcList;
    scatter;
    table;

    htmlHeader;
    yearSelector;

    uniqueYears;

    constructor(
        public page: any,
        public config: IGroupMappingV2,
    ){
       super(page,config);
    }

    html() {

        return super.html()
    }

    init() {
    }

    prepareData(data: EitiData) : any {


        const dataGroup = "reconciliation"; 
        const totals: any[] = [];
        const distributions: any[] = [];
        const key = "discrepancy_company_relative";
        const key2 = "discrepancy_government_relative";

        if (data[dataGroup] == undefined ) return;

        const uniqueYears = filterUnique(data[dataGroup], 'year');
  
        const keys = Object.keys(data[dataGroup][0]).filter( k => ["origin","entity_name","sector","type","year"].indexOf(k) < 0);

        for (const year of uniqueYears.filter( y => y != "all")) {

            // if (year != 2018) return;

            const reports = formatReconData(data[dataGroup].filter( (r) => r.year === year));

            const total = {
                "origin" : "total",
                "entity_name" : "total",
                "sector" : "-",
                "type" : "-",
                "year" : year
            }

            const totalOutcomeCompanies = reports.map( r => r["payments_companies"]).reduce( (a,b) => a + b, 0);
            const totalOutcomeGovernment = reports.map( r => r["payments_government"]).reduce( (a,b) => a + b, 0);


            const  diff = 10000000000 * (totalOutcomeCompanies - totalOutcomeGovernment) / totalOutcomeGovernment;
    
            for (const key of keys) {
                total[key] =  reports.map( r => r[key]).reduce( (a,b) => a + b, 0);
            }


            totals.push(total);

            const values = reports.map( r => r[key]).filter( r => !isNaN(r) && r != Infinity).concat(reports.map( r => r[key2]).filter( r => !isNaN(r) && r != Infinity))
            const { mean, stdev } =  standardDeviation(values);

            const halfStdev = stdev / 2;

            const bands: any[] = [];

            for (let i = -14; i < 14; i++) {
                
                bands.push({
                    "type" : "company",
                    "label" : i,
                    "lower" : i * halfStdev, 
                    "upper" : (i + 1) * halfStdev,
                    "count": null,
                    "year": year
                })

                bands.push({
                    "type" : "government",
                    "label" : i,
                    "lower" : i * halfStdev, 
                    "upper" : (i + 1) * halfStdev,
                    "count": null,
                    "year": year
                })
            }

            for (const band of bands.filter( b=> b.type == 'company')) {
                    
                band.count = reports.filter (r => r[key] >= band.lower && r[key] < band.upper).length
            }

            for (const band of bands.filter( b=> b.type == 'government')) {
                    
                band.count = reports.filter (r => r[key2] >= band.lower && r[key2] < band.upper).length
            }

            distributions.push(bands);
        }

        let totalTotal = {
            "origin" : "total",
            "entity_name" : "total",
            "sector" : "-",
            "type" : "-",
            "year" : "all"
        }

        for (const key of keys) {
            totalTotal[key] = totals.map( r => r[key]).reduce( (a,b) => a + b, 0);
        }

        totals.push(totalTotal);

        let totalDistributionBands: any[] = [];

        const allReports = formatReconData(data[dataGroup]).filter( (r) => r[key] < 5000 && r[key2] < 5000 )

        const values = allReports.map( r => r[key]).filter( r => !isNaN(r)).concat(allReports.map( r => r[key2]).filter( r => !isNaN(r)))
            
        const { mean, stdev } =  standardDeviation(values);
        const halfStdev = stdev / 2;

        for (let i = -14; i < 14; i++) {
                
            totalDistributionBands.push({
                "type" : "company",
                "label" : i,
                "lower" : i * halfStdev, 
                "upper" : (i + 1) * halfStdev,
                "count": null,
                "year": "all"
            })

            totalDistributionBands.push({
                "type" : "government",
                "label" : i,
                "lower" : i * halfStdev, 
                "upper" : (i + 1) * halfStdev,
                "count": null,
                "year": "all"
            })
        }

        for (const band of totalDistributionBands.filter( b=> b.type == 'company')) {
                    
            band.count = allReports.filter (r => r[key] >= band.lower && r[key] < band.upper).length
        }

        for (const band of totalDistributionBands.filter( b=> b.type == 'government')) {
                
            band.count = allReports.filter (r => r[key2] >= band.lower && r[key2] < band.upper).length
        }

        distributions.push(totalDistributionBands);


        // table

        const rows : any[] = [];

        for (let total of totals.filter( t => t.year != 'all').reverse()) {

            rows.push([
                "Totaal", 
                total.year, 
                convertToCurrencyInTable(total.payments_government_reported) + "M", 
                convertToCurrencyInTable(total.payments_companies_reported) + "M", 
                convertToCurrencyInTable(total.payments_government) + "M",
                convertToCurrencyInTable(total.payments_companies) + "M", 
                
            ])
        }

        let headers : string[] = [];

        if (this.page.main.params.language == 'en') {

            headers = ["Company","Year"].concat(this.config.graphs[0].parameters[0].map( p => p.label_en != undefined ? p.label_en : ""));

        } else {

            headers = ["Bedrijf","Jaar"].concat(this.config.graphs[0].parameters[0].map( p => p.label));

        }

        const table = {

            headers,
            rows
        };

        return {
            distributions,
            totals : totals.reverse(),
            table
        }
    }

    
    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    }

    update(data: DataObject, segment: string, update: boolean) {

        super.update(data,segment,update)
    }   

}
