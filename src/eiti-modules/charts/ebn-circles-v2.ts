import { GraphControllerV2  } from '@local/d3_graphs';

import { ChartCircleGroupsV2, HtmlFunctionality, HtmlHeader, HTMLTable } from '@local/elements';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints, colours } from '@local/styleguide';
import { EitiData, EitiPayments } from '@local/d3_types';
import { BallenbakSimulationV2 } from '@local/eiti-services';


const graphHeight = 320;

// can this be a wrapper for multiple graphcontrollers?
export  class EbnCirclesV2 extends GraphControllerV2  {

    circles;
    circleGroups;
    simulation = {};

    funcList;
    table;

    // do top 5 and then rest 

    constructor(
        public ctrlr: any,
        public data : EitiData,
        public element : HTMLElement,
        public mapping: IGraphMapping,
        public segment: string, 
        public range: number[],
        public index: number
    ){
        super(ctrlr,data,element,mapping,segment) 
        this.pre();
    }

    pre() {

        this._addMargin(0,0,0,0);
        this._addPadding(40,0,0,0);

        this._addScale('x','band','horizontal','value');
        this._addScale('y','band','vertical-reverse','value');
        this._addScale('r','radius','radius','value');
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

        this.config.minRadius = 20;
        this.config.radiusFactor = this.ctrlr.params.isCompanyPage() ? .6 : .4;
        this.config.paddingInner = .4;
        this.config.paddingOuter = .2;

        this.circleGroups = new ChartCircleGroupsV2(this);

        await this.update(this.data,this.segment, false);

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

       


        return;
    }

    prepareData(data: EitiData): any {

        // this.data = data;
        const dataGroup = "payments";
        const filteredData = data[dataGroup].filter( (stream: EitiPayments) => ["sales","costs"].indexOf(stream.payment_stream) > -1 );
        const nam = [];
        const participants = []; 

        const salesGroup = [];
        const costsGroup = [];

        
        for (const cat of this.mapping.parameters[0]) {

                let payment: any;
                let payments;
                let sales: number;
                let costs:  number
                let meta_sales: EitiPayments[] = [];
                let meta_costs: EitiPayments[] = [];

                switch (cat.label) {

                    case 'Gasterra':
                        payment = filteredData.find( p => p.origin == "gasterra" && p.payment_stream == 'sales');
                        sales = payment.payments_companies;
                        payment = filteredData.find( p => p.recipient == "gasterra" && p.payment_stream == 'costs');
                        costs = payment.payments_companies;
                    break;

                    case 'NAM':
                        payment = filteredData.find( p => p.origin == "nam" && p.project === 'aggregated' && p.payment_stream == 'sales');
                        sales = payment.payments_companies;
                        meta_sales = filteredData.filter( p => p.origin == "nam" && p.project !== 'aggregated' && p.payment_stream == 'sales');
                        payment = filteredData.find( p => p.recipient == "nam" && p.project === 'aggregated' && p.payment_stream == 'costs');
                        costs = payment.payments_companies;
                        meta_costs = filteredData.filter( p => p.recipient == "nam" && p.project !== 'aggregated' && p.payment_stream == 'costs');
                        
                    break;

                    case 'Overige deelnemers':
                        meta_sales = filteredData.filter( p => p.origin !== "nam" && p.origin !== "gasterra" && p.origin !== 'others' && p.payment_stream == 'sales');
                        sales = meta_sales.map( p => p.payments_companies).reduce( (sum,p) => sum + p,0);
                        meta_costs = filteredData.filter( p => p.recipient !== "nam" && p.recipient !== "gasterra" && p.recipient !== 'others' && p.payment_stream == 'costs');
                        costs = meta_costs.map( p => p.payments_companies).reduce( (sum,p) => sum + p,0);
                    break;

                    case 'Andere klanten':
                        payments = filteredData.filter( p => p.origin === 'others' && p.payment_stream == 'sales');
                        sales = payments.map( p => p.payments_companies).reduce( (sum,p) => sum + p,0);
                        payments = filteredData.filter( p => p.recipient === 'others' && p.payment_stream == 'costs');
                        costs = payments.map( p => p.payments_companies).reduce( (sum,p) => sum + p,0);
                }

                costsGroup.push({
                    label: "costs",
                    type: cat.label,
                    colour: colours[cat.colour],
                    value: Math.round(costs * 1000 * 1000),
                    format: "revenue",
                    meta: meta_costs
                })

                salesGroup.push({
                    label: "sales",
                    type: cat.label,
                    colour: colours[cat.colour],
                    value: Math.round(sales * 1000 * 1000),
                    format: "revenue",
                    meta: meta_sales
                })

               
            }
        

        /// TABLE DATA 

        const rows = [];
        // const uniqueYears = filterUnique(data[dataGroup],"year");
        // uniqueYears.sort( (a:any,b: any) => parseInt(a) - parseInt(b));

        // for (const ustream of filterUnique(data[dataGroup],"payment_stream")) {

        //     const row = [];
        //     row.push(data[dataGroup].find( (s) => s.payment_stream === ustream).name_nl);

        //     for (const year of uniqueYears) { 

        //         const item = data[dataGroup].find( (s) => s.payment_stream === ustream && s.year == year);
        //         row.push(item != undefined ?  convertToCurrencyInTable(item.payments_companies) : "-")
        //     }

        //     rows.push(row);
        // }

        const table = {

            headers:  ["Betaalstroom"].concat([this.segment]),
            rows
        };


        return {
            graph: [salesGroup,costsGroup],
            table
        }
    }

    async draw(data: any) {

        this.scales.x.set(data.graph.map( (d) => d['label']));
        this.scales.y.set(data.graph.map( (d) => d['label']));
        this.scales.r.set(this.range);
        
        this.circleGroups.draw(data.graph);

        for (let group of data.graph) {
            this.simulation[group[0].label] = new BallenbakSimulationV2(this);
            this.simulation[group[0].label].supply(group, group.length);
        }
        
        if (!this.mapping.multiGraph && this.mapping.functionality.indexOf('tableView') > -1) {
            this.table.draw(data.table);
        }
    }


    async redraw(data: any, range: number[]) {
     

        await super.redraw(data.graph);
        // redraw data
        this.circleGroups.redraw(this.dimensions);

        data.graph.forEach( (group,i) => {

                 
            this.simulation[group[0].label].redraw(group.length)
        
        });
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
