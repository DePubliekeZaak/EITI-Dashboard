import { breakpoints, colours } from "@local/styleguide";
import { elements } from "../../../charts";
import { GraphControllerV3 } from "../../../charts/core/graph-v3";
import { IGraphMappingV2 } from "../../shared/interfaces";
import { DataObject, EitiData, EitiPayments } from "../../shared/types";
import { BallenbakSimulationV2 } from "../../shared/ballenbak.simulation-v2";
import { HTMLYear } from "../../shared/html/html-year";
import { HTMLSource } from "../../shared/html/html-source";

export  class EbnCirclesV2 extends GraphControllerV3  {

    circles;
    circleGroups;
    simulation = {};

    funcList;
    table;
    subheader;
    scrollingContainer;

    constructor(
        public ctrlr: any,
        public data : EitiData,
        public element : HTMLElement,
        public mapping: IGraphMappingV2,
        public segment: string, 
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

    html() {

        const graphHeight = 480;
        if(this.group.element == null ) return;
        this.graphEl = super._html();

        this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight + "px" : graphHeight + "px";
        this.graphEl.style.position = "relative";

        this.subheader = new HTMLYear(this,this.graphEl,"center");

        if(window.innerWidth < breakpoints.lg) {

            this.graphEl.style.overflowX= "auto";

        }

        this.scrollingContainer = document.createElement('section');
        this.scrollingContainer.classList.add("graph-container-12")
        this.scrollingContainer.classList.add("graph-view")
        this.scrollingContainer.style.height = "calc(100%)";
        this.scrollingContainer.style.minWidth = "600px";

        this.graphEl.appendChild(this.scrollingContainer);

    }

    async init() {

        this.config.minRadius = 20;
        this.config.radiusFactor = .4;
        this.config.paddingInner = .4;
        this.config.paddingOuter = .2;

        const self = this;

        await super._init();
        if (this.graphEl != null) super._svg(this.scrollingContainer);

        // if (this.graphEl != null) {

        //     let svg = this.graphEl.querySelector("svg");
        //     if (svg != null) svg.style.position = "absolute";
            
        // }

        this.circleGroups = new elements.ChartCircleGroupsV2(this);

        this.update(this.group.data,this.segment, false);


        // if (this.graphEl != null && this.group.graphs.length -1 == this.index) {
        //     let source = HTMLSource(this.graphEl as HTMLElement,this.page.main.params.language,"NL-EITI");
        //     source.style.marginTop = "-6rem"; 
        //     source.style.position = "absolute";
        //     source.style.bottom = "0";
        //  }

        return;
    }

    prepareData(data: DataObject): any {

        const myData = data.grouped[this.index];
        const dataGroup = "payments";
        const filteredData = myData.filter( (stream: EitiPayments) => ["sales","costs"].indexOf(stream.payment_stream) > -1 );
        const nam = [];
        const participants = []; 
 
        const salesGroup: any[] = [];
        const costsGroup: any[] = [];
         
        for (const cat of this.mapping[0]) {
 
                 let payment: any;
                 let payments;
                 let sales: number = 0;
                 let costs:  number = 0;
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
         


        data.graph =  [salesGroup,costsGroup];
          

        return data;
       
    }

    async draw(data: any) {

        this.subheader.draw(data.grouped[this.index][0].year);

        this.scales.x.set(data.graph.map( (d) => d['label']));
        this.scales.y.set(data.graph.map( (d) => d['label']));
        this.scales.r.set(data.range);
        
        this.circleGroups.draw(data.graph);

        // revenue and payments are two circle groups 
        for (let group of data.graph) {
            this.simulation[group[0].label] = new BallenbakSimulationV2(this);
            this.simulation[group[0].label].supply(group, group.length);
        }
    }


    async redraw(data: any, range: number[]) {
     

        await super.redraw(data.graph);
   
        this.circleGroups.redraw(this.dimensions);
        
        data.graph.forEach( (group,i) => {     
            this.simulation[group[0].label].redraw(group.length)
        });
      
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
