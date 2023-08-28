

import { GraphControllerV2, ScaleService  } from '@local/d3_graphs';

import { ChartBarProgression, ChartCircleGroupsV2, ChartPie, ChartPies, HtmlFunctionality, HtmlHeader, HTMLTable } from '@local/elements';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints, colours } from '@local/styleguide';
import { EitiData, EitiPayments } from '@local/d3_types';
import { BallenbakSimulationV2 } from '@local/eiti-services';

const graphHeight = 160;

// can this be a wrapper for multiple graphcontrollers?
export class EconomyPiesV1 extends GraphControllerV2  {

    pie;
    funcList;
    table;
    r;

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
        this.init();
    }

    pre() {

        this._addMargin(0,30,0,0);
        this._addPadding(60,0,0,0);

        // this._addScale('x','band','horizontal','value');
        // this._addScale('y','band','vertical-reverse','value');
       // this._addScale('r','log','radial','value');

       this.r = new ScaleService(this,{  
            slug : 'r',
            type: 'linear',
            direction: 'radius',
            parameter: null
        })
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
        container.classList.add("graph-container-2")
        container.classList.add("graph-view")

        let header = document.createElement('div');
        header.style.textAlign = "center";
        container.appendChild(header);
        
        this.element.appendChild(container);

        if (!this.mapping.multiGraph && this.mapping.functionality.indexOf('tableView') > -1) {
            this.table = new HTMLTable(this,this.element);
        }

        await super._svg(container);

        this.config.minRadius = 20;
        this.config.radiusFactor = this.ctrlr.params.isCompanyPage() ? .6 : 2;
        this.config.paddingInner = .01;
        this.config.paddingOuter = .01;

        this.pie = new ChartPie(this);
        
        await this.update(this.data,this.segment, false);

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

        return;
    }

    prepareData(data: EitiData): any {

        return {
            graph: data,
        }
    }

    async draw(data: any) {

        this.element.querySelector('div').innerText = data.graph[0].year;
        this.r.set(this.range);
        
        this.pie.draw(data.graph);

        if (!this.mapping.multiGraph && this.mapping.functionality.indexOf('tableView') > -1) {
            this.table.draw(data.table);
        }
    }


    async redraw(data: any, range: number[]) {
    
        await super.redraw(data.graph);    
        this.r.reset(); 
        this.pie.redraw(this.dimensions);
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
