
import { breakpoints } from '../../../img-modules/styleguide';
import { DataObject } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2 } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { AxisArrow } from '../../../charts/elements/axis-arrow';
import { HtmlLegendRowWithLines } from '../../shared/html/html-legend-row-with-lines';

export class BarTrendGemVervoeding extends core.GraphControllerV3  {

    chartAxis;
    chartBarTrend;
    finalRevenueLine;
    zeroLine;

    bars = {};
    timeline_1;
    timeline_2;
    // entity_svgs = {};
    // ctrlrs: any = {};

    line;
    lines : any = {};

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

        const top = window.innerWidth < breakpoints.sm ? 30 : 30;
        const bottom = 0;

        this._addMargin(top,bottom,0,30);
        this._addPadding(0,0,30,0);

        this._addScale('x','band','horizontal-reverse','date');
        this._addScale('y','linear','vertical','value');
        this._addAxis('x','x','bottom','quarters');
        this._addAxis('y','y','left')
    }

    html() {

        this.config.graphHeight = window.innerWidth < breakpoints.sm ? 320 : 240;
      
        if(this.group.element == null ) return;

        this.graphEl = super._html();

        // this.legend = new HtmlLegendRowWithLines(this, );
    }

    async init() {
        
        this.config.paddingInner = .2;
        this.config.paddingOuter =  .2;

        await super._init();
        if (this.graphEl != null) await super._svg(this.graphEl);

        this.chartBarTrend = new elements.ChartBarTrend(this);
        this.arrowY = new AxisArrow(this,'y','gem. schadebedrag');
        
        await this.update(this.group.data,this.segment, false);

        return;
    }

    prepareData(data: DataObject) : DataObject {

        return data;
    }

    async draw(data: DataObject) {

        this.chartBarTrend.draw(data.bars);
    }


    async redraw(data: any, range: number[]) {

        this.scales.x.set(data.bars.map ( d => d.label));
        this.scales.y.set(data.bars.map( d => d.value).concat([0]));

        await super.redraw(data.bars);

        this.chartBarTrend.redraw(data.bars);
        await this.arrowY.redraw();
    }

    
    async update(data: DataObject, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
