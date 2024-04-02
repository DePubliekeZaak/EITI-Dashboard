import { convertToCurrencyInTable, thousands } from "@local/d3-services/_helpers";
import { flattenArray } from "../../shared/_helpers";
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { DataObject, EitiData, TableData } from "../../shared/types";
import { Bars } from "../../shared/types_graphs";
import { HTMLSource } from "../../shared/html/html-source";

export class EconomyProdGroupV1 extends GroupControllerV1 { 

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
        super(page,config,index);
    }

    html() {
        
        const graphWrapper = super.html();
        let source = HTMLSource(graphWrapper?.parentElement as HTMLElement,this.page.main.params.language,"CBS");
        return graphWrapper
    }
    
    async init() {}


    prepareData(data: EitiData) : any {

        const groups: EitiData[] = [];
        const dataGroup = "economy";
        const graphs : Bars[] = [];
        const ranges = [];

        if (data[dataGroup] == undefined) return;

        const uniqueYears = data[dataGroup].map( d => d.year);

    // group by resource .. then years .. couple prod + export

        for (let resource of this.config.graphs[0].parameters) {

                const resource_arr : any[] = [];

                for (let year of uniqueYears) {

                    const item = data[dataGroup].find( g => g.year == year);
                    const prod_vol = item[resource[0].column];
                    const prod_price = item[resource[1].column];
                    const export_vol = item[resource[2].column];
                    const export_price = item[resource[3].column];
                    let value_1;
                    let value_2;
                    let label;

                    switch(this.segment) {

                        case 'prijs': 

                            value_1 = prod_price;
                            value_2 = export_price;
                            break;
                        case 'volume':
                            value_1 = prod_vol;
                            value_2 = export_vol;
                            break;
                    }

                    resource_arr.push({
                        value: value_1,
                        label: "productie",
                        colour: 'orange',
                        year,
                        format: this.segment == 'prijs' ? 'miljoen' : 'numeric',
                        sector: this.page.main.params.language == 'en' ? resource[0].label_en : resource[0].label
                    })

                    resource_arr.push({
                        value: value_2,
                        label: "export",
                        colour: 'blue',
                        year,
                        format: this.segment == 'prijs' ? 'miljoen' : 'numeric',
                        sector: this.page.main.params.language == 'en' ? resource[0].label_en : resource[0].label

                    })
                }
                graphs.push(resource_arr);
        }

   
        // FOR TABLE
       const rows : string[][] = []

       const years: string[] = data[dataGroup].map( (d) => d.year)
       const columnArray = [];
       const parameters = flattenArray(this.config.graphs[0].parameters);
        
       parameters.forEach( (param,i) => {

            const lan = this.page.main.params.language;
            const label = lan == 'en' ?  param.label_en : param.label;

            let prefix = param.column.indexOf('export') > -1 ? "Export" : "Productie";
            let postfix;
            if(param.column.indexOf('price')  > -1) {
                postfix = ''; //  (lan == 'en') ? "(million euro)": "(miljoen euro)";
            } else if (param.column.indexOf('volume')  > -1 && param.label.indexOf("Aardgas") > -1) {
                postfix = (lan == 'en') ? "(m3)" : "(m3)"
            } else {
                postfix = (lan == 'en') ? "(kilo)" : "(kilo)"
            }

            let row = [prefix + " " + label.toLowerCase() + " " + postfix];
          
            years.forEach( (d,j) =>  { 
                
                if (data[dataGroup] == undefined) return;

                let value = Math.round(data[dataGroup][j][param.column]).toString();

                value = (param.column.indexOf('price') > -1) ? convertToCurrencyInTable(parseFloat(value) * 1000 * 1000) : thousands(parseFloat(value) * 1000 * 1000).toString();

                row = row.concat(value);
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
