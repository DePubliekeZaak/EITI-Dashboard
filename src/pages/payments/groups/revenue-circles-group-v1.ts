
import { HtmlHeader } from '../../shared/html/html-header'
import { HTMLTable } from '../../shared/html/html-table'
import { HtmlFunctionality  } from '../../shared/html/html-functionality';
import { DataObject, EitiData, EitiPayments, EitiReport, TableData } from '../../shared/types';
import { filterUnique } from '../../shared/data.format.factory';
import { IGroupCtrlr, IGroupMappingV2 } from '../../shared/interfaces'
import { convertToCurrencyInTable } from '../../shared/_helpers';
import { Circles } from '../../shared/types_graphs';
import { paymentTypes } from '@local/styleguide';
import { GroupControllerV1 } from '../../shared/group-v1';

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
    ){
        super(page,config);
    }

    init() {}

    html() {
          
        return super.html();
    }

   prepareData(data: EitiData) : any {

        const dataGroup = "payments";
        if (data[dataGroup] ==  undefined) return;

        const circles: Circles = [];
        const aggregatedStreams: any[] = [];

        const yearData = data[dataGroup].filter( (stream: EitiPayments) => stream.year === parseInt(this.segment) && ["sales","costs"].indexOf(stream.payment_stream) < 0 );
        
        // console.log(yearData);

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

        /// TABLE DATA 

        const rows : string[][] = [];
        const uniqueYears  = filterUnique(data[dataGroup],"year");
        uniqueYears.sort( (a:any,b: any) => parseInt(a) - parseInt(b));

        const payments = data[dataGroup].filter( p => p.name_nl != undefined);

        for (const ustream of filterUnique(payments, "payment_stream")) {

            const row : string[] = [];
            const report = data[dataGroup].find( (s) => s.payment_stream === ustream);
            if (report != undefined) row.push(this.page.main.params.language == 'nl' ? report.name_nl : report.name_en);

            for (const year of uniqueYears) { 
                const item = data[dataGroup].find( (s) => s.payment_stream === ustream && s.year == parseInt(year.toString()));
                row.push(item != undefined ?  convertToCurrencyInTable(item.payments_companies) : "-")
            }

            rows.push(row);
        }

        const strings : string[] = [];
        for (let year of uniqueYears) {
            strings.push(year.toString());
        }

        const table = {
            headers:  ["Betaalstroom"].concat(strings),
            rows
        };


        return {
            graph: circles,
            table
        }
   }

   populateTable(tableData: TableData) {

        if (this.config.functionality && this.config.functionality.indexOf('tableView') > -1) {
            this.table.draw(tableData);
        }
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
