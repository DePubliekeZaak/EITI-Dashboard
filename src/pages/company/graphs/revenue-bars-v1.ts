
import { TCtrlrs } from '@local/d3_types';
import { breakpoints } from '@local/styleguide';
import { EitiData } from '@local/d3_types';

import { DataObject } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2 } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { HtmlLegendCustom } from '../../shared/html/html-legend-custom';
import { HTMLSource } from '../../shared/html/html-source';

const graphHeight = 420;
const barHeight = 32;

export class RevenueBarsV1 extends core.GraphControllerV3  {

    chartAxis;
    chartBar;
    finalRevenueLine;
    zeroLine;

    bars = {};
    companies = {};
    entity_svgs = {};
    ctrlrs: TCtrlrs = {};

    yScale;
    xScale;
    bottomAxis;
    leftAxis;

    legend;

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

        this._addMargin(60,100,0,0);
        this._addPadding(0,0,60,0);

        this._addScale('x','band','horizontal','year');
        this._addScale('y','linear','vertical','value');
        this._addAxis('x','x','bottom');
        this._addAxis('y','y','left','currency')
    }

    html() {

        if(this.group.element == null ) return;
        // this.group.element.style.minWidth = "600px";

        this.graphEl = super._html();
        if(this.graphEl != null) this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight.toString() + "px" : graphHeight.toString() + "px";

        if (this.graphEl != null && this.group.graphs.length -1 == this.index) {
            let source = HTMLSource(this.graphEl.parentElement as HTMLElement,this.page.main.params.language,"NL-EITI");
            source.style.marginTop = "-6rem"; 
            source.style.position = "absolute";
            source.style.bottom = "0";
        }
    }

    async init() {

        this.config.paddingInner = .2;
        this.config.paddingOuter = .2;

        await super._init();
        if (this.graphEl != null) await super._svg(this.graphEl);

        this.legend = new HtmlLegendCustom(this.graphEl);

        this.chartBar = new elements.ChartBarProgression(this);
        await this.update(this.group.data,this.segment, false);

        return;
    }

    prepareData(data: EitiData) : DataObject {

      return data;
    }

    async draw(data: DataObject) {
      
        this.chartBar.draw(data.graph);

        this.legend.draw([
            {
                label: this.page.main.params.language == 'en' ? "Royalties" : "Cijns",
                colour: "purple"
            },
            {
                label: this.page.main.params.language == 'en' ?  "Surface rental" : "Oppervlakterecht",
                colour: "lightBlue"
            },

            {
                label: this.page.main.params.language == 'en' ? "Retributions" : "Retributies",
                colour: "gray"
            }
        ]);
    
    }


    async redraw(data: any, range: number[]) {

        this.scales.x.set(data.graph.map ( d => d.year));
        this.scales.y.set(data.graph.map ( d => d.y + d.dy).concat([0]));

        await super.redraw(data.graph);

        this.chartBar.redraw(this.dimensions);
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
