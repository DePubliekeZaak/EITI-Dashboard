
import { IGraphMapping } from '@local/d3_types';
import { HtmlFunctionality, HtmlHeader, HTMLTable } from '@local/elements';
import { EitiData } from '@local/d3_types';
import { IDashboardController } from '@local/dashboard';
import { EconomyPiesV1 } from './economy-pies-v1';

export type IGraphGroupControllerV2 = {
    main: IDashboardController
    data: EitiData;
    segment: string;
    init: () => void;
    prepareData: (data: EitiData) => EitiData[];
    update: (data: EitiData, segment: string, update: boolean) => void
}

// can this be a wrapper for multiple graphcontrollers?
export class EconomyPiesGroupV1 implements IGraphGroupControllerV2 { 

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
        let i = 0;
        for (let paramGroup of data.graphs) {

            const header = document.createElement("h3");
            header.innerText = paramGroup[0][0].label.split(" ")[0];
            this.element.appendChild(header);

            const wrapper = document.createElement('section');
            wrapper.classList.add("graph-container-12")
            wrapper.classList.add("graph-wrapper")
            this.element.appendChild(wrapper);



            for (let year of paramGroup) {
                this.graphs.push(new EconomyPiesV1(this.main, year, wrapper, this.mapping, null, data.ranges[i], null));
            }

            i++;
        }

        this.table = new HTMLTable(this,this.element);

        await this.update(this.data,this.segment, false);

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

       // this.table.draw(data);
    }

    prepareData(data: EitiData) : any {

        const groups: EitiData[] = [];
        const dataGroup = "economy";
        const graphs = [];
        const ranges = [];

        const uniqueYears = data[dataGroup].map( d => d.year);

        for (let params of this.mapping.parameters) {

            const range_values = [];

            const year_arr = [];

            for (let year of uniqueYears) {

                const kv_arr = [];

                for (let kv of params) {

                    const value = data[dataGroup].find( g => g.year == year)[kv.column];

                    kv_arr.push({
                        year,
                        colour: kv.colour,
                        label : kv.label,
                        value
                    })
                }

                range_values.push(data[dataGroup].find( g => g.year == year)[params[1].column]);

                year_arr.push(
                    data[dataGroup][params[0].column.split(" ")[0]] = kv_arr
                )
            }
        
            graphs.push(year_arr);
            ranges.push(range_values);
        }
  
        return {
            graphs,
            ranges
        };
    }

    
    async update(data: EitiData, segment: string, update: boolean) {

        this.segment = segment;

        const formattedData = this.prepareData(data);

        console.log(formattedData)

        if(update) {

            this.graphs.forEach ( async (g,i) => {
                console.log(i);
                await g.update(formattedData.graphs[i], this.segment, true, formattedData.ranges[i]);
            });
        }
    } 
}
