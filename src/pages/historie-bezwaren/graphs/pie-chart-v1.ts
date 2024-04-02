
import { breakpoints } from '../../../img-modules/styleguide';
import { ImgData } from '../../shared/types';

import { DataObject } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2 } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { HtmlLegendCustom } from '../../shared/html/html-legend-custom';
import { HTMLSource } from '../../shared/html/html-source';
import { HtmlRadio } from '../../shared/html/html-radio';
import { HtmlLegendColumn } from '../../shared/html/html-legend-column';
import HtmlLegendAsSum from '../../shared/html/html-legend-sum';
import { PiePart } from '../../shared/types_graphs';


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
        super(slug,page,group,data, mapping,segment) 
        this.pre();
    }

    pre() {

        // const bottom = 100;

        // this._addMargin(60,bottom,0,0);
        // this._addPadding(0,0,30,0);

    }

    html() {

        const graphHeight = 500
        // const barHeight = 32;

        if(this.group.element == null ) return;

        this.graphEl = super._html();
        if(this.graphEl == null) return;
        this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight.toString() + "px" : graphHeight.toString() + "px";
        this.graphEl.style.display = "flex";
        this.graphEl.style.flexDirection = "row";
        this.graphEl.style.justifyContent = "space-around";

        // if (this.graphEl.parentElement && this.mapping[2]) {
        //     let radiobuttons = new HtmlRadio(this, this.mapping[2],this.graphEl.parentElement);
        // }
        
        if (this.graphEl != null && this.group.graphs.length -1 == this.index) {
            let source = HTMLSource(this.graphEl.parentElement as HTMLElement,this.page.main.params.language,"IMG");
            if (source != undefined) {
                source.style.marginTop = "-6rem"; 
                source.style.position = "absolute";
                source.style.bottom = "0";
            }
        }

        this.legend = new HtmlLegendAsSum(this);
    }

    async init() {


        

        await super._init();
        if (this.graphEl != null) await super._svg(this.graphEl);

        this.config.extra.innerRadius = 50;
        this.config.extra.maxRadius = 200;

        this.chartPie = new elements.ChartPieV1(this);
        await this.update(this.group.data,this.segment, false);

      

        return;
    }

    prepareData(data: DataObject) : any {
        
        return data;
    }

    async draw(data: DataObject) {

        this.chartPie.draw(data.graphs);
        this.legend.draw(data.graphs);
       
    
    }


    async redraw(data: any, range: number[]) {

        this.chartPie.redraw(data.graphs);

    }

    
    async update(data: DataObject, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
