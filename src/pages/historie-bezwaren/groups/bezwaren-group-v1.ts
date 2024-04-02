
import { filterUnique } from "../../shared/data.format.factory";
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2, IParameterMapping } from "../../shared/interfaces";
import { DataObject, ImgData } from "../../shared/types";
import { Bars, PiePart, TableData } from "../../shared/types_graphs";
import { convertToCurrencyInTable } from "../../shared/_helpers";

export class BezwarenGroupV1 extends GroupControllerV1 { 

    circleGroup: any;
    barProgression: any;

    funcList: any;
    table;

    htmlHeader;
    yearSelector;

    constructor(
        public page: any,
        public config: IGroupMappingV2,
        public index: number
    ){
       super(page,config, index);
    }

    async init() {}

    prepareData(data: ImgData) : any {

      
        const dataGroup = "reacties?gemeente=eq.all";

        // console.log(data[dataGroup]);
    
        const parts: PiePart[]  = [];
        const rows: (string|number)[][] = [];       

        let params = ([] as IParameterMapping[]);
        
        for (let graph of this.config.graphs) {
            params = params.concat(...graph.parameters[0]);
        }

        let columns = params.map( ( p => p.column));

        // console.log(columns);

        for (let period of data[dataGroup]) {

            const row : (number|string)[] = [];
            row.push(period._year);
            row.push(period._week);

            let sum = 0;
            for (let column of columns) {
                sum = sum + period[column]  
                row.push(period[column]); 
            }

            row.push(sum)

            rows.push(row);
        }

        params.forEach( (p,i) =>  {
            parts.push({
                label: p.label,
                value:  data[dataGroup][0][p.column],
                colour: p.colour,
                accented: false,
                format: "number"
            })
        });

        const totalParam = this.config.graphs[0].parameters[1][0]

        parts.push({
            label: totalParam.label,
            value:  parseFloat(rows[0][2 + this.config.graphs[0].parameters[0].length].toString()),
            colour: totalParam.colour,
            accented: false,
            format: "number"
        })

        const table = {
            headers:  ["Jaar","Week"].concat(params.map( p => p.label)), //  ["Betaalstroom"].concat(uniqueYears.map( y => y.toString())),
            rows
        };



        return {
            
            graphs: parts,
            table
        }
       }
    
    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    }

    update(data: DataObject, segment: string, update: boolean) {

        super.update(data,segment,update)
    }  
}
