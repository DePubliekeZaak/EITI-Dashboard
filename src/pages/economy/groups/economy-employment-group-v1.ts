import { flattenArray } from "../../shared/_helpers";
import { GroupControllerV1 } from "../../shared/group-v1";
import { HTMLSource } from "../../shared/html/html-source";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { DataObject, EitiData, TableData } from "../../shared/types";
import { Bars } from "../../shared/types_graphs";


export class EconomyEmploymentGroupV1 extends GroupControllerV1 { 

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

    init() {}

    prepareData(data: EitiData) : any {

        const groups: EitiData[] = [];
        const dataGroup = "economy";
        const graphs : Bars[] = [];
        const ranges = [];

        if (data[dataGroup] == undefined) return;

        const uniqueYears = data[dataGroup].map( d => d.year);

        for (let params of this.config.graphs[0].parameters) {

                const year_arr : any[] = [];

                for (let year of uniqueYears) {

                    const item = data[dataGroup].find( g => g.year == year);
                    const mining_males = item[params[0].column];
                    const mining_females = item[params[1].column];
                    const total_males = item[params[2].column];
                    const total_females = item[params[3].column];
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
       const rows : string[][] = []

       const years: string[] = data[dataGroup].map( (d) => d.year)
       const columnArray = [];
       const parameters = flattenArray(this.config.graphs[0].parameters);
        
       parameters.forEach( (param,i) => {

            let row = [param.label];
            years.forEach( (d,j) =>  { 
                if (data[dataGroup] == undefined) return;
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

    
    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    }

    update(data: DataObject, segment: string, update: boolean) {

        super.update(data,segment,update)
    }  
}
