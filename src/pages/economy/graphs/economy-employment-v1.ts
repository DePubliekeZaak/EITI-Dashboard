import { breakpoints } from "@local/styleguide";
import { elements } from "../../../charts";
import { GraphControllerV3 } from "../../../charts/core/graph-v3";
import { GroupObject, IGraphMappingV2 } from "../../shared/interfaces";
import { IPageController } from "../../shared/page.controller";
import { DataObject, EitiData } from "../../shared/types";

import { HtmlLegendCustom } from "../../shared/html/html-legend-custom";
import { HTMLSource } from "../../shared/html/html-source";

export class EconomyEmploymentV1 extends GraphControllerV3  {

    bars;
    funcList;
    table;
    r;

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

        this._addMargin(30,60,0,0);
        this._addPadding(20,60,30,0);

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

        this.graphEl.classList.add("graph-view");
        this.graphEl.style.marginTop = "1.5rem"; 


        const legend = new HtmlLegendCustom(this.graphEl);

        const m = this.page.main.params.language == 'en' ? "males (FTE)" : "mannen (FTE)";
        const f = this.page.main.params.language == 'en' ? "females (FTE)" : "vrouwen (FTE)";

        legend.draw([
            { label : m, colour : "orange" } , 
            { label : f, colour : "blue" }
        ]);

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

        const self = this;

        await super._init();

        if (this.graphEl != null) super._svg(this.graphEl);

        this.bars = new elements.ChartBarVerticalDoublesV1(this);
        
        this.update(this.group.data,this.segment, false);

        return;
    }

    prepareData(data: DataObject): any {

        data.graph = data.graphs[this.index];

        return data;
    }

    async draw(data: DataObject) {

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
