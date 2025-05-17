import { DataObject, EitiData, EitiPayments, EitiReport, TableData } from '../../shared/types';
import { filterUnique } from '../../shared/data.format.factory';
import {  IGroupMappingV2 } from '../../shared/interfaces'
import { convertToCurrencyInTable } from '../../shared/_helpers';
import { GroupControllerV1 } from '../../shared/group-v1';
import { Definition, Definitions } from '../../shared/types_graphs';
import { HTMLSource } from '../../shared/html/html-source';

export class RevenueTypeSankeyGroupV1 extends GroupControllerV1 { 

    slug;
    funcList;
    htmlHeader;
    uniqueSectors;
    table;
    element: HTMLElement;
    segment:  string;


    constructor(
        public page: any,
        public config: IGroupMappingV2,
        public index: number
    ){
        super(page,config,index);
    }

    html() {

        const graphWrapper = super.html();
        let source = HTMLSource(graphWrapper?.parentElement as HTMLElement,this.page.main.params.language,"NL-EITI");
        return graphWrapper
    }

   prepareData(data: EitiData) : any {

        const dataGroup = "payments_aggregated";
        if(data[dataGroup] == undefined) return;

        const filteredData: EitiPayments[] = data[dataGroup].filter( (r: EitiPayments) => r.year == parseInt(this.segment) && r.payments_companies > 0);
        const filteredData_n: EitiPayments[] = data[dataGroup].filter( (r: EitiPayments) => r.year == parseInt(this.segment) && r.payments_companies < 0);
        const uniqueOrigins: string[] = [];
        const uniqueRecipients: string[] = [];
        const uniqueStreams: string[] = [];
        const uniqueOrigins_n: string[] = [];
        const uniqueRecipients_n: string[] = [];
        const uniqueStreams_n: string[] = [];

        // console.log(filteredData)

        for (const report of filteredData) {
            if(uniqueOrigins.indexOf(report.origin) < 0) {
                uniqueOrigins.push(report.origin);
            }
            if(uniqueRecipients.indexOf(report.recipient) < 0) {
                uniqueRecipients.push(report.recipient);
            }
            if(uniqueStreams.indexOf(report.payment_stream) < 0) {
                uniqueStreams.push(report.payment_stream);
            }
        }

        for (const report of filteredData_n) {
            if(uniqueOrigins_n.indexOf(report.origin) < 0) {
                uniqueOrigins_n.push(report.origin);
            }
            if(uniqueRecipients_n.indexOf(report.recipient) < 0) {
                uniqueRecipients_n.push(report.recipient);
            }
            if(uniqueStreams_n.indexOf(report.payment_stream) < 0) {
                uniqueStreams_n.push(report.payment_stream);
            }
        }

        // FOR TABLE

    
    const rows: string[][] = []

    const uniqueYears = filterUnique(data[dataGroup],"year");
    const rowArray = filterUnique(data[dataGroup],"origin").map( (u) => u.toString());
    rowArray.sort( (a: string, b: string) => a.localeCompare(b))
    const rowName = "origin_name";
    const rowSlug = "origin";
    const columnName = "year";
    const columnSlug = "year";
    const valueKey = "payments_companies"

 
    for (const year of uniqueYears.reverse()) {

        for (const o of uniqueOrigins) {

            const a = data[dataGroup].filter( (s) => s[rowSlug] === o && s.year === year);

            for (const s of a) {

                const stream = this.page.main.params.language == 'en' ? s["name_en"] : s["name_nl"];
                const origin = this.page.main.params.language == 'en' ? s["origin_name_en"] : s["origin_name"];
                const recipient = this.page.main.params.language == 'en' ? s["recipient_name_en"] : s["recipient_name"];
                
                const row: string[] = [];
                row.push(year.toString());
                row.push(origin);
                row.push(stream);
                row.push(recipient);
                row.push(convertToCurrencyInTable(s["payments_companies"]));
                rows.push(row);
            }
        }

    }

    const headers = this.page.main.params.language == 'en' ? ["Year","Origin","Payment stream","Recipient","Amount"] : ["Jaar","Origine","Betaalstroom","Ontvanger", "Bedrag"];

    const table = {
        headers,
        rows
    }

    const definitions: Definitions = [];
    const uniquePayments = filterUnique(data[dataGroup], "payment_stream").filter( s => s != "sales" && s != "costs");

    for (let payment_type of uniquePayments) {
        
        const p = data[dataGroup].find( p => p.payment_stream == payment_type);

        if (p != undefined) {

            definitions.push({
                name: p.name_nl,
                name_en: p.name_en,
                description: p.def_nl,
                description_en: p.def_en,
                code: p.code
            })
        }
    }

    definitions.sort( (a: Definition, b : Definition) => a.name.localeCompare(b.name));


        
    return {
        uniqueOrigins,
        uniqueRecipients,
        uniqueStreams,
        uniqueOrigins_n,
        uniqueRecipients_n,
        uniqueStreams_n,
        filteredData,
        filteredData_n,
        table,
        definitions    
    };
        
   }

   populateTable(tableData: TableData) {

        super.populateTable(tableData);
   }

   populateDescription() {

        super.populateDescription() 

    }

   update(data: DataObject, segment: string, update: boolean) {

        super.update(data,segment,update)

        
    }   
}
