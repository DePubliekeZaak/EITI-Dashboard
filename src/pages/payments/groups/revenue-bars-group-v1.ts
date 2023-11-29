

import { DataObject, EitiData, EitiPayments, EitiReport, TableData } from '../../shared/types';
import { filterUnique } from '../../shared/data.format.factory';
import { IGroupMappingV2 } from '../../shared/interfaces'
import { convertToCurrencyInTable } from '../../shared/_helpers';
import { Bars } from '../../shared/types_graphs';
import { paymentTypes } from '@local/styleguide';
import { GroupControllerV1 } from '../../shared/group-v1';

export class RevenueBarsGroupV1 extends GroupControllerV1 { 

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
    if(data[dataGroup] == undefined) return;

    const bars: Bars = [];
    const rows: string[][] = [];
   
    const uniqueYears = filterUnique(data[dataGroup],"year");
    uniqueYears.sort( (a:any,b: any) => parseInt(a) - parseInt(b));

    for (const year of uniqueYears) { 

        const yearData = data[dataGroup].filter ( (s) => s.year  === year && ["sales","costs"].indexOf(s.payment_stream) < 0);
        const aggregatedStreams : any[] = [];
      
        for (const ustream of filterUnique(yearData,"payment_stream")) {

            const streams = yearData.filter( (s) => s.payment_stream === ustream);
            const cum_value = streams.reduce( (acc,s) => acc + s.payments_companies,0);

            if(cum_value > 0) {
                aggregatedStreams.push({
                    name_nl : streams[0].name_nl,
                    name_en : streams[0].name_en,
                    payments_companies : cum_value,
                    meta: streams[0]
                })
            }
        }

        let i = 0;
        let sum = 0;
        for (const stream of aggregatedStreams) {

            bars.push({
                label: this.page.main.params.language == 'en' ? stream.name_en : stream.name_nl,
                y: sum,
                dy: stream.payments_companies,
                year: parseInt(year.toString()),
                colour: paymentTypes[stream.meta.payment_stream],
                meta: stream.meta,
                value: sum
            })

            sum = sum + stream.payments_companies

            i++;
        }  
    }

    const payments = data[dataGroup].filter( p => p.name_nl != undefined);

    for (const ustream of filterUnique(payments,"payment_stream")) {

        const row: string[] = [];
        const report = data[dataGroup].find( (s) => s.payment_stream === ustream);
        if (report != undefined) row.push(
            this.page.main.params.language == 'en' ? report.name_en : report.name_nl
        );

        for (const year of uniqueYears) { 

            const item = data[dataGroup].find( (s) => s.payment_stream === ustream && s.year == year);
            row.push(item != undefined ?  convertToCurrencyInTable(item.payments_companies) : "-")
        }

        rows.push(row);
    }

    const table = {

        headers:  ["Betaalstroom"].concat(uniqueYears.map( y => y.toString())),
        rows
    };

    return {
        
        graph: bars,
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
        const group = this.page.chartArray.find( (i) => i.config.slug === this.slug );
        
        group.data = this.prepareData(this.page.main.data.collection());

        for (const graph of group.graphs) {
            graph.ctrlr.update(group.data, segment, false)
        }
   }    
}
