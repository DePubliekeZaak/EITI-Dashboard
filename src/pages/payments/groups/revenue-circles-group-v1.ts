
import { DataObject, EitiData, EitiPayments, EitiReport, TableData } from '../../shared/types';
import { filterUnique } from '../../shared/data.format.factory';
import { IGroupMappingV2 } from '../../shared/interfaces'
import { convertToCurrencyInTable } from '../../shared/_helpers';
import { Circles, Definition, Definitions } from '../../shared/types_graphs';
import { paymentTypes } from '@local/styleguide';
import { GroupControllerV1 } from '../../shared/group-v1';
import { HTMLSource } from '../../shared/html/html-source';

export class RevenueCirclesGroupV1 extends GroupControllerV1 { 

    slug: string;
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
        super(page,config, index);
    }

    init() {}

    html() {
          
        const graphWrapper = super.html();
        let source = HTMLSource(graphWrapper?.parentElement as HTMLElement,this.page.main.params.language,"NL-EITI");
        return graphWrapper
    }

   prepareData(data: EitiData) : any {

        const dataGroup = "payments_aggregated";
        if (data[dataGroup] ==  undefined) return;

        const circles: Circles = [];
        const aggregatedStreams: any[] = [];
        const rows : string[][] = [];

        const yearData = data[dataGroup].filter( (stream: EitiPayments) => stream.year === parseInt(this.segment));
        
        for (const ustream of filterUnique( yearData, "payment_stream")) {

            const streams = yearData.filter( (s) => s.payment_stream === ustream);

            aggregatedStreams.push({
                type: streams[0].payment_stream,
                name_nl : streams[0].name_nl,
                name_en : streams[0].name_en,
                payments_companies : streams.reduce( (acc,s) => acc + s.payments_companies,0),
                meta: streams[0]
            })
        }
        
        let i = 0;
        for (const stream of aggregatedStreams) {

            if(stream.payments_companies > 0) {

                circles.push({

                    label: this.page.main.params.language == 'en' ? stream.name_en : stream.name_nl,
                    value: stream.payments_companies < 1 ? 1 : stream.payments_companies,
                    colour: paymentTypes[stream.type],
                    meta: stream.meta
                })

                i++;
            }
        }
       
        const uniqueYears  = filterUnique(data[dataGroup],"year");
        uniqueYears.sort( (a:any,b: any) => parseInt(a) - parseInt(b));

        const payments = data[dataGroup].filter( p => p.name_nl != undefined);

        const uniquePayments = filterUnique(payments, "payment_stream");

        for (const ustream of uniquePayments) {

            const row : string[] = [];
            const report = data[dataGroup].find( (s) => s.payment_stream === ustream);
            if (report != undefined) row.push(this.page.main.params.language == 'nl' ? report.name_nl : report.name_en);

            for (const year of uniqueYears) { 
               
                const items = data[dataGroup].filter( (s) => s.payment_stream === ustream && s.year == parseInt(year.toString()));
                const value = items.reduce( (acc,s) => acc + s.payments_companies,0);  
                row.push(items.length > 0 ?  convertToCurrencyInTable(value) : "-")
            }

            rows.push(row);
        }

        const strings : string[] = [];
        for (let year of uniqueYears) {
            strings.push(year.toString());
        }

        const headers = this.page.main.params.language == 'en' ? ["Payment stream"] : ["Betaalstroom"];

        const table = {
            headers:  headers.concat(uniqueYears.map( y => y.toString())),
            rows
        };

        const definitions: Definitions = [];

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
            graph: circles,
            table,
            definitions
        }
   }

   populateTable(tableData: TableData) {

        if (this.config.functionality && this.config.functionality.indexOf('table') > -1) {
            this.table.draw(tableData);
        }
   }

   populateDescription() {

        super.populateDescription() 

    }   

   update(data: DataObject, segment: string, update: boolean) {

        this.segment = segment;
        const group = this.page.chartArray.find((i) => i.config.slug === this.slug );
        
        group.data = this.prepareData(this.page.main.data.collection());

        for (const graph of group.graphs) {
            graph.ctrlr.update(group.data, segment, false)
        }
   }    
}
