import { bePositive, convertToCurrencyInTable } from "../../shared/_helpers";
import { filterUnique } from "../../shared/data.format.factory";
import { GroupControllerV1 } from "../../shared/group-v1";
import { HTMLSource } from "../../shared/html/html-source";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { DataObject, EitiData, EitiPayments, TableData } from "../../shared/types";

export  class EbnCircleGroupV2 extends GroupControllerV1 { 

    scatter;
    funcList;
    htmlHeader;
    yearSelector;
    uniqueSectors;
    uniqueYears;
    uniqueCompanies;
    table;
    indicators;

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
        return graphWrapper
    }

    init() {}

    prepareData(data: EitiData) : any {

       const dataGroup = "payments";

        if(data[dataGroup] == undefined) return;

       const grouped: EitiPayments[][] = [];
       let values : number[] = [];
 
       for (let year of filterUnique(data[dataGroup],"year").reverse()) {
            
            const items : EitiPayments[] = data[dataGroup].filter( 
                p => 
                p.year == year
                && ["sales","costs"].indexOf(p.payment_stream) > -1 
            )
            grouped.push(items)
            values = values.concat(items.map( p => 1000 * 1000 * bePositive(p.payments_companies) ))
       }

       const range = [0,0,window.d3.min(values),window.d3.max(values)];

       // FOR TABLE

       const rows :  (string|number)[][] = [];

       const columnArray = filterUnique(data[dataGroup],"year");
       const rowArray = filterUnique(data[dataGroup],"origin");
 
    //    const labels = this.config[0].map( p => p.label);

       const items =  []; 


       for (const year of grouped) {


            const nam = [];
            const participants = []; 
            for (const company of filterUnique(data[dataGroup],"origin")) {

                const costs = year.find( p => p.payment_stream == "costs" && p.recipient == company);
                const sales = year.find( p => p.payment_stream == "sales" && p.origin == company);

                if (sales != undefined && costs != undefined) { 

                    const row = [
                        year[0].year,
                        sales.origin_name != undefined ? sales.origin_name : sales.origin, 
                        convertToCurrencyInTable(costs.payments_companies * 1000 * 1000),
                        convertToCurrencyInTable(sales.payments_companies * 1000  * 1000)
                    ];

                    rows.push(row)

                }
            }
       }

       const headers = this.page.main.params.language == 'en' ? ["Year","Company","Receipts","Payments"] : ["Jaar","Bedrijf","Ontvangsten","Betalingen"];

       const table = {
           headers,
           rows
       }

       return {
           range,
           grouped,
           table
       }
    }

    
    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    }

    populateDescription() {

        if (this.config.functionality && this.config.functionality.indexOf('description') > -1) {
            this.description.draw();
        }
    }

    update(data: DataObject, segment: string, update: boolean) {
        

        super.update(data,segment,update)
    } 
}
