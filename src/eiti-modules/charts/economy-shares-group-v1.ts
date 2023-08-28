
import { Bars, IGraphMapping } from '@local/d3_types';
import { HtmlFunctionality, HtmlHeader, HTMLTable } from '@local/elements';
import { EitiData } from '@local/d3_types';
import { IDashboardController } from '@local/dashboard';
import { EconomyPiesV1 } from './economy-pies-v1';
import { EconomyBarsV1 } from './economy-bars-v1';
import { flattenArray, miljarden } from '@local/d3-services/_helpers';
import { EconomySharesV1 } from './economy-shares-v1';

export type IGraphGroupControllerV2 = {
    main: IDashboardController
    data: EitiData;
    segment: string;
    init: () => void;
    prepareData: (data: EitiData) => EitiData[];
    update: (data: EitiData, segment: string, update: boolean) => void
}

// can this be a wrapper for multiple graphcontrollers?
export class EconomySharesGroupV1 implements IGraphGroupControllerV2 { 

    graphs = [];
    funcList: any;
    table;

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
            header.innerText = paramGroup[0].label.split(" ")[0];
            header.style.marginBottom = "1rem";
            const container = document.createElement('section');
            container.classList.add("graph-container-6")
            container.classList.add("graph-view")
            container.appendChild(header);
            wrapper.appendChild(container);

            this.graphs.push(new EconomySharesV1(this.main, paramGroup, container, this.mapping, null, null, null));

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

        for (let params of this.mapping.parameters) {

                const year_arr = [];

                for (let year of uniqueYears) {

                    const item = data[dataGroup].find( g => g.year == year);
                    const mining = item[params[0].column];
                    const total = item[params[1].column];
                    let value;

                    switch(this.segment) {

                        case 'percentage': 
                            value = 100 * mining / total;
                            break;
                        case 'mijnbouwsector':
                            value = miljarden(mining);
                            break;
                        case 'totaal':
                            value = miljarden(total);
                            break;
                    }

                    year_arr.push({
                        value,
                        label: params[0].label,
                        colour: params[0].colour,
                        year,
                        format: this.segment == 'percentage' ? 'percentage' : 'miljard',
                    })
                }
                graphs.push(year_arr);
        }

        graphs[3].forEach( (d) => {
            d.format = "fte"
        });

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
