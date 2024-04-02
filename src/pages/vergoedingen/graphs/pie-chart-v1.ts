import { breakpoints } from '../../../img-modules/styleguide';
import { DataObject } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2 } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import HtmlLegend from '../../shared/html/html-legend';

export class PieChartV1 extends core.GraphControllerV3  {

    chartAxis;

    parts = {};
    entity_svgs = {};
    ctrlrs: any = {};

    chartPie

    legend;

    constructor(
        public slug:  string,
        public page: IPageController, 
        public group: GroupObject, 
        public data: DataObject,
        public mapping: IGraphMappingV2,
        public segment: string, 
        public index: number
    ){
        super(slug,page,group,data,mapping,segment) 
        this.pre();
    }

    pre() {

    }

    html() {

        this.config.graphRatio = 1;

        if (window.innerWidth < breakpoints.sm) {
            this.config.graphHeight = 400

        } else if (window.innerWidth < breakpoints.md) {
            this.config.graphHeight = 360
        } else {
            this.config.graphHeight = 420
        }
        

        if(this.group.element == null ) return;

        this.graphEl = super._html();
        if(this.graphEl == null) return;
     //   this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight.toString() + "px" : graphHeight.toString() + "px";
        this.graphEl.style.display = "flex";
        this.graphEl.style.flexDirection = window.innerWidth < breakpoints.sm ? "column" : "row";
        this.graphEl.style.justifyContent = window.innerWidth < breakpoints.sm ? "space-between" : "space-around";
        
        this.legend = new HtmlLegend(this);
    }

    async init() {

        await super._init();
        if (this.graphEl != null) await super._svg(this.graphEl);

        this.config.extra.innerRadius = 50;
        this.config.extra.maxRadius = window.innerWidth < breakpoints.md ? 140 : 200;

        this.chartPie = new elements.ChartPieV1(this);
        await this.update(this.group.data,this.segment, false);

        return;
    }

    prepareData(data: DataObject) : any {
        
        return data;
    }

    async draw(data: DataObject) {

        this.chartPie.draw(data.parts);
        this.legend.draw(data);
       
    
    }


    async redraw(data: any, range: number[]) {

        await super.redraw(data.graphs);
        this.chartPie.redraw(data);
        // this.chartPie.redrawPercentages();

    }

    
    async update(data: DataObject, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
