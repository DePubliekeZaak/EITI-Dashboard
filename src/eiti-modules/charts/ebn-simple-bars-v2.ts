import { GraphControllerV2  } from '@local/d3_graphs';

import { ChartBarsHorizontal, HtmlFunctionality, HtmlHeader, HtmlLegend, HTMLTable } from '@local/elements';
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
export  class EbnSimpleBarsV2 extends GraphControllerV2  {

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

        super._svg(container);

        this.config.paddingInner = .2;
        this.config.paddingOuter =  .2;

        this.chartBar = new ChartBarsHorizontal(this);
        await this.update(this.data,this.segment, false);

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

        // this.legend = new HtmlLegend(this);


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

        const ebnData = data[dataGroup].filter ( 
            (s) => 
            ["sales","costs"].indexOf(s.payment_stream) > -1
            && !(s.origin === 'nam' && s.project != "aggregated")
            && !(s.recipient === 'nam' && s.project != "aggregated")
        );


        for (const year of uniqueYears) { 

            const yearData = ebnData.filter( s => s.year  === year );

             options = {
            
                sales : 1000 * 1000 / 10 * Math.round(10 * yearData
                    .filter( p  => p.payment_stream == 'sales')
                    .map( p => p.payments_companies) 
                    .reduce((sum, p) => sum + p, 0)),

                costs : 1000 * 1000 / 10 * Math.round(10 * yearData
                    .filter( p  => p.payment_stream == 'costs')
                    .map( p => p.payments_companies) 
                    .reduce((sum, p) => sum + p, 0)),
            }

            options.netto = options.sales - options.costs;

            optionGroup[year] = options;

            bars.push({
                label: year.toString(),
                colour: 'orange',
                value: options[this.segment]

            });
        }

        for (const year of uniqueYears) {

            const row = [];
            row.push(year);

            for (const option of Object.values(optionGroup[year])) { 

                row.push(convertToCurrencyInTable(option));
            }

            rows.push(row);
        }

        const table = {

            headers:  ["Jaar","Opbrengsten","Kosten","Netto kasstroom"],
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

        this.scales.x.set(data.graph.map ( d => d.label));
        this.scales.y.set(data.graph.map ( d => d.value).concat([0,10000 * 1000 * 1000]));

        await super.redraw(data.graph);
        // redraw data
        this.chartBar.redraw(this.dimensions);
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
