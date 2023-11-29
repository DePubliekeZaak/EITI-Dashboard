
import { colours } from '@local/styleguide';
import { filterUnique } from '../../shared/data.format.factory';
import { GroupControllerV1 } from '../../shared/group-v1';
import { DataObject, EitiData, EitiEntity, EitiPayments, TableData } from '../../shared/types';
import { IGroupMappingV2 } from '../../shared/interfaces';
import { convertToCurrencyInTable } from '../../shared/_helpers';



export  class EbnCircleGroupV1 extends GroupControllerV1  {

    circleGroups;
    simulation = {};

    funcList;
    table;
    hasListener = false;

    constructor(
        public page: any,
        public config: IGroupMappingV2,
    ){
       super(page,config);
    }

    html() {
        return super.html()
    }

    init() {}


    prepareData(data: EitiData): any {


        if(!this.hasListener) {
            this.hasListener = true;
            this.funcList.redraw('companySelect');
            
        }

        const dataGroup = "payments";

        if (data[dataGroup] == undefined) return;

        const filteredData = data[dataGroup].filter( (stream: EitiPayments) => ["sales","costs"].indexOf(stream.payment_stream) > -1  && (stream.origin === this.segment || stream.recipient == this.segment)) ;
        
        const uniqueYears = filterUnique(data[dataGroup],"year");
        uniqueYears.sort( (a:any,b: any) => parseInt(a) - parseInt(b));

        const years : any[] = [];

        for (const uyear of uniqueYears) {

            const yearData = filteredData.filter( p => p.year == uyear)
            const group : any[] = [];

            const salesReport = yearData.find( p => p.payment_stream == 'sales');
            const costsReport = yearData.find( p => p.payment_stream == 'costs');

            const sales = salesReport != undefined ? 1000 * 1000 * salesReport["payments_companies"] : 0;
            const costs = costsReport != undefined ? 1000 * 1000 * costsReport["payments_companies"] : 0;

            group.push({
                label: "sales",
                colour: colours["blue"],
                value: sales,
                format: "revenue"
            })

            group.push({
                label: "costs",
                colour: colours["orange"],
                value: costs,
                format: "revenue"
            })

            group.push({
                label: "netto",
                colour: colours["green"],
                value: sales - costs,
                format: "revenue"
            })

            years.push({
                label: uyear.toString(),
                group
            })
        }

    

        /// TABLE DATA 

        const rows: string[][] = [];

        if (data['entities'] == undefined) return;

        for (const entity of data.entities.filter( (e) => e.type === 'company' && e.slug != 'ebn').sort( (a: EitiEntity, b: EitiEntity) =>  a.name.localeCompare(b.name)) ) {
                
            const companyData = data[dataGroup].filter( (stream: EitiPayments) => ["sales","costs"].indexOf(stream.payment_stream) > -1  && (stream.origin === entity.slug|| stream.recipient == entity.slug)) ;

            if (companyData.length > 0) {

                for (const ustream of ['costs','sales']) {

                    const row : string[] = [];

                    row.push(entity.name);

                    const report = companyData.find( (s) => s.payment_stream === ustream);

                    if (report != undefined) {

                        const stream_name = this.page.main.params.language == 'en' ? report.name_en : report.name_nl;
                        row.push(stream_name);
                    }
                
                    for (const year of uniqueYears) { 

                        const item = companyData.find( (s) => s.payment_stream === ustream && s.year == year);
                        row.push(item != undefined ?  convertToCurrencyInTable(item.payments_companies * 1000 * 1000) : "-")
                    }

                    rows.push(row);
                }

            }

        }

        let headers = this.page.main.params.language == 'en' ?   ["Company","Payment stream"] : ["Bedrijf","Betaalstroom"];
        
        headers = headers.concat(uniqueYears.map( (y) => y.toString()));

        const table = {

            headers,
            rows
        };

        return {
            graph: years,
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
