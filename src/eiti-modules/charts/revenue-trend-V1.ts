import { GraphControllerV2  } from '@local/d3_graphs';

import { ChartLines, HtmlFunctionality, HtmlHeader, HTMLTable } from '@local/elements';
import { TCtrlrs } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints } from '@local/styleguide';
// import * as d3 from 'd3';
import { Line, Lines, EitiData } from '@local/d3_types';
import { filterUnique, formatLines } from '@local/eiti-services';

const graphHeight = 200;

// can this be a wrapper for multiple graphcontrollers?
export  class RevenueTrendV1 extends GraphControllerV2  {

    chartAxis;
    chartLines;
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

    // do top 5 and then rest 

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

        this._addMargin(0,40,40,0);
        this._addPadding(0,20,0,300);

        this._addScale('x','linear','horizontal','year');
        this._addScale('y','linear','vertical','value');
    
        this._addAxis('x','x','bottom');
        this._addAxis('y','y','left')
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

        this.element.classList.remove("graph-container");
        this.element.classList.add("graph-wrapper");

        // const svgId = "svg-wrapper-reconciliation-" + this.data[0][0].entity_slug;
        const container = document.createElement('section');
        container.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight.toString() + "px" : graphHeight.toString() + "px";
        container.classList.add("graph-container-12")
        container.classList.add("graph-view")
        // container.id = svgId;
        this.element.appendChild(container);

        if (!this.mapping.multiGraph) {
            this.table = new HTMLTable(this,this.element);
        }

        await super._svg(container);

        this.config.paddingInner = 0;
        this.config.paddingOuter = 0;

        this.chartLines = new ChartLines(this,"value","gray");

        await this.update(this.data,this.segment, false);

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }


        return;
    }

    prepareData(data: EitiData) : any {

        this.data = data;
        const uniqueYears = filterUnique(data.payments,"year");
       
        const readyForLines = formatLines(data.payments,"payment_stream","payments_companies","name_nl")
        console.log(readyForLines);

        return {
            uniqueYears,
            readyForLines        
        };
    }

    async draw(data: any) {

        this.chartLines.draw(data.readyForLines);
        
        if (!this.mapping.multiGraph) {
            this.table.draw(data.readyForLines);
        }
    }


    async redraw(data: any, range: number[]) {

        const min = parseFloat(window.d3.min(data.uniqueYears)) - 0;
        const max = parseFloat(window.d3.max(data.uniqueYears)) + 0;

        this.scales.x.set([min,max]);
     
        this.scales.y.set(data.readyForLines.flat().map( l => l.value));

        await super.redraw(data);
        // redraw data
        this.chartLines.redraw(this.dimensions);
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
