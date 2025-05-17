import { breakpoints } from "@local/styleguide";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { GroupControllerV1 } from "../../shared/group-v1";
import { DataObject, EitiData, TableData } from "../../shared/types";
import { formatReconData } from "../reconciliation.data";
import { HTMLSource } from "../../shared/html/html-source";

export class ReconciliationCompanyGroupV2 extends GroupControllerV1 {

    chartAxis;
    chartBar;
    bars = {};
    
    filter;
    zeroLine;
    table;

    grid;
    yScale;
    xScale;
    bottomAxis;
    leftAxis;
    arrowX;

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

    init() {
     
    }

    prepareData(data: EitiData) : any {

        this.filter.redraw('companySelect');

        const dataGroup = 'reconciliation';

        if (data[dataGroup] == undefined) return data;

        const myData = formatReconData(data[dataGroup].filter( d => d.origin == this.segment));

        const slice : any[] = [];

        const p1 = "discrepancy_company_relative";
        const p2 = "discrepancy_government_relative";
        const p3 = "outcome_absolute"
        const p4 = "outcome_relative"

        for (const report of myData) {

            slice.push({
                type : "overheid",
                label: report.year.toString(),
                value : report[p2],
                value2: report[p4],
                colour: "blue",
                format: "percentage",
                meta: report
            })

            slice.push({
                type : "bedrijf",
                label : report.year.toString(),
                value : report[p1],
                value2: report[p4],
                colour: "orange",
                format: "percentage",
                meta: report
            })

        }

        // table

        const rows : any[] = [];

        for (let c of formatReconData(data[dataGroup])) {

            rows.push([
                c.entity_name, 
                c.year, 
                (c.payments_companies_reported) + "M", 
                (c.payments_government_reported) + "M", 
                (c.payments_companies) + "M", 
                (c.payments_government) + "M"
            ])
        }

        const headers = this.page.main.params.language == 'en' ? ["Company","Year","Reported by company","Reported by government","Payment company","Payment government"] : ["Bedrijf","Jaar","Rapportage bedrijf","Rapportage overheid","Uitkomst bedrijf","Uitkomst overheid"]

        const table = {
            headers,
            rows
        };

        return {
            slice,
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
