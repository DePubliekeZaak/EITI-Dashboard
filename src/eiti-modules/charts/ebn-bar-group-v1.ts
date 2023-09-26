import { AxesService, ChartDimensions, ChartObject, GraphControllerV2, IGraphControllerV2, ScaleService, SvgService } from '@local/d3_graphs';


import { DataPart, GraphData, TCtrlrs } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints, paymentTypes } from '@local/styleguide';
import { HTMLCompany, HtmlFunctionality, HtmlHeader, HtmlLegend, HTMLSector, HTMLTable, HTMLYear, HtmlYearSelector } from '@local/elements';
import { groupBy, slugify } from '@local/d3-services';
import { charts }  from '@local/charts';
import { Bars, EitiCompanies, EitiData, EitiPayments, EitiReport } from '@local/d3_types/data';
import *  as d3 from 'd3';
import { group } from 'd3';
import { filterUnique, parseEBN } from '@local/eiti-services';
import { bePositive, convertToCurrencyInTable } from '@local/d3-services/_helpers';


// can this be a wrapper for multiple graphcontrollers?
export  class EbnBarGroupV1 { //extends GraphControllerV2 {

// companies: EitiReport[][] = [];
    ctrlrs: TCtrlrs = {};
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
        public main: any,
        public data : any,
        public element : HTMLElement,
        public mapping: IGraphMapping,
        public segment: string  
    ){
        // super(main,data,element,mapping,segment) 
        // this.pre();
    }

    init() {

        
        const self = this;

        if (this.mapping.multiGraph) {
            this.htmlHeader = new HtmlHeader(this.element, this.mapping.header,this.mapping.description);
            this.htmlHeader.draw(); 
        }

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList = new HtmlFunctionality(this,this.element,this.mapping,this.segment);
        }

        // const legend = new HtmlLegend(this)

        const wrapper = document.createElement('section');
        wrapper.classList.add('graph-container-12');
        wrapper.classList.add('graph-wrapper');
        wrapper.style.marginTop = "3rem";
        this.element.appendChild(wrapper);

        const data = this.prepareData(this.data);

        if (this.mapping.functionality.indexOf('tableView') > -1) {
            this.table = new HTMLTable(this,this.element);
            this.table.draw(data.table);
        }

        // const container = document.createElement('article');
        // container.classList.add('graph-container-12');
        // wrapper.appendChild(container);

       
        this.incoming = new charts.EbnSimpleBarsInGroupV1(this.main, { "payments": data.incoming}, wrapper, this.mapping,"Inkomende kasstromen");
        this.incoming.init();

        this.outgoing = new charts.EbnProgressionBarsInGroupV1(this.main, { "payments": data.outgoing}, wrapper, this.mapping,"UItgaande kasstromen");
        this.outgoing.init();

        this.netto = new charts.EbnSimpleBarsInGroupV1(this.main, { "payments": data.netto}, wrapper, this.mapping,"Netto kasstroom");
        this.netto.init();

        this.update(this.data,this.segment, false);

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

    }

    prepareData(data: EitiData) : any {

        const bars = []
        const rows: string[][] = [];
        this.data = data;
        const dataGroup = "payments";
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

            const aggregatedStreams = [];

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

            const sumOutgoing =1000 * 1000 / 10 * Math.round(10 * outgoingPayments
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
                        payments_companies : cum_value,
                        meta: streams[0]
                    })
                }
            }

            let i = 0;
            let sum = 0;

            for (const stream of aggregatedStreams) {

                outgoing.push({
                    label: stream.name_nl,
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

            const row = [];
            row.push(year);

            const i = incoming.find( (bar) => bar.label == year.toString());
            row.push(convertToCurrencyInTable(i.value));

            const o = outgoing.find( (bar) => bar.year == year);

            console.log(o);
            row.push(convertToCurrencyInTable(o.dy));

            const n = netto.find( (bar) => bar.label == year.toString());
            row.push(convertToCurrencyInTable(n.value));

            rows.push(row);
        }

        const table = {

            headers:  ["Jaar","Inkomende kasstromen","Uitgaande kasstromen","Netto kasstroom"],
            rows
        };

     
       return {
           
            incoming,
            outgoing,
            netto,
            table
       }
    }

    
    async update(data: any, segment: string, update: boolean) {

        this.segment = segment;

        if(update) {

            data = this.prepareData(data);

            for (let [slug, graph] of Object.entries(this.ctrlrs)) {

                const indicatorData = data.grouped.find( g => slugify(g[0].payment_stream) === slug);
            
                if(indicatorData != undefined) {
                    graph.update(indicatorData,segment,update,data.range)
                } else {
                    console.log(slug + ' is leeg? ?? ')
                    // nog ondervangen!!1
                }
            }
        }

    } 
}
