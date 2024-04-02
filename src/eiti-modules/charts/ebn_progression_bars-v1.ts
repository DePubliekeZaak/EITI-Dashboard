import { GraphControllerV2  } from '@local/d3_graphs';

import { ChartBarProgression, ChartBarsHorizontal, HtmlFunctionality, HtmlHeader, HtmlLegend, HtmlLegendCustom, HTMLTable } from '@local/elements';
import { Bar, EitiPayments, TCtrlrs } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints, colourArray, colours, paymentTypes } from '@local/styleguide';
import { EitiData } from '@local/d3_types';
import { filterUnique } from '@local/eiti-services';
import { convertToCurrencyInTable } from '@local/d3-services/_helpers';
import { schemeOranges } from 'd3';

const graphHeight = 420;
const barHeight = 32;

type IntData  = {
    graph: Bar[],
    table: any
}

// can this be a wrapper for multiple graphcontrollers?
export  class EbnProgressionBarsV1 extends GraphControllerV2  {

    chartAxis;
    chartBar;
    finalRevenueLine;
    zeroLine;
    table;
    funcList;

    bars = {};
    companies = {};
    entity_svgs = {};
    ctrlrs: TCtrlrs = {};

    yScale;
    xScale;
    bottomAxis;
    leftAxis;

    legend;

    constructor(
        public main: any,
        public data : EitiData,
        public element : HTMLElement,
        public mapping: IGraphMapping,
        public segment: string, 
    ){
        super(main,data,element,mapping,segment) 
        this.pre();
    }

    pre() {

        this._addMargin(60,100,0,0);
        this._addPadding(0,0,60,0);

        this._addScale('x','band','horizontal','year');
        this._addScale('y','linear','vertical','value');
        this._addAxis('x','x','bottom');
        this._addAxis('y','y','left','millions')
    }

    async init() {

        const self = this;
        await super._init();

        this.segment = this.mapping.segment.toString();

        if (!this.mapping.multiGraph && this.mapping.header) {
            this.htmlHeader = new HtmlHeader(this.element, this.mapping.header,this.mapping.description);
            this.htmlHeader.draw(); 
        }

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList = new HtmlFunctionality(this,this.element,this.mapping,this.segment);
        }

        if(this.data.payments.length < 1) return;

        const svgId = "svg-wrapper-ebn-simple-bars";
        const container = document.createElement('section');
        container.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight.toString() + "px" : graphHeight.toString() + "px";
        container.classList.add("graph-container-12")
        container.classList.add("graph-view")
        container.id = svgId;
        this.element.appendChild(container);

        

        if (!this.mapping.multiGraph && this.mapping.functionality.indexOf('tableView') > -1) {
            this.table = new HTMLTable(this,this.element);
        }

        this.legend = new HtmlLegendCustom(this.element);

       

        super._svg(container);

        this.config.paddingInner = .2;
        this.config.paddingOuter =  .2;

        this.chartBar = new ChartBarProgression(this);
        await this.update(this.data,this.segment, false);

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

      

        return;
    }

    prepareData(data: EitiData) : IntData {

        const bars = []
        const rows: string[][] = [];
        this.data = data;
        const dataGroup = "payments";
        type Options = {[key:string] : number};
        let options: Options = {};
        let optionGroup: {[key:string] : Options} = {};
        const uniqueYears = filterUnique(data[dataGroup],"year");
        uniqueYears.sort( (a:any,b: any) => parseInt(a) - parseInt(b));

        const streamTypeArray = [];

    


        const ebnData = data[dataGroup].filter ( 
            (s) => 
            (s.origin == 'ebn' || s.recipient == 'ebn') 
            && ["costs","corporate_income_tax","dividends","mor"].indexOf(s.payment_stream) > -1
            && !(s.origin === 'nam' && s.project != "aggregated")
            && !(s.recipient === 'nam' && s.project != "aggregated")
        );


        for (const year of uniqueYears) { 

            const yearData = ebnData.filter( s => s.year  === year );
            const aggregatedStreams = [];


            const outgoingPayments = yearData.filter( p  =>  p.origin == 'ebn' && ['costs','corporate_income_tax','dividends','mor'].indexOf(p.payment_stream) > -1 );


             options = {
            
                incoming : 1000 * 1000 / 10 * Math.round(10 * yearData
                    .filter( p  => p.payment_stream == 'sales' )
                    .map( p => p.payments_companies) 
                    .reduce((sum, p) => sum + p, 0)),

                outgoing : 1000 * 1000 / 10 * Math.round(10 * outgoingPayments
                    .map( p => p.payments_companies) 
                    .reduce((sum, p) => sum + p, 0)),
            }

            options.netto = options.incoming - options.outgoing;

            // if (year === 2022) {
            //     console.log(options.outgoing / 1000 / 1000);
            // }

            optionGroup[year] = options;



            for (const ustream of filterUnique(yearData,"payment_stream")) {


                const streams = yearData.filter( (s) => s.payment_stream === ustream);

                const cum_value = streams.reduce( (acc,s) => acc + s.payments_companies,0);

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

                // bars.push({
                //     label: year.toString(),
                //     colour: 'orange',
                //     value: options[this.segment]

                // });

                // console.log(stream);

                bars.push({
                    label: stream.name_nl,
                    y:  1000 * 1000 / 10 * Math.round(10 * sum),
                    dy: 1000 * 1000 / 10 * Math.round(10 * stream.payments_companies),
                    year,
                    colour: paymentTypes[stream.meta.payment_stream] || 'orange',
                    meta: stream.meta
                })

                sum = sum + stream.payments_companies

                i++;

            }


        }

        console.log(bars);

        for (const year of uniqueYears) {

            const row = [];
            row.push(year);

            for (const option of Object.values(optionGroup[year])) { 

                row.push(convertToCurrencyInTable(option));
            }

            rows.push(row);
        }

        const table = {

            headers:  ["Jaar","Inkomende kasstromen","Uitgaande kasstromen","Netto kasstroom"],
            rows
        };

        return {
            
            graph: bars,
            table
        }
    }

    async draw(data: IntData) {
      
        this.chartBar.draw(data.graph);

        if (!this.mapping.multiGraph && this.mapping.functionality.indexOf('tableView') > -1) {
            this.table.draw(data.table);
        }

        this.legend.draw([
            {
                label: 'Betalingen voor kosten capex en vergunningen',
                colour: 'orange'
            },
            {
                label: 'Vennootschapsbelasting',
                colour: 'blue'
            },
            {
                label: 'Dividenden',
                colour: 'green'
            },
            {
                label: 'Meeropbrengstregeling (MOR)',
                colour: 'purple'
            }
        ])
    
    }


    async redraw(data: any, range: number[]) {

        this.scales.x.set(data.graph.map ( d => d.year));
        // this.scales.y.set(data.graph.map ( d => d.y));
        this.scales.y.set([0,2500000000]);

        await super.redraw(data.graph);
        // redraw data
        this.chartBar.redraw(this.dimensions);
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
