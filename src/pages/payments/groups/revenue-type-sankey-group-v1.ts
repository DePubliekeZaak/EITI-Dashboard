

import { DataObject, EitiData, EitiPayments, EitiReport, TableData } from '../../shared/types';
import { filterUnique } from '../../shared/data.format.factory';
import {  IGroupMappingV2 } from '../../shared/interfaces'
import { convertToCurrencyInTable } from '../../shared/_helpers';
import { GroupControllerV1 } from '../../shared/group-v1';

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
    ){
        super(page,config);
    }

    html() {

        return super.html();
    }

   prepareData(data: EitiData) : any {

    

        const dataGroup = "payments";
        if(data[dataGroup] == undefined) return;

        const filteredData: EitiPayments[] = data[dataGroup].filter( (r: EitiPayments) => r.year == parseInt(this.segment) && r.payments_companies > 0 && r.aggregated);
        const filteredData_n: EitiPayments[] = data[dataGroup].filter( (r: EitiPayments) => r.year == parseInt(this.segment) && r.payments_companies < 0 && r.aggregated);
        const uniqueOrigins: string[] = [];
        const uniqueRecipients: string[] = [];
        const uniqueStreams: string[] = [];
        const uniqueOrigins_n: string[] = [];
        const uniqueRecipients_n: string[] = [];
        const uniqueStreams_n: string[] = [];

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

        for (const o of uniqueOrigins) {

            const a = data[dataGroup].filter( (s) => s["aggregated"] && s[rowSlug] === o && s.year === parseInt(this.segment));

            for (const s of a) {

                const stream = this.page.main.params.language == 'en' ? s["name_en"] : s["name_nl"];
                const origin = this.page.main.params.language == 'en' ? s["origin_name_en"] : s["origin_name"];
                const recipient = this.page.main.params.language == 'en' ? s["recipient_name_en"] : s["recipient_name_nl"];
                
                const row: string[] = [];
                row.push(origin);
                row.push(stream);
                row.push(recipient);
                row.push(convertToCurrencyInTable(s["payments_companies"]));
                rows.push(row);
            }

        }

    const headers = this.page.main.params.language == 'en' ? ["Origin","Payment stream","Recipient",this.segment] : ["Origine","Betaalstroom","Ontvanger", this.segment];

    const table = {
        headers,
        rows
    }

        
    return {
        uniqueOrigins,
        uniqueRecipients,
        uniqueStreams,
        uniqueOrigins_n,
        uniqueRecipients_n,
        uniqueStreams_n,
        filteredData,
        filteredData_n,
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
