
import { paymentTypes } from '@local/styleguide';
import { filterUnique } from '../../shared/data.format.factory';
import { GroupControllerV1 } from '../../shared/group-v1';
import { IGroupMappingV2 } from '../../shared/interfaces';
import { DataObject, EitiData, TableData } from '../../shared/types';
import { Bar, Bars } from '../../shared/types_graphs';
import { convertToCurrencyInTable } from '../../shared/_helpers';
import { HTMLSource } from '../../shared/html/html-source';


export class EbnBarGroupV1 extends GroupControllerV1 {


    scatter;
    funcList;
    htmlHeader;
    yearSelector;
    uniqueSectors;
    uniqueYears;
    uniqueCompanies;
    table;
    indicators;

    incoming;
    outgoing;
    netto;

    constructor(
        public page: any,
        public config: IGroupMappingV2,
        public index: number
    ){
        super(page,config, index);
    }

    html() {
        const graphWrapper = super.html();
        let source = HTMLSource(graphWrapper?.parentElement as HTMLElement,this.page.main.params.language,"NL-EITI");
        return graphWrapper
    }

    init() {}

    prepareData(data: EitiData) : any {

        const bars = []
        const rows: string[][] = [];
        const dataGroup = "payments";

        if(data[dataGroup] == undefined) return;

        const uniqueYears = filterUnique(data[dataGroup],"year");
        uniqueYears.sort( (a:any,b: any) => parseInt(a) - parseInt(b));

        const incoming : Bars = [];
        const outgoing: Bars  = [];
        const netto : Bars = [];
        
        const ebnData = data[dataGroup].filter ( 
            (s) => 
            ["sales","costs","corporate_income_tax","dividends","mor"].indexOf(s.payment_stream) > -1
            && !(s.origin === 'nam' && s.project != "aggregated")
            && !(s.recipient === 'nam' && s.project != "aggregated")
        );

        for (const year of uniqueYears) { 

            const aggregatedStreams : any[] = [];

            const yearData = ebnData.filter( s => s.year  === year );


            const outgoingPayments = yearData.filter( p  =>  
                p.origin == 'ebn' 
                && ['costs','corporate_income_tax','dividends','mor'].indexOf(p.payment_stream) > -1 
                && !p.aggregated
            );

       

            const sumIncoming = 1000 * 1000 / 10 * Math.round(10 * yearData
                .filter( p  => p.payment_stream == 'sales' )
                .map( p => p.payments_companies) 
                .reduce((sum, p) => sum + p, 0));

            const sumOutgoing = 1000 * 1000 / 10 * Math.round(10 * outgoingPayments
                .map( p => p.payments_companies) 
                .reduce((sum, p) => sum + p, 0));
     
            const sumNetto = sumIncoming - sumOutgoing;

            incoming.push({
                label: year.toString(),
                colour: 'orange',
                value: sumIncoming
            });

            netto.push({
                label: year.toString(),
                colour: 'orange',
                value: sumNetto
            });

            for (const ustream of filterUnique(outgoingPayments,"payment_stream")) {

                const streams = outgoingPayments.filter( (s) => s.payment_stream === ustream);
                const cum_value = streams.reduce( (acc: number,s) => acc + s.payments_companies, 0);

            

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

                outgoing.push({
                    label: this.page.main.params.language == 'en' ? stream.name_en : stream.name_nl,
                    y:  1000 * 1000 / 10 * Math.round(10 * sum),
                    dy: 1000 * 1000 / 10 * Math.round(10 * stream.payments_companies),
                    year: parseInt(year.toString()),
                    colour: paymentTypes[stream.meta.payment_stream] || 'orange',
                    meta: stream.meta,
                    value: 1000 / 10 * Math.round(10 * stream.payments_companies)
                })

                sum = sum + stream.payments_companies

                i++;
            }
        }


       // FOR TABLE

        for (const year of uniqueYears) {

            const row : string[] = [];
            row.push(year.toString());

            const i = incoming.find( (bar) => bar.label == year.toString());
            if (i != undefined) row.push(convertToCurrencyInTable(i.value));

            const os = outgoing.filter( (bar) => bar.year == year).reduce( (acc: number, b: Bar) => (b.dy != undefined) ? acc + b.dy : acc, 0);

            row.push(
                convertToCurrencyInTable(
                    os
                )
            )

            const n = netto.find( (bar) => bar.label == year.toString());
            if (n != undefined) row.push(convertToCurrencyInTable(n.value));

            rows.push(row);
        }

        const headers = this.page.main.params.language == 'en' ? ["Year","Incoming","Outgoing","Net"] : ["Jaar","Inkomende kasstromen","Uitgaande kasstromen","Netto kasstroom"];

        const table = {

            headers,
            rows
        };

        console.log(outgoing.filter( p =>p.year == 2022));
     
       return {
           
            incoming,
            outgoing,
            netto,
            table
       }
    }

    
    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    }

    populateDescription() {

        if (this.config.functionality && this.config.functionality.indexOf('description') > -1) {
            this.description.draw();
        }
    }

    update(data: DataObject, segment: string, update: boolean) {

        super.update(data,segment,update)
    }  
}
