
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2, IParameterMapping } from "../../shared/interfaces";
import { DataObject, ImgData } from "../../shared/types";
import { Bar, Bars, Definitions, Line, Lines, PiePart, TableData } from "../../shared/types_graphs";
import { HTMLSource } from "../../shared/html/html-source copy";

export class DuurProjectiesGroupV1 extends GroupControllerV1 { 

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
        const bars: Bars = []; 
        const lines: Lines = []

        let params = ([] as IParameterMapping[]);
        
        for (let graph of this.config.graphs) {
            params = params.concat(...graph.parameters[0]).concat(...graph.parameters[1]);
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

            const bar: Bar = {
                label : period._yearmonth,
                value : period[this.config.graphs[0].parameters[0][0].column],
                colour : this.config.graphs[0].parameters[0][0].colour,
                type : "werkvoorraad",
                meta : period
            }

            bars.push(bar)
        }

        for (let l of this.config.graphs[0].parameters[1]) {

            const line : Line = [];

            for (let period of data[dataGroup]) {

                line.push({
                    time: period._yearmonth,
                    value: period[l.column],
                    label: l.column,
                    colour: l.colour
                })
            }

            lines.push(line);
        } 



   
        const table = {
            headers:  ["Jaar","Maand","Datum"].concat(params.map( p => p.label)), //  ["Betaalstroom"].concat(uniqueYears.map( y => y.toString())),
            rows
        };

        const definitions: Definitions = [];

        definitions.push({
            name: "Verwachte doorlooptijd nieuw dossier",
            description: "Voor nieuwe, reguliere schademeldingen streeft het IMG naar een maximale doorlooptijd van indiening tot besluit van een half jaar (182 dagen). We berekenen op basis van de huidige voortgang hoeveel dagen het op dit moment bij benadering duurt om een nieuwe schademelding af te handelen. Onder meer de huidige capaciteit van bijvoorbeeld schade-opnames, het opleveren van adviesrapporten en het voorbereiden van besluiten wordt daarbij meegewogen."
        })

        definitions.push({
            name: "Doorlooptijd afgehandeld dossiers",
            description: "Dit is bij benadering het aantal dagen waarin de schademelding is afgehandeld sinds de schademelding is binnengekomen. Het gaat daarbij om de mediaan. Vijftig procent van de schademeldingen is daarmee in minder dan het genoemde aantal dagen afgehandeld en vijftig procent in meer dagen. De mediaan wordt berekend over de laatset 2.500 besluiten over schademeldingen."
        })

        return {
            columns,
            bars,
            lines,
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
