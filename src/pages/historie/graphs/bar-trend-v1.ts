
import { breakpoints } from '../../../img-modules/styleguide';
import { ImgData } from '../../shared/types';

import { DataObject } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2 } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { HtmlLegendCustom } from '../../shared/html/html-legend-custom';
import { HtmlRadio } from '../../shared/html/html-radio';


export class BarTrendV1 extends core.GraphControllerV3  {

    chartAxis;
    chartBar;
    finalRevenueLine;
    zeroLine;

    bars = {};
    timeline_1;
    timeline_2;
    entity_svgs = {};
    ctrlrs: any = {};

    yScale;
    xScale;
    bottomAxis;
    leftAxis;

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

        this.config.graphHeight =  window.innerWidth > breakpoints.sm ? 420 : 320; //  this.index < 1 ? 420 : 210;

        const bottom = window.innerWidth > breakpoints.sm ? 60 : 15;

        this._addMargin(0,0,0,0);
        this._addPadding(0,bottom,30,30);

        this._addScale('x','band','horizontal-reverse','label');
        this._addScale('x1','time','horizontal','date');
        this._addScale('y','linear','vertical','value');
        this._addAxis('x','x','bottom','quarters');
        this._addAxis('y','y','left')
    }

    html() {

        const graphHeight = this.index < 1 ? 420 : 210;
    
        if(this.group.element == null ) return;

        this.graphEl = super._html();

        if (window.innerWidth > breakpoints.sm && this.graphEl.parentElement && this.mapping[2]) {
            let radiobuttons = new HtmlRadio(this, this.mapping[2],this.graphEl.parentElement);
        }
    }

    async init() {

        

        // console.log(this.segment);

        this.config.paddingInner = .2;
        this.config.paddingOuter =  .2;

        await super._init();
        if (this.graphEl != null) await super._svg(this.graphEl);

        if (window.innerWidth > breakpoints.sm) {
            this.timeline_1 = new elements.ChartTimeline(this);
        }

        this.chartBar = new elements.ChartBarTrend(this);
        await this.update(this.group.data,this.segment, false);

        return;
    }

    prepareData(data: DataObject) : DataObject {

        // for (let key  of Object.keys(data.graphs) ) {

        //     data.graphs[key] = data.graphs[key].slice(0,data.graphs[key].length -2)
        // }

        
        return data;
    }

    async draw(data: DataObject) {

        for (let trend of Object.values(data.graphs)) {
            this.chartBar.draw(trend);
        }

        this.timeline_1?.draw(data.timeline, 0);        
    }


    async redraw(data: any, range: number[]) {

        // console.log(data);

        this.scales.x.set(data.graphs[this.slug].map ( d => d.label));
        this.scales.x1.set(data.graphs[this.slug].map ( d => d.meta._startdatum).filter( d => d != null));
        this.scales.y.set(data.graphs[this.slug].map ( d => d.value).concat([0]));

        await super.redraw(data.graphs[this.slug]);

        for (let trend of Object.values(data.graphs)) {
            this.chartBar.redraw(trend);
        }

        const boxes = [].slice.call(this.graphEl?.parentElement?.querySelectorAll('input[type=checkbox'))

        for( let box of boxes) {

            const group  = this.graphEl?.parentElement?.querySelector('g.' + box.value) as SVGElement;
            if (group != undefined)_: group.style.display = box.checked ? "block" : "none"

           
        }

        this.timeline_1?.redraw(data.timeline, 0);        
    }

    
    async update(data: DataObject, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
