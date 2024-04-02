

import { DataObject, EitiData, EitiReport, TableData } from '../../shared/types';
import { filterUnique } from '../../shared/data.format.factory';
import { IGroupMappingV2 } from '../../shared/interfaces'
import { convertToCurrencyInTable } from '../../shared/_helpers';
import { GroupControllerV1 } from '../../shared/group-v1';
import { HTMLSource } from '../../shared/html/html-source';

export class PaymentsGroupV1 extends GroupControllerV1 { 

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

        const dataGroup = "reconciliation";

        if(data[dataGroup] == undefined) return;

        this.uniqueSectors = filterUnique(data[dataGroup],"sector");
        const multiples: EitiReport[][] = [];

        for (let us of this.uniqueSectors.slice()) {
            multiples.push(data[dataGroup].filter( r => r.sector == us));    
        }

        const values = data[dataGroup].map( r => r.payments_companies);
        const range = [window.d3.min(values),window.d3.max(values)];


        // FOR TABLE

        const rows : string[][] = []

        const columnArray = filterUnique(data[dataGroup],"year");
        let rowArray = filterUnique(data[dataGroup],"origin").map ( s => s.toString())
        rowArray.sort( (a: string, b: string) => a.localeCompare(b))
        const rowName = "entity_name";
        const rowSlug = "origin";
        const columnName = "year";
        const columnSlug = "year";
        const valueKey = "payments_companies"

        for (const r of rowArray) {

            const row : string[] = [];
            const report = data[dataGroup].find( (s) => s[rowSlug] === r);
            if(report != undefined) row.push(report[rowName]);

            for (const c of columnArray) {
                const item = data[dataGroup].find( (s) => s[columnSlug] === c && s[rowSlug] == r);
                row.push(item != undefined ?  convertToCurrencyInTable(item[valueKey] * 1000 * 1000) : "-")
            }

            rows.push(row)
        }

        const headers = this.page.main.params.language == 'en' ? ["Company"] : ["Bedrijf"];


        const table = {
            headers: headers.concat(columnArray.map( y => y.toString())),
            rows
        }

        return {
            multiples,
            range,
            table
        }
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
