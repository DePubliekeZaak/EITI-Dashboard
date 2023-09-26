
import { Bars, IGraphMapping } from '@local/d3_types';
import { HtmlFunctionality, HtmlHeader, HtmlLegendCustom, HTMLTable } from '@local/elements';
import { EitiData } from '@local/d3_types';
import { IDashboardController } from '@local/dashboard';
import { EconomyPiesV1 } from './economy-pies-v1';
import { EconomyBarsV1 } from './economy-bars-v1';
import { flattenArray, miljarden } from '@local/d3-services/_helpers';
import { EconomyEmploymentV1 } from './economy-employment-v1';

export type IGraphGroupControllerV2 = {
    main: IDashboardController
    data: EitiData;
    segment: string;
    init: () => void;
    prepareData: (data: EitiData) => EitiData[];
    update: (data: EitiData, segment: string, update: boolean) => void
}

// can this be a wrapper for multiple graphcontrollers?
export class EconomyEmploymentGroupV1 implements IGraphGroupControllerV2 { 

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

            const legend = new HtmlLegendCustom(wrapper);

            legend.draw([
                { label : "mannen (FTE)", colour : "orange" } , 
                { label : "vrouwen (FTE)", colour : "blue" }
            ]);


            const container = document.createElement('section');
            container.classList.add("graph-container-12")
            container.classList.add("graph-view");
            container.style.marginTop = "1.5rem";
            wrapper.appendChild(container);

            this.graphs.push(new EconomyEmploymentV1(this.main, paramGroup, container, this.mapping, null, null, null));

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

        // console.log(data);

        const groups: EitiData[] = [];
        const dataGroup = "economy";
        const graphs : Bars[] = [];
        const ranges = [];

        const uniqueYears = data[dataGroup].map( d => d.year);

        for (let params of this.mapping.parameters) {

                const year_arr = [];

                for (let year of uniqueYears) {

                    const item = data[dataGroup].find( g => g.year == year);
                    const mining_males = item[params[0].column + "_males"];
                    const mining_females = item[params[0].column + "_females"];
                    const total_males = item[params[1].column + "_males"];
                    const total_females = item[params[1].column + "_females"];
                    let value1;
                    let value2;

                    switch(this.segment) {

                        case 'aandeel mijnbouwsector': 
                            value1 = mining_males / total_males;
                            value2 = mining_females/ total_females;
                            break;
                        case 'mijnbouwsector':
                            value1 = mining_males;
                            value2 = mining_females;
                            break;
                        case 'totaal Nederland':
                            value1 = total_males;
                            value2 = total_females;
                            break;
                    }

                    year_arr.push({
                        value: value1,
                        label: "mannen",
                        colour: "orange",
                        year,
                        format: this.segment == 'aandeel mijnbouwsector' ? 'percentage' : 'numeric',
                    })

                    year_arr.push({
                        value: value2,
                        label: "vrouwen",
                        colour: "blue",
                        year,
                        format: this.segment == 'aandeel mijnbouwsector' ? 'percentage' : 'numeric',
                    })
                }
                graphs.push(year_arr);
        }

    

        // FOR TABLE
       const rows = []

       const years: string[] = data[dataGroup].map( (d) => d.year)
       const columnArray = [];
       const parameters = flattenArray(this.mapping.parameters);
        
       parameters.forEach( (param,i) => {

            let row = [param.label];
            years.forEach( (d,j) =>  { 
                row = row.concat(data[dataGroup][j][param.column]);
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
