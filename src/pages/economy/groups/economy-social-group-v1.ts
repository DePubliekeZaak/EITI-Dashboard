import { convertToCurrencyInTable } from "@local/d3-services/_helpers";
import { flattenArray } from "../../shared/_helpers";
import { GroupControllerV1 } from "../../shared/group-v1";
import { HTMLSource } from "../../shared/html/html-source";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { DataObject, EitiData, TableData } from "../../shared/types";
import { Bars } from "../../shared/types_graphs";


export class EconomySocialGroupV1 extends GroupControllerV1 { 

    graphs = [];
    funcList: any;
    table;
    legend;

    htmlHeader;
    yearSelector;

    constructor(
        public page: any,
        public config: IGroupMappingV2,
        public index: number
    ){
        super(page,config, index);
    }

    html() {

        const graphWrapper = super.html();
        let source = HTMLSource(graphWrapper?.parentElement as HTMLElement,this.page.main.params.language,"NL-EITI");

        if (graphWrapper != undefined && this.config.slug == "environmental") {

            // const h2 = document.createElement("h2");
            // h2.innerText =  this.page.main.params.language == 'en' ? "Unreconciled payments:" : "Niet-gereconcilieerde betalingen:";
            // h2.style.marginTop = "4rem";
            // h2.style.marginBottom = "2rem";
            // graphWrapper.insertBefore(h2,graphWrapper.firstChild);
        }

        return graphWrapper
    }

    init() {}

    prepareData(data: EitiData) : any {

        const groups: EitiData[] = [];
        const dataGroup = "economy";
        const graphs : Bars[] = [];
        const ranges = [];

        if (data[dataGroup] == undefined) return;

        const uniqueYears = data[dataGroup].map( d => d.year).filter( (y) => y != 2017);

    // group by payment type .. then years ..

        for (let resource of this.config.graphs[0].parameters) {

                const resource_arr: any[] = [];

                for (let year of uniqueYears) {

                    const item = data[dataGroup].find( g => g.year == year);
                    const value = item[resource[0].column];
        
                    resource_arr.push({
                        value: value,
                        label: this.page.main.params.language == 'en' ? resource[0].label_en : resource[0].label,
                        colour: 'green',
                        year,
                        format: 'currency',
                    })
                }
                graphs.push(resource_arr);
        }

   
        // FOR TABLE
       const rows: string[][] = []

       const years: string[] = data[dataGroup].map( (d) => d.year)
       const columnArray = [];
       const parameters = flattenArray(this.config.graphs[0].parameters);

       parameters.forEach( (param,i) => {

            const lan = this.page.main.params.language;
            const label = lan == 'en' ?  param.label_en : param.label;

            let row = [label.toLowerCase()];

            

            years.forEach( (d,j) =>  { 
                if (data[dataGroup] == undefined) return;
                row = row.concat(convertToCurrencyInTable(Math.round(data[dataGroup][j][param.column])));
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

    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    }

    update(data: DataObject, segment: string, update: boolean) {

        super.update(data,segment,update)
    } 
   
}
