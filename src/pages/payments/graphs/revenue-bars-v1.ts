
import { TCtrlrs } from '@local/d3_types';
import { breakpoints } from '@local/styleguide';
import { EitiData } from '@local/d3_types';

import { DataObject } from '../../shared/types';
import { core } from '../../../charts';
import { GroupObject, IGraphMappingV2 } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { HtmlLegendCustom } from '../../shared/html/html-legend-custom';
import { ChartBarProgression } from '../../../charts/elements/chart-bar-progression';
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

        const bottom = window.innerWidth < breakpoints.sm ? 170 :100

        this._addMargin(60, bottom,0, 0);
        this._addPadding(0,0,60,0);

        this._addScale('x','band','horizontal','year');
        this._addScale('y','linear','vertical','value');
        this._addAxis('x','x','bottom');
        this._addAxis('y','y','left','millions')
    }

    html() {

        if(this.group.element == null ) return;
        // this.group.element.style.minWidth = "600px";

        this.graphEl = super._html();
        if(this.graphEl != null) this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight.toString() + "px" : graphHeight.toString() + "px";


    }

    async init() {

        this.config.paddingInner = .2;
        this.config.paddingOuter =  .2;

        await super._init();
        if (this.graphEl != null) await super._svg(this.graphEl);

        this.legend = new HtmlLegendCustom(this.graphEl);

        this.chartBar = new ChartBarProgression(this);
        await this.update(this.group.data,this.segment, false);

        return;
    }

    prepareData(data: EitiData) : DataObject {

      return data;
    }

    async draw(data: DataObject) {
      
        this.chartBar.draw(data.graph);


        // replace with call to api_defintions and thgen splice the array for relevant payment types

        if (this.mapping.slug == 'betalingen_bedrijven') {

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
        
            ])

        } else {

        this.legend.draw([
            {
                label: this.page.main.params.language == 'en' ?  "Dividends" : "Dividenden",
                colour: "green"
            },
            {
                label: this.page.main.params.language == 'en' ?  "Extra Income Scheme (MOR)" : "Meeropbrengstregeling",
                colour: "violet"
            },
            {
                label: this.page.main.params.language == 'en' ?  "Corporate Income Tax" : "Vennootschapsbelasting",
                colour: "blue"
            },
            {
                label: this.page.main.params.language == 'en' ?  "Profit share" : "Winstaandeel",
                colour: "orange"
            },
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
            },
            {
                label: this.page.main.params.language == 'en' ? "State Share" : "Staatsaandeel",
                colour: "brown"
            }
    
        ])

    }
    }


    async redraw(data: any, range: number[]) {

        this.scales.x.set(data.graph.map ( d => d.year));
        this.scales.y.set(data.graph.map ( d => d.y));

        await super.redraw(data.graph);

        this.chartBar.redraw(this.dimensions);
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
