import { paymentTypes } from "@local/styleguide";
import { filterUnique } from "../../shared/data.format.factory";
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { DataObject, EitiData } from "../../shared/types";
import { Bars, Definitions, TableData } from "../../shared/types_graphs";
import { convertToCurrencyInTable } from "../../shared/_helpers";

export class RevenueIntroGroupV1 extends GroupControllerV1 { 

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



    prepareData(data: EitiData) : any {

        const dataGroup = "payments";
        if(data[dataGroup] == undefined) return;
    
        const bars: Bars = [];
        const rows: string[][] = [];
      
        const uniqueYears = filterUnique(data[dataGroup],"year");
        uniqueYears.sort( (a:any,b: any) => parseInt(a) - parseInt(b));

        const companyData = data[dataGroup].filter ( (s) => 
            s.origin === this.page.main.params.company && 
            s.project != 'aggregated' && 
            ["royalties","surface_rental","retributions"].indexOf(s.payment_stream) > -1
        );

    
        for (const year of uniqueYears) { 

            const yearData = companyData.filter ( (s) => 
                s.year  === year
            );

            const aggregatedStreams : any[] = [];
          
            for (const ustream of filterUnique(yearData,"payment_stream")) {

                const streams = yearData.filter( (s) => s.payment_stream === ustream);
                const cum_value = streams.reduce( (acc,s) => acc + s.payments_companies,0);
    
                if(cum_value > 0) {
                    aggregatedStreams.push({
                        name_nl : streams[0].name_nl,
                        name_en : streams[0].name_en,
                        payments_companies : cum_value,
                        meta: streams[0]
                    })
                }
            }

            let i = 0;
            let sum = 0;
            for (const stream of aggregatedStreams) {
    
                bars.push({
                    label: this.page.main.params.language == 'en' ? stream.name_en : stream.name_nl,
                    y: sum,
                    dy: stream.payments_companies,
                    year: parseInt(year.toString()),
                    colour: paymentTypes[stream.meta.payment_stream],
                    meta: stream.meta,
                    value: stream.payments_companies,
                })

            
                sum = sum + stream.payments_companies
    
                i++;
            }  

            console.log(bars);
        }
    
        const payments = data[dataGroup].filter( p => p.name_nl != undefined);
    
        for (const ustream of filterUnique(companyData, "payment_stream")) {
    
            const row: string[] = [];
            const report = companyData.find( (s) => s.payment_stream === ustream);
            if (report != undefined) row.push(
                this.page.main.params.language == 'en' ? report.name_en : report.name_nl
            );
    
            for (const year of uniqueYears) { 
    
                const item = companyData.find( (s) => s.payment_stream === ustream && s.year == year);
                row.push(item != undefined ?  convertToCurrencyInTable(item.payments_companies) : "-")
            }
    
            rows.push(row);
        }

    
        const table = {
    
            headers:  ["Betaalstroom"].concat(uniqueYears.map( y => y.toString())),
            rows
        };
    
        return {
            
            graph: bars,
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
