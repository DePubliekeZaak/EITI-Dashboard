import { breakpoints } from "@local/styleguide";
import { GroupObject, IGraphMappingV2, IGroupMappingV2 } from "../../shared/interfaces";
import { GroupControllerV1 } from "../../shared/group-v1";
import { GraphControllerV3 } from "../../../charts/core/graph-v3";
import { IPageController } from "../../shared/page.controller";
import { elements } from "../../../charts";
import { HtmlLegendColumn } from "../../shared/html/html-legend-column";
import { DataObject } from "../../shared/types";
import { HTMLSource } from "../../shared/html/html-source";

export class ReconciliationCompanyV2 extends GraphControllerV3 {

    chartAxis;
    chartBar;
    bars = {};


    funcList;
    zeroLine;
    table;

    grid;
    yScale;
    xScale;
    bottomAxis;
    leftAxis;
    arrowX;

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

        this._addMargin(20,140,0,0);

        const rightSpace = window.innerWidth < breakpoints.xsm ? 0 : 200;
        this._addPadding(0,40,40,rightSpace);

        this._addScale('x','linear','horizontal','value');
        this._addScale('y','band','vertical','label');

        this._addAxis('x','x','bottom','percentage');
        this._addAxis('y','y','left')
    }

    html() {

        if(this.group.element == null ) return;
        // this.group.element.style.minWidth = "600px";
        this.graphEl = super._html();

        this.graphEl.style.overflowX= "auto";

        this.scrollingContainer = document.createElement('section');
        this.scrollingContainer.classList.add("graph-container-12")
        this.scrollingContainer.classList.add("graph-view")
        this.scrollingContainer.style.height = "calc(100%)";
        this.scrollingContainer.style.minWidth = "600px";

        this.graphEl.appendChild(this.scrollingContainer);

    }

    init() {

        this.config.paddingInner = 0.2;
        this.config.paddingOuter = 0;

        super._init();

        if (this.graphEl != null) super._svg(this.scrollingContainer);

        this.zeroLine = new elements.ZeroLine(this,"zero", "black")
        this.chartBar = new elements.ChartBarReconciliationV2(this);

        const legend = new HtmlLegendColumn(this)

        const xText = this.page.main.params.language == 'en' ? 'payment streams after reconciliation is higher  ' : 'betaalstroom  na reconciliatie valt hoger uit';

        this.arrowX = new elements.AxisArrow(this,'x',xText);

        this.update(this.group.data,this.segment, false);

        // if (this.graphEl != null && this.graphEl.parentNode != null && this.graphEl.parentNode.parentNode != null) {
        //        let source = HTMLSource(this.graphEl.parentNode.parentNode as HTMLElement,this.page.main.params.language,"NL-EITI");  
        // }
    }

    prepareData(data: DataObject) : DataObject {

        return data;
    }

    async draw(data: any) {

        if(this.graphEl != null) this.graphEl.style.height = ((data.slice.length + 1) * 49).toString() + 'px';

        await this.chartBar.draw(data.slice);
        await this.zeroLine.draw(data);
    }


    async redraw(data: any, range: number[]) {

        const values : number[] = data.slice.map( (r) => {
           return  r.value2 - r.value
        });

        if (values.length < 1) return;
        let min = window.d3.min(values);
        min = min == undefined ? 0 : min;
        let max = window.d3.max(values);
        max = max == undefined ? 0 : max;
        if (min > 0 ) { min = -5}
        this.scales.x.set([min,max]);
        this.yScale = this.scales.y.set(data.slice.map ( d => d.label));

        await super.redraw(data.slice);
        await this.zeroLine.redraw();
        // redraw data
        await this.chartBar.redraw(data.slice);

        this.arrowX.redraw();

    }

    
    async update(data: DataObject, segment: string, update: boolean, range?: number[]) {

        await super._update(data, segment, update, range);
    } 

}
