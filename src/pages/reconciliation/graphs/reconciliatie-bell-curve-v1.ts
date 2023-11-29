
import { breakpoints } from '@local/styleguide';
import { GraphControllerV3 } from '../../../charts/core/graph-v3';
import { GroupObject, IGraphMappingV2 } from '../../shared/interfaces';
import { IPageController } from '../../shared/page.controller';
import { DataObject } from '../../shared/types';
import { Bars } from '../../shared/types_graphs';
import { elements } from '../../../charts';

const graphHeight = 345;

// can this be a wrapper for multiple graphcontrollers?
export  class ReconciliatieIntroBellsV1 extends GraphControllerV3 {

    chartAxis;
    chartBar;
    bell;
 
    zeroLine;

    grid;
    yScale;
    xScale;
    bottomAxis;
    leftAxis;

    arrowX;
    arrowY;

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

        if (window.innerWidth > breakpoints.md) {

            this._addMargin(60,10,0,0);

        } else {

            this._addMargin(0,60,0,0);
        }

     
        this._addPadding(0,0,10,60);

        this._addScale('y','linear','vertical','value');
        this._addScale('x','linear','horizontal','label');

        this._addAxis('x','x','bottom','percentage');
    }

    html() {

        if(this.group.element == null ) return;
        // this.group.element.style.minWidth = "600px";
        this.graphEl = super._html();

        this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight + "px" : graphHeight + "px";
        this.graphEl.classList.remove("graph-container-12")
        this.graphEl.classList.add("graph-container-6")
    }

    init() {

        super._init();

        if (this.graphEl != null) super._svg(this.graphEl);

        this.bell = new  elements.ChartBarBells(this);

        const xText = this.page.main.params.language == 'en' ? 'deviation from the sum' : 'afwijking in percentage van som';
        const yText = this.page.main.params.language == 'en' ? 'sum of payments' : 'som betalingen';

        this.arrowX = new elements.AxisArrow(this,'x', xText);
        this.arrowY = new elements.AxisArrow(this,'y', yText);

        this.update(this.group.data,this.segment, false);

    }


    prepareData(data: DataObject) : any {

        const myData = data.distributions[this.index];

        data.slice = [];

        for (const p of myData) {

            data.slice.push({
                type : p.type,
                label: p.lower, 
                value : p.count,
                colour: p.type == 'government' ? "orange" : "blue"
            })
        }

        return data
    }

    async draw(data: any) {
        await this.bell.draw(data.slice)
    }


    async redraw(data: any, range: number[]) {

        this.scales.x.set(data.slice.map( t=> t.label));
        this.yScale = this.scales.y.set(data.slice.map ( d => d.value));

        await super.redraw(data);
        await this.bell.redraw(data.slice)
        await this.arrowX.redraw();
        await this.arrowY.redraw();
    }

    
    async update(data: DataObject, segment: string, update: boolean, range?: number[]) {

        await super._update(data, segment, update, range);
    } 
}
