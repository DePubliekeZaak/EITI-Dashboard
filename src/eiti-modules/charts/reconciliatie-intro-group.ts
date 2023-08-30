import { TCtrlrs } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { HtmlFunctionality, HtmlHeader, HTMLTable, HTMLYear } from '@local/elements';
import { EitiData } from '@local/d3_types/data';
import { filterUnique, formatReconData } from '@local/eiti-services';
import { ReconciliatieIntroBarsV1 } from './reconciliatie-intro-bars-v1';
import { ReconciliatieIntroBellsV1 } from './reconciliatie-bell-curve-v1';
import { standardDeviation } from '@local/d3-services';
import { convertToCurrencyInTable } from '@local/d3-services/_helpers';


// can this be a wrapper for multiple graphcontrollers?
export class ReconciliatieIntroGroupV1 { //extends GraphControllerV2 {

// companies: EitiReport[][] = [];
    bars = {};
    bells = {};
    funcList;
    ctrlrs: TCtrlrs = {};
    scatter;
    table;

    htmlHeader;
    yearSelector;

    uniqueYears;

    constructor(
        public main: any,
        public data : any,
        public element : HTMLElement,
        public mapping: IGraphMapping,
        public segment: string  
    ){
        // super(main,data,element,mapping,segment) 
        // this.pre();
    }

    init() {

        const self = this;
        const dataGroup = "reconciliation"; 

        // if (this.mapping.header) {
            this.htmlHeader = new HtmlHeader(this.element, this.mapping.header,this.mapping.description);
            this.htmlHeader.draw(); 
        // }

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList = new HtmlFunctionality(this,this.element,this.mapping,this.segment);
        }

        const wrapper = document.createElement('section');
        wrapper.classList.add('graph-container-12');
        wrapper.classList.add('graph-wrapper');
        this.element.appendChild(wrapper);

        this.uniqueYears = filterUnique(this.data[dataGroup],"year").concat("all")

        const data = this.prepareData(this.data);

        if (this.mapping.functionality.indexOf('tableView') > -1) {
            this.table = new HTMLTable(this,this.element);
            this.table.draw(data.table);
        }

        for (const year of this.uniqueYears.reverse().slice()) {

            this.bars[year] = new ReconciliatieIntroBarsV1(this,data.totals.find( r => r.year == year),wrapper,this.mapping,year,[],0);
            this.bars[year].init();
            this.bells[year] = new ReconciliatieIntroBellsV1(this,data.distributions.find( r => r[0].year == year),wrapper,this.mapping,year,[],0);
            this.bells[year].init();
        }

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }
    }

    prepareData(data: EitiData) : any {


        const dataGroup = "reconciliation"; 
        const totals = [];
        const distributions = [];
        const key = "discrepancy_company_relative";
        const key2 = "discrepancy_government_relative";
  

        const keys = Object.keys(data[dataGroup][0]).filter( k => ["origin","entity_name","sector","type","year"].indexOf(k) < 0);

        for (const year of this.uniqueYears.filter( y => y != "all")) {

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

            const values = reports.map( r => r[key]).filter( r => !isNaN(r)).concat(reports.map( r => r[key2]).filter( r => !isNaN(r)))
            
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

            // console.log(bands);

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


        let totalDistributionBands = [];

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

        const rows = [];

        for (let total of totals.filter( t => t.year != 'all').reverse()) {

            rows.push([
                "Totaal", 
                total.year, 
                convertToCurrencyInTable(total.payments_companies_reported) + "M", 
                convertToCurrencyInTable(total.payments_government_reported) + "M", 
                convertToCurrencyInTable(total.payments_companies) + "M", 
                convertToCurrencyInTable(total.payments_government) + "M"
            ])
        }

        const table = {

            headers:  ["Bedrijf","Jaar"].concat(this.mapping.parameters[0].map( p => p.label)),
            rows
        };


        return {
            distributions,
            totals,
            table
        }
    }

    
    async update(data: any, segment: string, update: boolean) {

        this.segment = segment;

        data = this.prepareData(data);

        for (const year of this.uniqueYears) {

            this.bars[year].update();

        }

        // if(update) {

        //     for (let [slug, graph] of Object.entries(this.ctrlrs)) {

        //         const yearData = data.find( g => g[0].year === slug);
            
        //         if(yearData != undefined) {
        //             graph.update(yearData,segment,update,null)
        //         } else {
        //             console.log(slug + ' is leeg? ?? ')
        //             // nog ondervangen!!1
        //         }
        //     }
        // }

    } 
}
