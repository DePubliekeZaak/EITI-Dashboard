import { breakpoints } from "@local/styleguide";
import { elements } from "../../../charts";
import { GraphControllerV3 } from "../../../charts/core/graph-v3";
import { GroupObject, IGraphMappingV2 } from "../../shared/interfaces";
import { IPageController } from "../../shared/page.controller";
import { DataObject, EitiData } from "../../shared/types";
import { HTMLSource } from "../../shared/html/html-source";


const graphHeight = 360;

// can this be a wrapper for multiple graphcontrollers?
export class EconomyBarsV1 extends GraphControllerV3 {

    bars;
    funcList;
    table;
    r;
    legend;

    constructor(
        public slug:  string,
        public page: IPageController, 
        public group: GroupObject, 
        public mapping: IGraphMappingV2,
        public segment: string, 
        public index: number
    ){
        super(slug,page,group,mapping,segment) 
        this.pre();
    }

    pre() {

        this._addMargin(0,60,0,0);
        this._addPadding(40,60,30,0);

        this._addScale('x','band','horizontal','year');
        this._addScale('y','linear','vertical','value');
    
        this._addAxis('x','x','bottom');
        this._addAxis('y','y','left');
    }

    html() {

        const graphHeight = 300;

        if(this.group.element == null ) return;
        // this.group.element.style.minWidth = "600px";
        this.graphEl = super._html();

        this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight + "px" : graphHeight + "px";
 
        const header = document.createElement("h3");
        header.style.marginBottom = "1rem";

        if (this.graphEl != null) this.graphEl.appendChild(header);

        if (this.graphEl != null && this.group.graphs.length -1 == this.index) {
            let source = HTMLSource(this.graphEl.parentElement as HTMLElement,this.page.main.params.language,"CBS");
            source.style.marginTop = "-6rem"; 
            source.style.position = "absolute";
            source.style.bottom = "0";
        }
    }

    async init() {

        this.config.paddingInner = .2;
        this.config.paddingOuter = .2;
        
        await super._init();

        if (this.graphEl != null) super._svg(this.graphEl);

        this.bars = new elements.ChartBarVerticalDoublesV1(this);
        
        this.update(this.group.data,this.segment, false);

        return;
    }

    prepareData(data: DataObject): DataObject {

        data.graph = data.graphs[this.index];

        return data;
    }

    async draw(data: any) {

        if (this.graphEl != null) {
            const header = this.graphEl.querySelector('h3');
            if (header != null) header.innerText = data.graph[0].sector;
        }

        this.scales.x.set(data.graph.map( (d) => d.year));
        this.scales.y.set(data.graph.map( (d) => d.value).concat([0]));
        
        this.bars.draw(data.graph);
    }


    async redraw(data: any, range: number[]) {
    
        await super.redraw(data.graph);    
        this.bars.redraw(this.dimensions);
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
