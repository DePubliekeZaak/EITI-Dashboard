import { breakpoints } from '../../../img-modules/styleguide';
import { DataObject } from '../../shared/types';
import { core, elements } from '../../../charts';
import { GroupObject, IGraphMappingV2 } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import HtmlLegend from '../../shared/html/html-legend';

import { HTMLYear } from '../../shared/html/html-year';
import MapLegend from '../../shared/html/html-legend-map';


export class MapV1 extends core.GraphControllerV3  {

    chartAxis;
    header

    entity_svgs = {};
    ctrlrs: any = {};

    map;
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

        this._addScale('y','linear','opacity','value');
    }

    html() {

        if (window.innerWidth < breakpoints.sm) {
            this.config.graphHeight = 400

        } else if (window.innerWidth < breakpoints.md) {
            this.config.graphHeight = 360
        } else {
            this.config.graphHeight = 280
        }
        
        if(this.group.element == null ) return;

        this.graphEl = super._html();
        if(this.graphEl == null) return;
        this.graphEl.classList.remove("graph-container-12");
        this.graphEl.classList.add("graph-container-4");
        this.graphEl.classList.add("i-" + this.index)

        this.header = new HTMLYear(this,this.graphEl);
        this.graphEl.style.position = "relative";
        this.graphEl.style.display = "flex";
        this.graphEl.style.flexDirection = window.innerWidth < breakpoints.sm ? "column" : "column";
        this.graphEl.style.justifyContent = window.innerWidth < breakpoints.sm ? "space-between" : "space-around";
        
        // this.legend = new HtmlLegend(this);
    }

    async init() {

        await super._init();
        if (this.graphEl != null) await super._svg(this.graphEl);
    
        this.legend = new MapLegend(this);
        this.map = new elements.MapV1(this);
        await this.update(this.data,this.segment, false);

        return;
    }

    prepareData(data: DataObject) : any {
        return data;
    }

    async draw(data: DataObject) {

        let allValues = [0]
        for (let y of data.geo) {
            allValues = allValues.concat(y.map( g => g.properties.value))
        }

      //  this.scales.y.set(allValues);
      this.scales.y.set(data.geo[this.index].map( g => g.properties.value).concat([0]));

        this.map.draw(data.geo[this.index]);
        this.header.draw(data.geo[this.index][0].properties.year)
        // this.legend.draw(data);
        this.graphEl?.appendChild(this.legend.draw(data.geo[this.index]));
    }


    async redraw(data: any, range: number[]) {

        await super.redraw(data.geo[this.index]);
        // this.map.redraw("value", "orange");

    }

    
    async update(data: DataObject, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
