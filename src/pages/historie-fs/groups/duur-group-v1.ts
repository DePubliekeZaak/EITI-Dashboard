
import { filterUnique } from "../../shared/data.format.factory";
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2, IParameterMapping } from "../../shared/interfaces";
import { DataObject, ImgData } from "../../shared/types";
import { Bars, Definitions, Line, PiePart, TableData } from "../../shared/types_graphs";
import { convertToCurrencyInTable } from "../../shared/_helpers";
import { HTMLSource } from "../../shared/html/html-source copy";

export class DuurGroupV1 extends GroupControllerV1 { 

    circleGroup: any;
    barProgression: any;
    keys;
    stack;

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

    html() {
        const graphWrapper = super.html();
        let source = HTMLSource(graphWrapper?.parentElement as HTMLElement,this.page.main.params.language,"IMG");
        return graphWrapper
    }

    async init() {}

    prepareData(data: ImgData) : any {
      
        const dataGroup = "historie";
        const parts: PiePart[]  = [];
        const rows: (string|number)[][] = [];  
        const months: any[] = [];   
        const line: Line = [];  

        let params = ([] as IParameterMapping[]);
        
        for (let graph of this.config.graphs) {
            params = params.concat(...graph.parameters[0]);
        }

        let columns = params.map( ( p => p.column));

        for (let period of data[dataGroup]) {

            const row: (number|string)[] = [];
            row.push(period._year);
            row.push(period._month);
            row.push(new Date(period._einddatum).toLocaleDateString('nl-NL',{'dateStyle':'short'}));

            let total = 0;
            for (let column of columns) {
                row.push(period[column]);  
                total = total + period[column]  
            }

            rows.push(row);

            const month = {};
            month["date"] = period._yearmonth
            month["year"] = period._year
            month["month"] = period._month

            for (let column of columns) {
                month[column] = period[column]
            }

            months.push(month)

            line.push({
                time: period._yearmonth,
                value: period[this.config.graphs[0].parameters[1][0].column],
                label: this.config.graphs[0].parameters[1][0].column,
                colour: this.config.graphs[0].parameters[1][0].colour
            })
        }

        this.keys = Object.keys(months[0]).filter(key => {
            return columns.indexOf(key) > -1
        })

        this.stack = window.d3.stack()
            .keys(this.keys);

        const table = {
            headers:  ["Jaar","Maand","Datum"].concat(params.map( p => p.label)), //  ["Betaalstroom"].concat(uniqueYears.map( y => y.toString())),
            rows
        };

        const definitions: Definitions = [];

        definitions.push({
            name: "Percentage binnen half jaar afgehandeld",
            description: "Het percentage schademeldingen dat in minder dan een half jaar tijd sinds de binnenkomst van een schademelding is afgehandeld. Het IMG streeft ernaar alle reguliere schademeldingen binnen een half jaar (182 dagen) af te handelen. Het percentage wordt berekend over de laatste 2.500 besluiten over schademeldingen. Het vertoont daarmee een voortschrijdend gemiddelde"
        })

        return {
            stacked : this.stack(months),
            columns,
            line,
            months,
            table,
            definitions
        }
       }
    
    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    }

    update(data: DataObject, segment: string, update: boolean) {

        super.update(data,segment,update)
    }  
}
