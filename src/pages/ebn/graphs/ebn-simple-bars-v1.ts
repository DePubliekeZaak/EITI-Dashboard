import { breakpoints } from "@local/styleguide";
import { elements } from "../../../charts";
import { GraphControllerV3 } from "../../../charts/core/graph-v3";
import { GroupObject, IGraphMappingV2 } from "../../shared/interfaces";
import { IPageController } from "../../shared/page.controller";
import { DataObject, EitiData } from "../../shared/types";
import { HtmlHeader } from "../../shared/html/html-header";
import { HTMLSource } from "../../shared/html/html-source";

export  class EbnSimpleBarsV1 extends GraphControllerV3  {

    chartAxis;
    chartBar;
    finalRevenueLine;
    zeroLine;
    table;
    funcList;

    bars = {};
    companies = {};
    entity_svgs = {};

    yScale;
    xScale;
    bottomAxis;
    leftAxis;

    legend;
    header;

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

        this._addMargin(20,100,0,0);
        this._addPadding(0,60,60,0);

        this._addScale('x','band','horizontal','year');
        this._addScale('y','linear','vertical','value');
        this._addAxis('x','x','bottom');
        this._addAxis('y','y','left','millions')
    }

    html() {

        const graphHeight = 420;

        if(this.group.element == null ) return;
        // this.group.element.style.minWidth = "600px";
        this.graphEl = super._html();

        this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight + "px" : graphHeight + "px";
   
    }

    async init() {

        this.config.paddingInner = .2;
        this.config.paddingOuter =  .2;

        await super._init();

        const subheader =  this.page.main.params.language == 'en' ? this.mapping[0][0].label_en : this.mapping[0][0].label;
        this.htmlHeader = new HtmlHeader(this.graphEl,subheader,"");
        this.htmlHeader.draw();

        if (this.graphEl != null) super._svg(this.graphEl);

        this.chartBar = new elements.ChartBarsHorizontal(this);

        this.update(this.group.data, this.segment, false);

        // if (this.graphEl != null) {
        //     let source = HTMLSource(this.graphEl as HTMLElement,this.page.main.params.language,"NL-EITI");
        //  }

        return;
    }

    prepareData(data: DataObject) : any {

        data.slice =  data[this.mapping[0][0].column];

        return data;
    }

    async draw(data: DataObject) {     
      
        this.chartBar.draw(data.slice);
    }


    async redraw(data: any, range: number[]) {

        this.scales.x.set(data.slice.map ( d => d.label));
        this.scales.y.set(data.slice.map ( d => d.value).concat([0,10000 * 1000 * 1000]));

        await super.redraw(data.slice);
        this.chartBar.redraw(this.dimensions);
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

        await super._update(data,segment,update, range);
     }  
}


