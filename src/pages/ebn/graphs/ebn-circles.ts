import { breakpoints } from "@local/styleguide";
import { GraphControllerV3 } from "../../../charts/core/graph-v3";
import { GroupObject, IGraphMappingV2 } from "../../shared/interfaces";
import { IPageController } from "../../shared/page.controller";
import { elements } from "../../../charts";
import { DataObject, EitiData } from "../../shared/types";
import { BallenbakSimulation } from "../../shared/ballenbak.simulation";
import { HTMLSource } from "../../shared/html/html-source";


export class EbnCirclesV1 extends GraphControllerV3  {


    circleGroups;
    simulation = {};

    funcList;
    table;
    scrollingContainer;

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

        this._addMargin(60,0,40,0);
        this._addPadding(0,0,0,0);

        this._addScale('x','band','horizontal','value');
        this._addScale('y','band','vertical-reverse','value');
        this._addScale('r','linear','radius','value');
    }

    html() {

        const graphHeight = 480;
        if(this.group.element == null ) return;
  
        this.graphEl = super._html();

        this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight + "px" : graphHeight + "px";

        this.graphEl.style.overflowX= "auto";

        this.scrollingContainer = document.createElement('section');
        this.scrollingContainer.classList.add("graph-container-12")
        this.scrollingContainer.classList.add("graph-view")
        this.scrollingContainer.style.height = "calc(100%)";
        this.scrollingContainer.style.minWidth = "600px";

        this.graphEl.appendChild(this.scrollingContainer);
    }

    async init() {

        const self = this;
        await super._init();
        if (this.graphEl != null) super._svg(this.scrollingContainer);

        this.config.minRadius = 20;
        this.config.radiusFactor = this.page.main.params.isCompanyPage() ? .6 : .6;
        this.config.paddingInner = .4;
        this.config.paddingOuter = .2;

        this.circleGroups = new elements.ChartCircleGroupsV1(this);

        this.update(this.group.data,this.segment, false);

        // if (this.graphEl != null) {
        //     let source = HTMLSource(this.graphEl as HTMLElement,this.page.main.params.language,"NL-EITI");
        //     source.style.position = "absolute";
        //     source.style.bottom = "0";
        //  }

        return;
    }

    prepareData(data: DataObject): any {

      return data;
    }

    async draw(data: any) {

        let values = [0];
        for (const year of data.graph) {
            values = values.concat(year.group.map(p => p.value))
        }

        this.scales.x.set(data.graph.map( (d) => d['label']));
        this.scales.y.set(data.graph.map( (d) => d['label']));
        this.scales.r.set(values.filter( v => v >= 0)); 
        
        this.circleGroups.draw(data.graph);

        for (let year of data.graph) {

            this.simulation[year.label] = new BallenbakSimulation(this);
            this.simulation[year.label].supply(year.group.filter( g => g.label != 'netto'), "circleGroups", null)
        }
    }


    async redraw(data: any, range: number[]) {
     

        await super.redraw(data.graph);
        // redraw data
        this.circleGroups.redraw(this.dimensions);

        data.graph.forEach( (group,i) => {
            this.simulation[group.label].redraw(data.graph.length)
        });
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

        await super._update(data,segment,update, range);
     } 
}
