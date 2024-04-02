
import { breakpoints } from '../../../img-modules/styleguide';
import { ImgData } from '../../shared/types';

import { DataObject } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2 } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { HtmlLegendCustom } from '../../shared/html/html-legend-custom';
import { HtmlRadio } from '../../shared/html/html-radio';
import { AxisArrow } from '../../../charts/elements/axis-arrow';


export class BarTrendStackedBesluiten extends core.GraphControllerV3  {

    chartAxis;
    chartBarStacked;
    finalRevenueLine;
    zeroLine;

    bars = {};
    timeline_1;
    timeline_2;
    // entity_svgs = {};
    // ctrlrs: any = {};

    line

    yScale;
    xScale;
    bottomAxis;
    leftAxis;

    legend;

    arrowX;
    arrowY;
    arrowY1

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

        const top = window.innerWidth < breakpoints.sm ? 30 : 90;
        const bottom = 40;

        this._addMargin(top,bottom,0,30);
        this._addPadding(0,0,30,0);

        this._addScale('x','band','horizontal-reverse','date');
        this._addScale('y','linear','vertical','value');
        this._addScale('y1','linear','vertical','value');
        this._addAxis('x','x','bottom','quarters');
        this._addAxis('y','y','left')
        this._addAxis('y1','y1','right','percentage')
    }

    html() {

        this.config.graphHeight = window.innerWidth < breakpoints.sm ? 320 : 240;
      
        if(this.group.element == null ) return;

        this.graphEl = super._html();
    }

    async init() {
        
        this.config.paddingInner = .2;
        this.config.paddingOuter =  .2;

        await super._init();
        if (this.graphEl != null) await super._svg(this.graphEl);

        this.chartBarStacked = new elements.ChartStackedBars(this);
        this.line = new elements.ChartLine(this, "_yearmonth", this.mapping[1][0].column)

      //  this.arrowX = new AxisArrow(this,'x','afwijking in percentage van som');
        this.arrowY = new AxisArrow(this,'y','aantal besluiten p.m.');
        this.arrowY1 = new AxisArrow(this,'y1','percentage toegekend p.m.');
        
        await this.update(this.group.data,this.segment, false);

        return;
    }

    prepareData(data: DataObject) : DataObject {

        return data;
    }

    async draw(data: DataObject) {

        this.chartBarStacked.draw(data);
        this.line.draw(data.line);
        // this.timeline_1.draw(data.timeline, 0);
        // this.timeline_2.draw(data.timeline_organisation,1);  
    }


    async redraw(data: any, range: number[]) {

        this.scales.x.set(data.bars.map ( d => d.date));
   //   this.scales.x1.set(data.graphs[this.slug].map ( d => d.meta._startdatum).filter( d => d != null));
        this.scales.y.set(data.stacked[1].map( d => d[1]).concat([0]));
        this.scales.y1.set([0,100]);

        await super.redraw(data.stacked);

        this.chartBarStacked.redraw(data);
        this.line.redraw();

    //    await this.arrowX.redraw();
        await this.arrowY.redraw();
        await this.arrowY1.redraw();

        // this.timeline_1.redraw(data.timeline, 0);
        // this.timeline_2.redraw(data.timeline_organisation, 1);  
    }

    
    async update(data: DataObject, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
