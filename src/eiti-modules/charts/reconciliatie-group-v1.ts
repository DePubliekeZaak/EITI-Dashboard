import { AxesService, ChartDimensions, ChartObject, GraphControllerV2, IGraphControllerV2, ScaleService, SvgService } from '@local/d3_graphs';


import { DataPart, GraphData, TCtrlrs } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints } from '@local/styleguide';
import { HTMLCompany, HtmlHeader, HtmlYearSelector } from '@local/elements';
import { groupBy } from '@local/d3-services';
import { charts }  from '@local/charts';
import { EitiCompanies, EitiData, EitiReport } from '@local/d3_types/data';
// import *  as d3 from 'd3';
// import { group } from 'd3';
import { filterUnique } from '@local/eiti-services';


// can this be a wrapper for multiple graphcontrollers?
export default class ReconciliatieGroupV1 { //extends GraphControllerV2 {

// companies: EitiReport[][] = [];
    ctrlrs: TCtrlrs = {};
    scatter;

    htmlHeader;
    yearSelector;

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

        const wrapper = document.createElement('section');
        wrapper.classList.add('graph-container-12');
        wrapper.classList.add('graph-wrapper');
        this.element.appendChild(wrapper);

        const data = this.prepareData(this.data);

        let i = 0;
        for (const company of data.grouped) {

            // how to sort when its an object ? 
            const slug = company[0].origin

            const container = document.createElement('article');
            container.classList.add('graph-container-4');
            container.classList.add(slug);
          //  wrapper.style.marginBottom = "2rem";
            wrapper.appendChild(container);

            // create entity-info-element
            new HTMLCompany(this,container,company);

            // probeer met bolletjes
            this.ctrlrs[slug] = new charts.ReconciliatieBarsDiffV1(this.main, company, container, this.mapping,"2022", data["diff_range"],i);
            this.ctrlrs[slug].init();

            i++;
        }



        this.update(this.data,this.segment, true);

    }

    prepareData(data: EitiData) : any {

    //    const uniqueCompanies = [];
       const grouped: EitiReport[][] = [];
       const total_values = [];
       let diff_values = [];

       const dataGroup = "company_payments";

       const uniqueCompanies = filterUnique(data[dataGroup],"origin");


       // filter year
       // group by gov? -- there is only one .. not grouping 

       for (let report of data[dataGroup]) {

            for (let m of this.mapping.parameters[0]) {
                total_values.push(report[m['column']])
            }

            report['company_diff_percentage'] = (report["payments_companies"] - report["payments_companies_reported"]) / report["payments_companies"];
            report['gov_diff_percentage'] = (report["payments_government"] - report["payments_government_reported"]) / report["payments_government"]

            if(report.origin !== 'spirit_energy') {

                diff_values.push(report['company_diff_percentage'])
                diff_values.push(report['gov_diff_percentage'])
            }

       }
        
       for (let uc of uniqueCompanies.slice()) {

            grouped.push(data[dataGroup].filter( r => r.origin == uc));    
       }

       grouped.sort((a,b) => {
            return b[0].payments_companies - a[0].payments_companies
       })

       return {
        diff_range: [window.d3.min(diff_values) * 100,window.d3.max(diff_values) * 100],
        grouped
       }
    }

    
    async update(data: any, segment: string, update: boolean) {

        this.segment = segment;

        data = this.prepareData(data);

        if(update) {

            for (let [slug, graph] of Object.entries(this.ctrlrs)) {

                const companyData = data.grouped.find( g => g[0].origin === slug);
            
                if(companyData != undefined) {
                    graph.update(companyData,segment,update,data.diff_range)
                } else {
                    console.log(slug + ' is leeg? ?? ')
                    // nog ondervangen!!1
                }
            }
        }

    } 
}
