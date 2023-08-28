
import { Bars, IGraphMapping } from '@local/d3_types';
import { HtmlFunctionality, HtmlHeader, HtmlLegend, HtmlLegendCustom, HtmlLegendEntities, HTMLTable } from '@local/elements';
import { EitiData } from '@local/d3_types';
import { IDashboardController } from '@local/dashboard';
import { EconomyPiesV1 } from './economy-pies-v1';
import { EconomyBarsV1 } from './economy-bars-v1';
import { flattenArray, miljarden } from '@local/d3-services/_helpers';
import { EconomySocialV1 } from './economy-social-v1';

export type IGraphGroupControllerV2 = {
    main: IDashboardController
    data: EitiData;
    segment: string;
    init: () => void;
    prepareData: (data: EitiData) => EitiData[];
    update: (data: EitiData, segment: string, update: boolean) => void
}

// can this be a wrapper for multiple graphcontrollers?
export class EconomySocialGroupV1 implements IGraphGroupControllerV2 { 

    graphs = [];
    funcList: any;
    table;
    legend;

    htmlHeader;
    yearSelector;

    constructor(
        public main: any,
        public data : EitiData,
        public element : HTMLElement,
        public mapping: IGraphMapping,
        public segment: string  
    ){}

    async init() {

        const self = this;

        if (this.mapping.header) {
            this.htmlHeader = new HtmlHeader(this.element, this.mapping.header,this.mapping.description);
            this.htmlHeader.draw(); 
        }

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList = new HtmlFunctionality(this,this.element,this.mapping,this.segment);
        }

        const data = this.prepareData(this.data);

        const wrapper = document.createElement('section');
        wrapper.classList.add("graph-container-12");
        wrapper.classList.add("graph-wrapper");
        this.element.appendChild(wrapper);

        let i = 0;
        for (let paramGroup of data.graphs) {

            const header = document.createElement("h3");
            header.innerText = this.mapping.parameters[i][0].label;
            header.style.marginBottom = "1rem";
          
            const container = document.createElement('section');
            container.classList.add("graph-container-6")
            container.classList.add("graph-view");
            container.appendChild(header);
            wrapper.appendChild(container);

            this.graphs.push(new EconomySocialV1(this.main, paramGroup, container, this.mapping, null, null, null));

            i++;
        }

        this.table = new HTMLTable(this,this.element);

        await this.update(this.data,this.segment, false);

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

        this.table.draw(data.table);

      
    }

    prepareData(data: EitiData) : any {

        const groups: EitiData[] = [];
        const dataGroup = "economy";
        const graphs : Bars[] = [];
        const ranges = [];

        const uniqueYears = data[dataGroup].map( d => d.year);



    // group by payment type .. then years ..

        for (let resource of this.mapping.parameters) {

                const resource_arr = [];

                for (let year of uniqueYears) {

                    const item = data[dataGroup].find( g => g.year == year);
                    const value = item[resource[0].column];
        
                    resource_arr.push({
                        value: value,
                        label: resource[0].label,
                        colour: 'green',
                        year,
                        format: 'currency',
                    })

             
                }
                graphs.push(resource_arr);
        }

   
        // FOR TABLE
       const rows = []

       const years: string[] = data[dataGroup].map( (d) => d.year)
       const columnArray = [];
       const parameters = flattenArray(this.mapping.parameters);

       
        
       parameters.forEach( (param,i) => {

            

            let prefix = param.column.indexOf('export') > -1 ? "Export" : "Productie";
            let postfix;
            if(param.column.indexOf('price')  > -1) {
                postfix = "(miljoen euro)";
            } else if (param.column.indexOf('price')  > -1 && param.label.indexOf("Aardgas")) {
                postfix = "(miljard m3)"
            } else {
                postfix = "(miljoen kilo)"
            }

            let row = [prefix + " " + param.label.toLowerCase() + " " + postfix];
            years.forEach( (d,j) =>  { 
                row = row.concat(Math.round(data[dataGroup][j][param.column]).toString());
            });
            rows.push(row);
       });


       const table = {
           headers: [""].concat(years),
           rows
       }
  
        return {
            graphs,
            table
        };
    }

    
    async update(data: EitiData, segment: string, update: boolean) {

        this.segment = segment;

        const formattedData = this.prepareData(data);

        if(update) {

            this.graphs.forEach ( async (g,i) => {
                await g.update(formattedData.graphs[i], this.segment, true);
            });
        }
    } 
}
