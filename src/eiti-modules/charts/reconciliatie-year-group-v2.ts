import { TCtrlrs } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { HtmlFunctionality, HtmlHeader, HTMLTable, HTMLYear } from '@local/elements';
import { charts }  from '@local/charts';
import { EitiData, EitiReport } from '@local/d3_types/data';
import { filterUnique, formatReconData, reconParameterList } from '@local/eiti-services';
import { bePositive, convertToCurrencyInTable } from '@local/d3-services/_helpers';


// can this be a wrapper for multiple graphcontrollers?
export class ReconciliatieYearGroupV2 { //extends GraphControllerV2 {

    funcList;
    ctrlrs: TCtrlrs = {};
    scatter;
    htmlHeader;
    yearSelector;
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

        this.segment = this.mapping.parameters[0][0].column;

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

        for (const year of data.grouped) {

            // how to sort when its an object ? 
            const slug = year[0].year;

            const container = document.createElement('article');
            container.classList.add('graph-container-12');
            container.classList.add(slug);
          //  wrapper.style.marginBottom = "2rem";
            wrapper.appendChild(container);

            // create entity-info-element
            new HTMLYear(this,container,slug);

            // probeer met bolletjes
            this.ctrlrs[slug] = new charts.ReconciliatieByYearV2(this.main, year, container, this.mapping, "2022", null, i);
            this.ctrlrs[slug].init();

            i++;
        }
        this.update(this.data,this.segment, true);

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

    }

    prepareData(data: EitiData) : any {

       const grouped: EitiReport[][] = [];
       const dataGroup = "reconciliation";
       const uniqueYears = filterUnique(data[dataGroup],"year").reverse();

        //SPLIT HERE ???? 
        // OR TWO TYPES O DATA?


        for (const year of uniqueYears.slice()) {

         

            let reports = data[dataGroup].filter( s => s.year === year );

           

            reports = formatReconData(reports);

            
          
            reports = reports.filter( r => {
                let bool = true;
                if (r[reconParameterList()[0].column] == 0) return false;                
                if (isNaN(r[reconParameterList()[1].column])) return false;
                if (isNaN(r[reconParameterList()[1].column])) return false;
                return true;
            })

            reports.sort((a,b) => {
                return bePositive(b[this.segment]) - bePositive(a[this.segment])
           })


         

           grouped.push(reports.slice(0,4));

          
        }

        // table

        const rows = [];

        for (let c of data[dataGroup]) {

            rows.push([
                c.entity_name, 
                c.year, 
                convertToCurrencyInTable(c.payments_companies_reported) + "M", 
                convertToCurrencyInTable(c.payments_government_reported) + "M", 
                convertToCurrencyInTable(c.payments_companies) + "M", 
                convertToCurrencyInTable(c.payments_government) + "M"
            ])
        }

        const table = {

            headers:  ["Bedrijf","Jaar","Rapportage bedrijf","Rapportage overheid","Uitkomst bedrijf","Uitkomst overheid"],
            rows
        };
       

       return {
            grouped,
            table
        }
    }

    
    async update(data: any, segment: string, update: boolean) {

        this.segment = segment;

        data = this.prepareData(data);

        if(update) {

            for (let [slug, graph] of Object.entries(this.ctrlrs)) {


                const yearData = data.grouped.find( g => g[0].year == slug);
            
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
