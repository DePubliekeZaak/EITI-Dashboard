
import { breakpoints } from '../../../img-modules/styleguide';
import { DataObject } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2 } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { AxisArrow } from '../../../charts/elements/axis-arrow';
import { HtmlLegendRowWithLines } from '../../shared/html/html-legend-row-with-lines';
import { HTMLYear } from '../../shared/html/html-year';

export class SMBandBarsOrdes extends core.GraphControllerV3  {

    header;
    chartAxis;
    chart;
    finalRevenueLine;
    zeroLine;

    bars = {};
    timeline_1;
    timeline_2;

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
        super(slug,page,group,data,mapping,segment) 
        this.pre();
    }

    pre() {

        const top = window.innerWidth < breakpoints.sm ? 0 : 0;
        const bottom = 0;

        this._addMargin(top,bottom,0,0);
        this._addPadding(30,30,30,0);

        this._addScale('x','band','horizontal-reverse','label');
        this._addScale('y','linear','vertical','value');
        this._addAxis('x','x','bottom','short');
        this._addAxis('y','y','left')
    }

    html() {

        this.config.graphHeight = window.innerWidth < breakpoints.sm ? 320 : 240;
      
        if(this.group.element == null ) return;

        this.graphEl = super._html();
        this.graphEl.classList.remove("graph-container-12");
        this.graphEl.classList.add("graph-container-4");

        this.header = new HTMLYear(this,this.graphEl);


        // this.legend = new HtmlLegendRowWithLines(this, );
    }

    async init() {
        
        this.config.paddingInner = .2;
        this.config.paddingOuter =  .2;

        await super._init();
        if (this.graphEl != null) await super._svg(this.graphEl);

        this.chart = new elements.ChartBandBar(this);
        this.arrowY = new AxisArrow(this,'y','schadebedrag');
        
        await this.update(this.group.data,this.segment, false);

        return;
    }

    prepareData(data: DataObject) : DataObject {

        return data;
    }

    async draw(data: DataObject) {

        this.chart.draw(data.years[this.index]);
        this.header.draw(data.years[this.index][0].meta._year) 
    }


    async redraw(data: any, range: number[]) {

        this.scales.x.set(data.years[this.index].map ( d => d.label));
        this.scales.y.set(data.years[this.index].map( d => d.value).concat([0]));

        await super.redraw(data.years[this.index]);

        this.chart.redraw(data.years[this.index]);
        await this.arrowY.redraw();
    }

    
    async update(data: DataObject, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
