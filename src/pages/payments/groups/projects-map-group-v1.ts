import { GroupControllerV1 } from '../../shared/group-v1';
import { IGroupMappingV2 } from '../../shared/interfaces';
import { DataObject, EitiData, EitiPayments, TableData } from '../../shared/types';
import { convertToCurrencyInTable } from '../../shared/_helpers';
import { filterUnique } from '../../shared/data.format.factory';
import { IPageController } from '../../shared/page.controller';
import { HTMLSource } from '../../shared/html/html-source';

export class ProjectsMapGroupV1 extends GroupControllerV1 { 
        
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

        const dataGroup = "payments";
        if(data[dataGroup] == undefined) return;

        const uniqueYears = filterUnique(data[dataGroup],"year");
        uniqueYears.sort( (a:number, b: number) => b - a);

        const paymentsFromThisYear : EitiPayments[] = data[dataGroup].filter( r => r.year === uniqueYears[0])
        paymentsFromThisYear.sort( (a: EitiPayments,b: EitiPayments) : number => {
            return b["payments_companies"] - a["payments_companies"];
        });


        // FOR TABLE

       const rows = [];
       const filteredData = data[dataGroup]
        .filter( p => !p["aggregated"] 
                && p.year == parseInt(this.segment)
                // && p.geometry != null
        );

       let rowData = data[dataGroup]

       const columnArray = filterUnique(data[dataGroup],"year");
       const rowArray = filterUnique(filteredData,"project");
       const rowName = "entity_name";
       const rowSlug = "origin";
       const columnName = "year";
       const columnSlug = "year";
       const valueKey = "payments_companies";


       for (const r of rowArray) {

            const item = filteredData.find( p => p.project == r );

            const royalties = filteredData.find( p => p.project == r && p.payment_stream === 'royalties');
            const surface_rental = filteredData.find( p => p.project == r && p.payment_stream === 'surface_rental');
            const retributions = filteredData.find( p => p.project == r && p.payment_stream === 'retributions');

            const row = [];
            row.push(item.origin_name);
            row.push(r);
            row.push(royalties != undefined ?  convertToCurrencyInTable(royalties['payments_companies']) : "-");
            row.push(surface_rental != undefined ? convertToCurrencyInTable(surface_rental['payments_companies']) : "-");
            row.push(retributions != undefined ? convertToCurrencyInTable(retributions['payments_companies']) : "-");

            rows.push(row)
       }

       const headers = this.page.main.params.language == 'en' ?  ["Company","Licence","Royalties","Surface rental","Retributions"] : ["Bedrijf","Vergunning","Cijns","Oppervlakterecht","Retributies"];


       const table = {
           headers,
           rows
       }



        return {

           table,
           netherlands : data['netherlands'],
           licences2023 : data['licences2023'],
           graphs :  [ 
                    paymentsFromThisYear.filter( p => p.payment_stream == 'royalties' && !p.aggregated),
                    paymentsFromThisYear.slice().filter( p => p.payment_stream == 'surface_rental' && !p.aggregated),
                    paymentsFromThisYear.slice().filter( p => p.payment_stream == 'retributions' && !p.aggregated)
                ]

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
