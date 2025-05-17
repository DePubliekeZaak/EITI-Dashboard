import { breakpoints } from "@local/styleguide";
import { GraphControllerV3 } from "../../../charts/core/graph-v3";
import { elements } from "../../../charts";
import { DataObject } from "../../shared/types";
import { Bars } from "../../shared/types_graphs";
import { GroupObject, IGraphMappingV2 } from "../../shared/interfaces";
import { IPageController } from "../../shared/page.controller";
import { HTMLSource } from "../../shared/html/html-source";
import { HTMLYear } from "../../shared/html/html-year";

export class ReconciliatieByYearV2 extends GraphControllerV3 {

    chartAxis;
    chartBar;
    bars = {};
    zeroLine;

    grid;
    yScale;
    xScale;
    bottomAxis;
    leftAxis;

    scrollingContainer;
    yearHeader;

  
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

        this._addMargin(20,0,0,0);
        this._addPadding(40,0,280,160);

        this._addScale('x','linear','horizontal','value');
        this._addScale('y','band','vertical-reverse','label');

        this._addAxis('x','x','top');

    }

    html() {

        const graphHeight = 600;

        if(this.group.element == null ) return;
        this.graphEl = super._html();
        this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight + "px" : graphHeight + "px";
        this.graphEl.style.overflowX= "auto";
        this.graphEl.style.position = "relative";
        this.graphEl.style.marginTop = "3rem";
        this.graphEl.style.marginBottom = "3rem";


        this.scrollingContainer = document.createElement('section');
        this.scrollingContainer.classList.add("graph-container-12")
        this.scrollingContainer.classList.add("graph-view")
        this.scrollingContainer.style.position = "relative";    
        this.scrollingContainer.style.position = "relative";    
        this.scrollingContainer.style.height = "calc(100%)";
        this.scrollingContainer.style.minWidth = "600px";


        this.graphEl.appendChild(this.scrollingContainer);

        // console.log(this.group.data.grouped[this.index][0].year);

        this.yearHeader = new HTMLYear(this,this.graphEl)

    }

    init() {

        this.config.paddingInner = 0;
        this.config.paddingOuter = 0.2;

        super._init();

        if (this.graphEl != null) super._svg(this.scrollingContainer);

        this.zeroLine = new elements.ZeroLine(this,"zero", "black")
        this.chartBar = new elements.ChartBarReconciliationV3(this);

        this.update(this.group.data,this.segment, false);

        // if (this.graphEl != null && this.group.graphs.length - 1 == this.index) {
        //     let source = HTMLSource(this.graphEl.parentNode as HTMLElement,this.page.main.params.language,"NL-EITI");
        // }
    }

    prepareData(data: DataObject) : DataObject {

        const myData = data.grouped[this.index]

        data.slice = [];

        const k1 = "difference_in_reported_absolute"
        const k2 = "difference_in_reported_relative"
        const k3 = "difference_reported_and_middle_after"

        const k4 = "discrepancy_company_absolute"
        const k5 = "discrepancy_company_relative"
        
        const k6 = "discrepancy_government_absolute"
        const k7 = "discrepancy_government_relative"

        for (const report of myData) {

            data.slice.push({
                type : "overheid",
                label: report["entity_name"],
                value : report[this.segment],
                colour: "orange",
                format: this.segment.indexOf("relative") > -1 ? "percentage" : undefined,
                meta: report
            })
        }

        return data
    }

    // wat is nu belangrijk? dat iemand heeft bijbetaald .. of geld teruggekregen 
    // of dat er sprake was van een verschil tussen rapporten 
    // na verschil welke kant is de nacalculatie opgegaan? -- afwijking van het midden?

    async draw(data: any) {

        if (this.graphEl != null) this.graphEl.style.height = (data.slice.length * 60).toString() + 'px';
        await this.chartBar.draw(data.slice);
        await this.zeroLine.draw(data.slice);

        this.yearHeader.draw(data.slice[0].meta.year)
    }


    async redraw(data: any, range: number[]) {

        const values : number[] = data.slice.map( (r) => r.value).filter ( r => r != undefined)

        if (values.length < 1) return;
        let min = window.d3.min(values);
        min = min == undefined ? 0 : min * 1.5;
        let max = window.d3.max(values);
        max = max == undefined ? 0 : max * 1.2;
        if (min > 0 ) { min = -5}
        this.scales.x.set([min,max]);
        this.yScale = this.scales.y.set(data.slice.map ( d => d.label));

        await super.redraw(data.slice);
        await this.zeroLine.redraw();
        // redraw data
        await this.chartBar.redraw(data.slice);
    }

    
    async update(data: DataObject, segment: string, update: boolean, range?: number[]) {

        await super._update(data, segment, update, range);
    }
}
