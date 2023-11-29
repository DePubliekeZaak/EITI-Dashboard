import { breakpoints, colours } from '@local/styleguide';
import { GraphControllerV3 } from '../../../charts/core/graph-v3';
import { GroupObject, IGraphMappingV2 } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { DataObject, EitiData } from '../../shared/types';
import { elements } from '../../../charts';

export  class EbnSankeyV1 extends GraphControllerV3  {

    chartAxis;
    chartLines;
    finalRevenueLine;
    zeroLine;
    table;
    funcList;

    sankey

    yScale;
    xScale;

    gradient_1;
    gradient_2;
    gradient_3;
    gradient_4;

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

        this._addMargin(10,80,0,0);
        this._addPadding(20,20,60,100);

        this._addScale('l','linear','log','company_payments');
    }

    html() {

        const graphHeight = 400;
        if(this.group.element == null ) return;
        // this.group.element.style.minWidth = "600px";
        this.graphEl = super._html();

        this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight + "px" : graphHeight + "px";
        this.graphEl.style.overflowX= "auto";

        this.scrollingContainer = document.createElement('section');
        this.scrollingContainer.classList.add("graph-container-12")
        this.scrollingContainer.classList.add("graph-view")
        this.scrollingContainer.style.height = "calc(100%)";
        this.scrollingContainer.style.minWidth = "800px";

        this.graphEl.appendChild(this.scrollingContainer);
    }


    async init() {

        const self = this;
        this.config.nodeWidth = 0;
        this.config.nodePadding = 80;

        await super._init();

        if (this.graphEl != null) super._svg(this.scrollingContainer);

        this.scales.l.set([1200]);
        this.scales.l.reset();

        this.addGradient();

        this.sankey = new elements.ChartSankeyV2(this,"payments_companies","gray");

        this.update(this.group.data,this.segment, false);

        return;
    }

    addGradient() {

        this.gradient_1 = this.svg.body.append("defs").append("linearGradient")
            .attr("id", "gradient_1")//id of the gradient
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "0%")//since its a vertical linear gradient 

        this.gradient_1.append("stop")
            .attr("offset", "0%")
            .style("stop-color", colours["lightBlue"][0])//end in red
            .style("stop-opacity", 1)
            
        this.gradient_1.append("stop")
            .attr("offset", "100%")
            .style("stop-color", colours["lightBlue"][1])//start in blue
            .style("stop-opacity", 1)

        this.gradient_2 = this.svg.body.append("defs").append("linearGradient")
            .attr("id", "gradient_2")//id of the gradient
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "0%")//since its a vertical linear gradient 

        this.gradient_2.append("stop")
            .attr("offset", "0%")
            .style("stop-color", colours["lightBlue"][1])//end in red
            .style("stop-opacity", 1)
            
        this.gradient_2.append("stop")
            .attr("offset", "100%")
            .style("stop-color", colours["gray"][1])//start in blue
            .style("stop-opacity", 1)

        this.gradient_3 = this.svg.body.append("defs").append("linearGradient")
            .attr("id", "gradient_3")//id of the gradient
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "0%")//since its a vertical linear gradient 

        this.gradient_3.append("stop")
            .attr("offset", "0%")
            .style("stop-color", colours["lightBlue"][1])//end in red
            .style("stop-opacity", 1)
            
        this.gradient_3.append("stop")
            .attr("offset", "100%")
            .style("stop-color", colours["lightBlue"][0])//start in blue
            .style("stop-opacity", 1)

        this.gradient_4 = this.svg.body.append("defs").append("linearGradient")
            .attr("id", "gradient_4")//id of the gradient
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "0%")//since its a vertical linear gradient 

        this.gradient_4.append("stop")
            .attr("offset", "0%")
            .style("stop-color", colours["gray"][1])//end in red
            .style("stop-opacity", 1)
            
        this.gradient_4.append("stop")
            .attr("offset", "100%")
            .style("stop-color", colours["lightBlue"][1])//start in blue
            .style("stop-opacity", 1)
    }

    prepareData(data: DataObject) : DataObject {
        return data;
     }

    async draw(data: any) {

        this.sankey.draw(data.graph);
        
    }


    async redraw(data: any, range: number[]) {

        await super.redraw(data.graph);
        this.sankey.redraw(data.graph,this.dimensions);
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
