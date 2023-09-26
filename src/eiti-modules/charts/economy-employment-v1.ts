

import { GraphControllerV2, ScaleService  } from '@local/d3_graphs';

import { ChartBarVertical, ChartBarVerticalDoublesV1, HtmlFunctionality, HtmlHeader, HTMLTable } from '@local/elements';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints } from '@local/styleguide';
import { EitiData } from '@local/d3_types';

const graphHeight = 300;

// can this be a wrapper for multiple graphcontrollers?
export class EconomyEmploymentV1 extends GraphControllerV2  {

    bars;
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

        this._addMargin(0,60,0,0);
        this._addPadding(20,60,30,0);

        this._addScale('x','band','horizontal','year');
        this._addScale('y','linear','vertical','value');
    
        this._addAxis('x','x','bottom');
        this._addAxis('y','y','left');
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

        this.element.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight.toString() + "px" : graphHeight.toString() + "px";

        if (!this.mapping.multiGraph && this.mapping.functionality.indexOf('tableView') > -1) {
            this.table = new HTMLTable(this,this.element);
        }

        await super._svg(this.element);

        this.config.paddingInner = .2;
        this.config.paddingOuter = .2;

        this.bars = new ChartBarVerticalDoublesV1(this);
        
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

        this.scales.x.set(data.graph.map( (d) => d.year));
        this.scales.y.set(data.graph.map( (d) => d.value).concat([0]));
        
        this.bars.draw(data.graph);

        if (!this.mapping.multiGraph && this.mapping.functionality.indexOf('tableView') > -1) {
            this.table.draw(data.table);
        }
    }


    async redraw(data: any, range: number[]) {
    
        await super.redraw(data.graph);    
        this.bars.redraw(this.dimensions);
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
