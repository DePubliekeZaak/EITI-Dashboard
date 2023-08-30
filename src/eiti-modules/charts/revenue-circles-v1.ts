import { GraphControllerV2  } from '@local/d3_graphs';

import { ChartCircles, HtmlFunctionality, HtmlHeader, HTMLTable } from '@local/elements';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints, paymentTypes } from '@local/styleguide';
import { EitiData, EitiPayments } from '@local/d3_types';
import { BallenbakSimulation, filterUnique } from '@local/eiti-services';
import { IntData } from '@local/d3_types/data';
import { convertToCurrencyInTable } from '@local/d3-services/_helpers';
import { forEach } from 'lodash';

const graphHeight = 480;

// can this be a wrapper for multiple graphcontrollers?
export  class RevenueCirclesV1 extends GraphControllerV2  {

    circles;
    simulation;

    funcList;
    table;



    // do top 5 and then rest 

    constructor(
        public ctrlr: any,
        public data : EitiData,
        public element : HTMLElement,
        public mapping: IGraphMapping,
        public segment: string, 
    ){
        super(ctrlr,data,element,mapping,segment) 
        this.pre();
    }

    pre() {

        this._addMargin(0,40,0,0);
        this._addPadding(0,0,0,0);

        this._addScale('r','log','radius','value');
    }

    async init() {

        const self = this;

        await super._init();

        if (!this.mapping.multiGraph) {
            this.htmlHeader = new HtmlHeader(this.element, this.mapping.header,this.mapping.description);
            this.htmlHeader.draw(); 
        }

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList = new HtmlFunctionality(this,this.element,this.mapping,this.segment);
        }


        const container = document.createElement('section');
        container.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight.toString() + "px" : graphHeight.toString() + "px";

        for (const className of this.mapping.elementClasslist) { }
        container.classList.add("graph-container-12")
        container.classList.add("graph-view")
        
        this.element.appendChild(container);

        if (!this.mapping.multiGraph && this.mapping.functionality.indexOf('tableView') > -1) {
            this.table = new HTMLTable(this,this.element);
        }

        await super._svg(container);

        this.config.minRadius = 32;
        this.config.radiusFactor = window.innerWidth < breakpoints.sm ? .9 : .6;

        this.circles = new ChartCircles(this);
        this.simulation = new BallenbakSimulation(this);

        await this.update(this.data,this.segment, false);

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }


        return;
    }

    prepareData(data: EitiData): IntData {

        this.data = data;
        const circles = [];
        const dataGroup = "payments";
        const yearData = data[dataGroup].filter( (stream: EitiPayments) => stream.year === parseInt(this.segment) && ["sales","costs"].indexOf(stream.payment_stream) < 0 );
        const aggregatedStreams = [];

        for (const ustream of filterUnique(yearData,"payment_stream")) {

            const streams = yearData.filter( (s) => s.payment_stream === ustream);

            aggregatedStreams.push({
                type: streams[0].payment_stream,
                name_nl : streams[0].name_nl,
                payments_companies : streams.reduce( (acc,s) => acc + s.payments_companies,0),
                meta: streams[0]
            })
        }
        
        let i = 0;
        for (const stream of aggregatedStreams) {

            if(stream.payments_companies > 0) {

                circles.push({

                    label: stream.name_nl,
                    value: stream.payments_companies < 1 ? 1 : stream.payments_companies,
                    colour: paymentTypes[stream.type],
                    meta: stream.meta
                })

                i++;
            }
        }

        /// TABLE DATA 

        const rows = [];
        const uniqueYears  = filterUnique(data[dataGroup],"year");
        uniqueYears.sort( (a:any,b: any) => parseInt(a) - parseInt(b));

        const payments = data[dataGroup].filter( p => p.name_nl != undefined);


        for (const ustream of filterUnique(payments, "payment_stream")) {

            const row = [];
            row.push(data[dataGroup].find( (s) => s.payment_stream === ustream).name_nl);

            for (const year of uniqueYears) { 

                const item = data[dataGroup].find( (s) => s.payment_stream === ustream && s.year == parseInt(year.toString()));

                row.push(item != undefined ?  convertToCurrencyInTable(item.payments_companies) : "-")
            }

            rows.push(row);
        }

        const strings  = []
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

    async draw(data: any) {

        this.scales.r.set(data.graph.map( l => l.value));
        this.circles.draw(data.graph);
        this.simulation.supply(data.graph,"circles")
        
        if (!this.mapping.multiGraph && this.mapping.functionality.indexOf('tableView') > -1) {
            this.table.draw(data.table);
        }
    }


    async redraw(data: any, range: number[]) {
     

        await super.redraw(data.graph);
        // redraw data
        this.circles.redraw(this.dimensions);
        this.simulation.redraw();
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
