import { GraphControllerV2  } from '@local/d3_graphs';

import { ChartBarProgression, HtmlFunctionality, HtmlHeader, HtmlLegend, HTMLTable } from '@local/elements';
import { Bar, EitiPayments, TCtrlrs } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints, colourArray, colours, paymentTypes } from '@local/styleguide';
import { EitiData } from '@local/d3_types';
import { filterUnique } from '@local/eiti-services';
import { convertToCurrencyInTable } from '@local/d3-services/_helpers';

const graphHeight = 420;
const barHeight = 32;

type IntData  = {
    graph: Bar[],
    table: any
}

// can this be a wrapper for multiple graphcontrollers?
export  class EbnSimpleBarsV1 extends GraphControllerV2  {

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
        this._addScale('y','band','vertical','value');
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

        this.chartBar = new ChartBarProgression(this);
        await this.update(this.data,this.segment, false);

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

        this.legend = new HtmlLegend(this);


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
        const uniqueSectors = filterUnique(data[dataGroup],"origin_sector");

        uniqueYears.sort( (a:any,b: any) => parseInt(a) - parseInt(b));

        const uniqueEntities  = [];

        const ebnData = data[dataGroup].filter ( (s) => ["sales","costs"].indexOf(s.payment_stream) > -1);

        for (const p of ebnData) {

            if (p.payment_stream == 'sales' && uniqueEntities.indexOf(p.origin) < 0 ) {
                uniqueEntities.push(p.origin);
            }
            else if (p.payment_stream == 'costs' && uniqueEntities.indexOf(p.recipient) < 0 ) {
                uniqueEntities.push(p.recipient);
            }
        }


        for (const year of uniqueYears) { 

            const yearData = ebnData.filter( s => s.year  === year)
            const edata = [];
          
            for (const uEntity of uniqueEntities) {

                // add project .... 

                const sales = yearData.find( p => p.payment_stream == 'sales' && p.origin == uEntity);
                const costs = yearData.find( p => p.payment_stream == 'costs' && p.recipient == uEntity);

                if(sales != undefined && costs != undefined) {

                    edata.push({
                        slug: uEntity,
                        label: sales != undefined ? sales.origin_name : costs.recipient_name,
                        sector: sales != undefined ? sales.origin_sector : "",
                        sales: sales != undefined ? sales.payments_companies * 1000 * 1000: 0,
                        costs: costs != undefined ? costs.payments_companies * 1000 * 1000: 0,
                        netto: (sales.payments_companies - costs.payments_companies)  * 1000 * 1000
                    })
                } else {
                    console.log("error at" + uEntity)
                }
            }
        
            let i = 0;
            let sum = 0;

            for (const cat of this.mapping.parameters[0]) {

                let payment: any;
                let payments;
                let total:  number

                switch (cat.label) {

                    case 'Gasterra':
                        payment = edata.find( p => p.slug == "gasterra")
                        // console.log(payment);
                        // console.log(this.segment);
                        bars.push({
                            label: "Gasterra",
                            y: sum,
                            dy: payment[this.segment],
                            year,
                            colour: colours[cat.colour],
                            meta: payment
                        })
                        sum = sum + payment[this.segment]
                        break;


                    case 'Groningen':
                        payment = edata.find( p => p.slug == "nam"); //  && p.project === 'groningen'
                        bars.push({
                            label: "Groningen",
                            y: sum,
                            dy: payment[this.segment],
                            year,
                            colour: colours[cat.colour],
                            meta: payment
                        })
                        sum = sum + payment[this.segment];
                        break;

                    case 'Olie & Gas Exploratie & Productie':
                        payments = edata.filter( p => !(p.slug == "nam" && p.project === 'groningen') && p.slug !== "gasterra" && p.slug !== 'others');
                        total = payments.map( p => p[this.segment]).reduce( (sum,p) => sum + p,0);
                        bars.push({
                            label: "Overige",
                            y: sum,
                            dy: total,
                            year,
                            colour: colours[cat.colour],
                            meta: {}
                        })
                        sum = sum + total
                        break;

                    case 'Overige':
                        payments = edata.filter( p => p.slug === 'others');
                        total = payments.map( p => p[this.segment]).reduce( (sum,p) => sum + p,0);
                        bars.push({
                            label: "Overige",
                            y: sum,
                            dy: total,
                            year,
                            colour: colours[cat.colour],
                            meta: {}
                          })
                        sum = sum + total
                        break;


                        // console.log(yearData.map( y => y.origin_sector));

                }     

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

        // console.log(data.graph);

        this.scales.x.set(data.graph.map ( d => d.year));
        this.scales.y.set(data.graph.map ( d => d.year));

        await super.redraw(data.graph);
        // redraw data
        this.chartBar.redraw(this.dimensions);
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
