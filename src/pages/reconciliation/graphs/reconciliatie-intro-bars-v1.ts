
import { breakpoints } from '@local/styleguide';


import { GraphControllerV3 } from '../../../charts/core/graph-v3';
import { GroupObject, IGraphMappingV2 } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { DataObject } from '../../shared/types';
import { HTMLYear } from '../../shared/html/html-year';
import { HtmlLegendCustom } from '../../shared/html/html-legend-custom';
import { slugify } from '../../shared/_helpers';
import { Bars } from '../../shared/types_graphs';
import { elements } from '../../../charts';
import { HTMLSource } from '../../shared/html/html-source';

const graphHeight = 330;


// can this be a wrapper for multiple graphcontrollers?
export  class ReconciliatieIntroBarsV1 extends GraphControllerV3 {

    chartAxis;
    chartBar;
    bars = {};

    zeroLine;

    grid;
    yScale;
    xScale;
    bottomAxis;
    leftAxis;

    legend;
    header;

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

        if (window.innerWidth < breakpoints.xsm) {
            this._addMargin(30,80,0,0);
        } else if(window.innerWidth < breakpoints.md) {
            this._addMargin(30,80,0,100);
        } else {
            this._addMargin(30,80,0,0);
        }


        this._addPadding(0,30,10,120);
        this._addScale('x','linear','horizontal','value');

        this._addScale('y','band','vertical','label');
        this._addAxis('x','x','bottom');
    }

    html() {

        const graphHeight = 330;

        if(this.group.element == null ) return;
        // this.group.element.style.minWidth = "600px";
        this.graphEl = super._html();

        this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight + "px" : graphHeight + "px";
        this.graphEl.classList.remove("graph-container-12")
        this.graphEl.classList.add("graph-container-6");
        this.graphEl.style.position = "relative";
        this.graphEl.style.paddingTop = "3rem";
        this.graphEl.style.marginBottom = "3rem";

        
        
    }

    init() {

        this.config.paddingInner = 0.125;
        this.config.paddingOuter = 0.125;

        super._init();

       if (this.graphEl != null) super._svg(this.graphEl);

        this.header = new HTMLYear(this, this.graphEl);
       // this.header.container.style.alignItems = 'flex-start';

        this.legend = new HtmlLegendCustom(this.element);
        this.legend.draw([
            { 
                colour: "blue",
                label: this.page.main.params.language == 'en' ? 'government' : 'overheid',
            },
            {
                colour: "orange",
                label: this.page.main.params.language == 'en' ? 'companies' : 'bedrijven',
            }
        ])

        this.zeroLine = new elements.ZeroLine(this,"zero", "black")
        this.chartBar = new elements.ChartBarReconIntroV1(this);

        this.update(this.group.data,this.segment, false);


        if (this.graphEl != null && this.graphEl.parentNode != null && this.graphEl.parentNode.parentNode != null) {
            if (this.group.graphs.length - 2 == this.index * 2) {
               let source = HTMLSource(this.graphEl.parentNode.parentNode as HTMLElement,this.page.main.params.language,"NL-EITI");
               source.style.marginTop = '2rem';
            }
        }
    }

    prepareData(data: DataObject) : DataObject {

        const myData = data.totals[this.index];
        data.slice = [];
        const keys = Object.keys(myData).filter( k => ["origin","entity_name","sector","type","year"].indexOf(k) < 0);

        for (const key of keys.reverse()) {

            const map = this.mapping[0].find( m => m.column === key);

            if(map != undefined) {

                data.slice.push({
                    type : key,
                    label: this.page.main.params.language == 'en' ? map['label_en'] : map['label'], 
                    value : myData[key],
                    value2: 100,
                    colour: key.indexOf("compan") > -1 ? "orange" : "blue",
                    year: myData.year
                })
            }
        }

        return data
    }

    async draw(data: any) {

        let year = data.slice[0].year;

        if (year == 'all') {
            year = this.page.main.params.language == 'en' ? 'All years' : 'Alle jaren'
        }

        this.header.draw(year);

        await this.chartBar.draw(data);
        await this.zeroLine.draw(data);
    }


    async redraw(data: any, range: number[]) {

        this.scales.x.set(data.slice.map( t=> t.value).concat(0));
        this.yScale = this.scales.y.set(data.slice.map ( d => slugify(d.label)));

        await super.redraw(data);
        await this.zeroLine.redraw();
        await this.chartBar.redraw(data);
    }

    
    async update(data: DataObject, segment: string, update: boolean, range?: number[]) {

        await super._update(data, segment, update, range);
    }
}