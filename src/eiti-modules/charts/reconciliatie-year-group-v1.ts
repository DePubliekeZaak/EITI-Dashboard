import { AxesService, ChartDimensions, ChartObject, GraphControllerV2, IGraphControllerV2, ScaleService, SvgService } from '@local/d3_graphs';


import { DataPart, GraphData, TCtrlrs } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints } from '@local/styleguide';
import { HTMLCompany, HtmlHeader, HTMLYear, HtmlYearSelector } from '@local/elements';
import { charts }  from '@local/charts';
import { EitiData, EitiReport } from '@local/d3_types/data';
import *  as d3 from 'd3';
import { filterUnique } from '@local/eiti-services';
import { bePositive } from '@local/d3-services/_helpers';


// can this be a wrapper for multiple graphcontrollers?
export class ReconciliatieYearGroupV1 { //extends GraphControllerV2 {

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
        for (const year of data) {

            // how to sort when its an object ? 
            const slug = year[0].year

            const container = document.createElement('article');
            container.classList.add('graph-container-12');
            container.classList.add(slug);
          //  wrapper.style.marginBottom = "2rem";
            wrapper.appendChild(container);

            // create entity-info-element
            new HTMLYear(this,container,slug);

            // probeer met bolletjes
            this.ctrlrs[slug] = new charts.ReconciliatieByYearV1(this.main, year, container, this.mapping,"2022",null,i);
            this.ctrlrs[slug].init();

            i++;
        }
        this.update(this.data,this.segment, true);
    }

    prepareData(data: EitiData) : any {

    //    const uniqueCompanies = [];
       const grouped: EitiReport[][] = [];
    //    const total_values = [];
    //    let diff_values = [];

       const dataGroup = "reconciliation";

       const uniqueYears = filterUnique(data[dataGroup],"year").reverse();

        const p1 = "mutation_company_relative";
        const p2 = "mutation_government_relative";
        const p3 = "outcome_absolute"
        const p4 = "outcome_relative"

    //    const uniqueCompanies = filterUnique(data[dataGroup],"origin");
        for (const year of uniqueYears.slice()) {

            let reports = data[dataGroup].filter( s => s.year === year );

            for (const report of reports) {

                report[p1] = (report["payments_companies"] - report["payments_companies_reported"]) / report["payments_companies"];
                report[p2] = 100 * (report["payments_government"] - report["payments_government_reported"]) / report["payments_government"]
                report['weight'] = bePositive(report[p1]) + bePositive(report[p2])
                report[p3] = report["payments_government"]
                const middle = (report["payments_companies_reported"] + report["payments_government_reported"]) / 2
                report[p4] = 100 * (report["payments_government"] - middle) / middle ;

                // if(report.origin !== 'spirit_energy') {
                //     diff_values.push(report['company_diff_percentage'])
                //     diff_values.push(report['gov_diff_percentage'])
                // }
            }
          
            reports = reports.filter( r => {

                let bool = true;

                if (r[p1] == 0 && r[p2] == 0) return false;

            

                // if (r[p1] == undefined ) return false;

                // if (r[p2] == u ) return false;
                
                if (isNaN(r[p1])) return false;
                
                if (isNaN(r[p2])) return false;
                
                return true;
            })

            reports.sort((a,b) => {

                return a['weight'] - b['weight']
           })

           grouped.push(reports);
        }
       

       return grouped
    }

    
    async update(data: any, segment: string, update: boolean) {

        this.segment = segment;

        data = this.prepareData(data);

        if(update) {

            for (let [slug, graph] of Object.entries(this.ctrlrs)) {

                const yearData = data.find( g => g[0].year === slug);
            
                if(yearData != undefined) {
                    graph.update(yearData,segment,update,null)
                } else {
                    console.log(slug + ' is leeg? ?? ')
                    // nog ondervangen!!1
                }
            }
        }

    } 
}
