import { GraphControllerV2  } from '@local/d3_graphs';

import { ChartBarProgression, ChartLine, HtmlFunctionality, HtmlHeader, HTMLTable } from '@local/elements';
import { Bar, TCtrlrs } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints, colourArray, colours, paymentTypes } from '@local/styleguide';
import { EitiData, EitiReport, GraphData } from '@local/d3_types';
import { Bars } from '@local/d3_types';
import { filterUnique } from '@local/eiti-services';
import { convertToCurrency } from '@local/d3-services';
import { convertToCurrencyInTable } from '@local/d3-services/_helpers';

const graphHeight = 420;
const barHeight = 32;

type IntData  = {
    graph: Bar[],
    table: any
}

// can this be a wrapper for multiple graphcontrollers?
export  class RevenueBarsV1 extends GraphControllerV2  {

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

        this._addMargin(0,100,0,0);
        this._addPadding(0,0,60,0);

        this._addScale('x','band','horizontal','year');
        this._addScale('y','linear','vertical','value');
        this._addAxis('x','x','bottom');
        this._addAxis('y','y','left','millions')
    }

    async init() {

        const self = this;
        await super._init();

        if (!this.mapping.multiGraph && this.mapping.header) {
            this.htmlHeader = new HtmlHeader(this.element, this.mapping.header,this.mapping.description);
            this.htmlHeader.draw(); 
        }

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList = new HtmlFunctionality(this,this.element,this.mapping,this.segment);
        }

        if(this.data.payments.length < 1) return;

        const svgId = "svg-wrapper-reconciliation-" + this.data.payments[0].origin;
        const container = document.createElement('section');
        container.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight.toString() + "px" : graphHeight.toString() + "px";
        container.classList.add("graph-container-12")
        container.classList.add("graph-view")
        container.id = svgId;
        this.element.appendChild(container);

        if (!this.mapping.multiGraph && this.mapping.functionality.indexOf('tableView') > -1) {
            this.table = new HTMLTable(this,this.element);
        }

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

        // can be original eiti data 
        // or new graph data ..
        // so i need to modularize that funnction into service 
        const bars = []
        const rows: string[][] = [];
        this.data = data;
        const dataGroup = "payments";
        const uniqueYears = filterUnique(data[dataGroup],"year");


        uniqueYears.sort( (a:any,b: any) => parseInt(a) - parseInt(b));

        for (const year of uniqueYears) { 

            const yearData = data[dataGroup].filter ( (s) => s.year  === year && ["sales","costs"].indexOf(s.payment_stream) < 0);
            const aggregatedStreams = [];
          

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

                bars.push({
                    label: stream.name_nl,
                    y: sum,
                    dy: stream.payments_companies,
                    year,
                    colour: paymentTypes[stream.meta.payment_stream],
                    meta: stream.meta
                })

                sum = sum + stream.payments_companies

                i++;
            }  
        }

        for (const ustream of filterUnique(data[dataGroup],"payment_stream")) {

            const row = [];
            row.push(data[dataGroup].find( (s) => s.payment_stream === ustream).name_nl);

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

    async draw(data: IntData) {
      
        this.chartBar.draw(data.graph);

        if (!this.mapping.multiGraph && this.mapping.functionality.indexOf('tableView') > -1) {
            this.table.draw(data.table);
        }
    }


    async redraw(data: any, range: number[]) {


        this.scales.x.set(data.graph.map ( d => d.year));
        this.scales.y.set(data.graph.map ( d => d.y));

        await super.redraw(data.graph);
        // redraw data
        this.chartBar.redraw(this.dimensions);
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
