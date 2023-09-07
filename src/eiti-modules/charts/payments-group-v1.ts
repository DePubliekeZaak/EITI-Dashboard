import { AxesService, ChartDimensions, ChartObject, GraphControllerV2, IGraphControllerV2, ScaleService, SvgService } from '@local/d3_graphs';


import { DataPart, GraphData, TCtrlrs } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints } from '@local/styleguide';
import { HTMLCompany, HtmlFunctionality, HtmlHeader, HTMLSector, HTMLTable, HTMLYear, HtmlYearSelector } from '@local/elements';
import { groupBy, slugify } from '@local/d3-services';
import { charts }  from '@local/charts';
import { EitiCompanies, EitiData, EitiReport } from '@local/d3_types/data';
import *  as d3 from 'd3';
import { group } from 'd3';
import { filterUnique } from '@local/eiti-services';
import { convertToCurrencyInTable } from '@local/d3-services/_helpers';


// can this be a wrapper for multiple graphcontrollers?
export  class PaymentsGroupV1 { //extends GraphControllerV2 {

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

        if (this.mapping.header) {
            this.htmlHeader = new HtmlHeader(this.element, this.mapping.header,this.mapping.description);
            this.htmlHeader.draw(); 
        }

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList = new HtmlFunctionality(this,this.element,this.mapping,this.segment);
        }

        const wrapper = document.createElement('section');
        wrapper.classList.add('graph-container-12');
        wrapper.classList.add('graph-wrapper');
  
        this.element.appendChild(wrapper);

        const data = this.prepareData(this.data);

        if (this.mapping.functionality.indexOf('tableView') > -1) {
            this.table = new HTMLTable(this,this.element);
            this.table.draw(data.table);
        }

        let i = 0;
        for (const sectorData of data.grouped) {

            // how to sort when its an object ? 
            const slug = slugify(sectorData[0].sector);

            const container = document.createElement('article');
            container.classList.add('graph-container-12');
            container.classList.add(slug);
            wrapper.appendChild(container);

            // create entity-info-element
            new HTMLSector(this,container,sectorData[0].sector);

            // probeer met bolletjes
            this.ctrlrs[slug] = new charts.BetalingenBarsV1(this.main, { "reconciliation": sectorData}, container, this.mapping,"2022", data.range,i);
            this.ctrlrs[slug].init();

            i++;
        }

        this.update(this.data,this.segment, false);

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

    }

    prepareData(data: EitiData) : any {

       const dataGroup = "reconciliation";
       this.uniqueSectors = filterUnique(this.data[dataGroup],"sector");
       const grouped: EitiReport[][] = [];
 
       for (let us of this.uniqueSectors.slice()) {
            grouped.push(data[dataGroup].filter( r => r.sector == us));    
       }

       const values = data[dataGroup].map( r => r.payments_companies);
       const range = [d3.min(values),d3.max(values)];


       // FOR TABLE

       const rows = []

       const columnArray = filterUnique(this.data[dataGroup],"year");
       const rowArray = filterUnique(this.data[dataGroup],"origin");
       rowArray.sort( (a: string, b: string) => a.localeCompare(b))
       const rowName = "entity_name";
       const rowSlug = "origin";
       const columnName = "year";
       const columnSlug = "year";
       const valueKey = "payments_companies"


       for (const r of rowArray) {

            const row = [];
            row.push(data[dataGroup].find( (s) => s[rowSlug] === r)[rowName]);
         //   row.push(data[dataGroup].find( (s) => s[rowSlug] === r)["sector"]);

            for (const c of columnArray) {

                const item = data[dataGroup].find( (s) => s[columnSlug] === c && s[rowSlug] == r);
                row.push(item != undefined ?  convertToCurrencyInTable(item[valueKey] * 1000 * 1000) : "-")
            }


            rows.push(row)
       }


       const table = {
           headers: ["Bedrijf"].concat(columnArray.map( y => y.toString())),
           rows
       }

       return {
           grouped,
           range,
           table
       }
    }

    
    async update(data: any, segment: string, update: boolean) {

        this.segment = segment;

        if(update) {

            data = this.prepareData(data);
                   
            for (let [slug, graph] of Object.entries(this.ctrlrs)) {

                const sectorData = data.grouped.find( g => slugify(g[0].sector) === slug);
            
                if(sectorData != undefined) {
                    graph.update(sectorData,segment,update,data.range)
                } else {
                    console.log(slug + ' is leeg? ?? ')
                    // nog ondervangen!!1
                }
            }
        }

    } 
}
