
import { bePositive, convertToCurrencyInTable } from '../../shared/_helpers';
import { filterUnique } from '../../shared/data.format.factory';
import { GroupControllerV1 } from '../../shared/group-v1';
import { HTMLSource } from '../../shared/html/html-source';
import { IGroupMappingV2 } from '../../shared/interfaces';
import { DataObject, EitiData, EitiReport, TableData } from '../../shared/types';
import { formatReconData, reconParameterList } from '../reconciliation.data';

export class ReconciliatieYearGroupV2 extends GroupControllerV1 { //extends GraphControllerV2 {

    funcList;
    scatter;
    htmlHeader;
    yearSelector;
    table;

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

    init() { }

    prepareData(data: EitiData) : any {

        const grouped: EitiReport[][] = [];
        const dataGroup = "reconciliation";

        if(data[dataGroup] == undefined) return;

        const uniqueYears = filterUnique(data[dataGroup],"year").reverse();

        for (const year of uniqueYears.slice()) {

            let reports = data[dataGroup].filter( s => s.year === year );
            reports = formatReconData(reports);

            reports = reports.filter( r => {
                let bool = true;
                if (r[reconParameterList()[0].column] == 0) return false;                
                if (isNaN(r[reconParameterList()[1].column])) return false;
                if (!isFinite(r[reconParameterList()[1].column])) return false;
                if (isNaN(r[reconParameterList()[1].column])) return false;
                return true;
            })

            reports.sort((a,b) => {
                return bePositive(b[this.segment]) - bePositive(a[this.segment])
           })



           grouped.push(reports.slice(0,4));
        }

        console.log(grouped);

        // table

        const rows : any[] = [];

        for (let c of data[dataGroup]) {

            rows.push([
                c.entity_name, 
                c.year, 
                convertToCurrencyInTable(c.payments_companies_reported) + "M", 
                convertToCurrencyInTable(c.payments_government_reported) + "M", 
                convertToCurrencyInTable(c.payments_companies) + "M", 
                convertToCurrencyInTable(c.payments_government) + "M"
            ])
        }

        const headers = this.page.main.params.language == 'en' ? ["Company","Year","Reported by company","Reported by government","Payment company","Payment government"] : ["Bedrijf","Jaar","Rapportage bedrijf","Rapportage overheid","Uitkomst bedrijf","Uitkomst overheid"]

        const table = {

            headers,
            rows
        };
       

       return {
            grouped,
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
