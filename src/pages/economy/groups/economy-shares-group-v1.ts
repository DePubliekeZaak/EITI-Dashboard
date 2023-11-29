import { flattenArray, miljarden } from "../../shared/_helpers";
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { DataObject, EitiData, TableData } from "../../shared/types";
import { Bars } from "../../shared/types_graphs";


export class EconomySharesGroupV1 extends GroupControllerV1{ 

    graphs = [];
    funcList: any;
    table;

    htmlHeader;
    yearSelector;

    constructor(
        public page: any,
        public config: IGroupMappingV2,
    ){
       super(page,config);
    }

    html() {
        return super.html()
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
                    const mining = item[params[0].column];
                    const total = item[params[1].column];
                    let value;

                    switch(this.segment) {

                        case 'aandeel mijnbouwsector': 
                            value = 100 * mining / total;
                            break;
                        case 'mijnbouwsector':
                            value = miljarden(mining);
                            break;
                        case 'totaal Nederland':
                            value = miljarden(total);
                            break;
                    }

                    year_arr.push({
                        value,
                        label: this.page.main.params.language == 'en' ? params[0].label_en : params[0].label,
                        colour: params[0].colour,
                        year,
                        format: this.segment == 'aandeel mijnbouwsector' ? 'percentage' : 'miljard',
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
            let row : string[] = [param.label];
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
