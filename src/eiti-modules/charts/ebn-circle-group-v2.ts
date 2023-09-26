import { AxesService, ChartDimensions, ChartObject, GraphControllerV2, IGraphControllerV2, ScaleService, SvgService } from '@local/d3_graphs';


import { DataPart, GraphData, TCtrlrs } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints } from '@local/styleguide';
import { HTMLCompany, HtmlFunctionality, HtmlHeader, HtmlLegend, HTMLSector, HTMLTable, HTMLYear, HtmlYearSelector } from '@local/elements';
import { groupBy, slugify } from '@local/d3-services';
import { charts }  from '@local/charts';
import { EitiCompanies, EitiData, EitiPayments, EitiReport } from '@local/d3_types/data';
// import *  as d3 from 'd3';
// import { group } from 'd3';
import { filterUnique, parseEBN } from '@local/eiti-services';
import { bePositive, convertToCurrencyInTable } from '@local/d3-services/_helpers';


// can this be a wrapper for multiple graphcontrollers?
export  class EbnCircleGroupV2 { //extends GraphControllerV2 {

// companies: EitiReport[][] = [];
    ctrlrs: TCtrlrs = {};
    scatter;
    funcList;
    htmlHeader;
    yearSelector;
    uniqueSectors;
    uniqueYears;
    uniqueCompanies;
    table;
    indicators;

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

        if (this.mapping.multiGraph) {
            this.htmlHeader = new HtmlHeader(this.element, this.mapping.header,this.mapping.description);
            this.htmlHeader.draw(); 
        }

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList = new HtmlFunctionality(this,this.element,this.mapping,this.segment);
        }

        const legend = new HtmlLegend(this)

        const wrapper = document.createElement('section');
        wrapper.classList.add('graph-container-12');
        wrapper.classList.add('graph-wrapper');
        wrapper.style.marginTop = "3rem";
        this.element.appendChild(wrapper);

        const data = this.prepareData(this.data);

        if (this.mapping.functionality.indexOf('tableView') > -1) {
            this.table = new HTMLTable(this,this.element);
            this.table.draw(data.table);
        }



        let i = 0;
        for (const dataGroup of data.grouped) {

            // how to sort when its an object ? 
            const slug = dataGroup[0].year.toString();

            const container = document.createElement('article');
            container.classList.add('graph-container-6');
            container.classList.add(slug);
            wrapper.appendChild(container);

            // create entity-info-element
          //  new HTMLSector(this, container, dataGroup[0].payment_stream);
            new HTMLYear(this,container,slug)

            // probeer met bolletjes
            this.ctrlrs[slug] = new charts.EbnCirclesV2(this.main, { "payments": dataGroup}, container, this.mapping,"2022",data.range, i);
            this.ctrlrs[slug].init();

            i++;
        }

        this.update(this.data,this.segment, false);

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

    }

    prepareData(data: EitiData) : any {

       const dataGroup = "payments";
       const grouped: EitiPayments[][] = [];
       let values = [];
 
       for (let year of filterUnique(data[dataGroup],"year").reverse()) {
            
            const items = data[dataGroup].filter( 
                p => 
                p.year == year
                && ["sales","costs"].indexOf(p.payment_stream) > -1 
            )
            grouped.push(items)
            values = values.concat(items.map( p => 1000 * 1000 * bePositive(p.payments_companies) ))
       }




       const range = [0,0,window.d3.min(values),window.d3.max(values)];



       // FOR TABLE

       

       const rows = []

       const columnArray = filterUnique(this.data[dataGroup],"year");
       const rowArray = filterUnique(this.data[dataGroup],"origin");
 
       const labels = this.mapping.parameters[0].map( p => p.label);

       const items =  [];  // data[dataGroup].filter( p =>  ["sales","costs"].indexOf(p.payment_stream) > -1  );


       for (const year of grouped) {


        const nam = [];
        const participants = []; 
            for (const company of filterUnique(this.data[dataGroup],"origin")) {

                const costs = year.find( p => p.payment_stream == "costs" && p.recipient == company);
                const sales = year.find( p => p.payment_stream == "sales" && p.origin == company);

                if (sales != undefined) { 

                    const row = [
                        year[0].year,
                        sales.origin_name != undefined ? sales.origin_name : sales.origin, 
                        convertToCurrencyInTable(costs.payments_companies * 1000 * 1000),
                        convertToCurrencyInTable(sales.payments_companies * 1000  * 1000)
                    ];

                    rows.push(row)

                }
            }
       }

       // samenvoegen

    //         const options: { [key: string] : any[] } = parseEBN(this.mapping,this.data[dataGroup].filter( p => p.year == year));

    //         let row = [year];

    //         for (let aa of Object.values(options))  {
    //             for (const a of aa) {
    //                 row = row.concat(convertToCurrencyInTable(a));
    //             }
    //         }

    //         rows.push(row);
    //    }

       const table = {
           headers: ["Jaar","Bedrijf","Ontvangsten","Betalingen"],
           rows
       }

       return {
           range,
           grouped,
           table
       }
    }

    
    async update(data: any, segment: string, update: boolean) {

        this.segment = segment;

        if(update) {

            data = this.prepareData(data);

            for (let [slug, graph] of Object.entries(this.ctrlrs)) {

                const indicatorData = data.grouped.find( g => slugify(g[0].payment_stream) === slug);
            
                if(indicatorData != undefined) {
                    graph.update(indicatorData,segment,update,data.range)
                } else {
                    console.log(slug + ' is leeg? ?? ')
                    // nog ondervangen!!1
                }
            }
        }

    } 
}
