import { GraphControllerV2  } from '@local/d3_graphs';

import { AxisArrow, ChartBarBells  } from '@local/elements';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints } from '@local/styleguide';
import { Bars, EitiData } from '@local/d3_types/data';

const graphHeight = 345;


// can this be a wrapper for multiple graphcontrollers?
export  class ReconciliatieIntroBellsV1 extends GraphControllerV2 {

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
        public main: any,
        public data : any,
        public element : HTMLElement,
        public mapping: IGraphMapping,
        public segment: string, 
        public range : number[],
        public index: number
    ){
        super(main,data,element,mapping,segment) 
        this.pre();
    }

    pre() {

        this._addMargin(60,60,0,0);
        this._addPadding(0,0,10,60);

        this._addScale('y','linear','vertical','value');
        this._addScale('x','linear','horizontal','label');

        this._addAxis('x','x','bottom','percentage');
    }

    init() {

        super._init();

        const svgId = "svg-wrapper-reports-intro-bars";
        const container = document.createElement('section');
        container.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight + "px" : graphHeight + "px";
        container.classList.add("graph-container-6")
        container.style.marginBottom = '60px';
        container.id = svgId;
        this.element.appendChild(container);

        super._svg(container);

        // this.config.paddingInner = 0.125;
        // this.config.paddingOuter = 0.125;

        this.bell = new ChartBarBells(this);

        this.arrowX = new AxisArrow(this,'x','afwijking in percentage van som');
        this.arrowY = new AxisArrow(this,'y','som betalingen');

        if (this.data == undefined ) return;

        this.update(this.data,this.segment, false);

    }

    prepareData(data: any[]) : any {

     

        const slice: Bars = [];

            for (const p of data) {

                slice.push({
                    type : p.type,
                    label: p.lower, 
                    value : p.count,
                    colour: p.type == 'government' ? "orange" : "blue"
                })
        }

        return slice
    }

    async draw(data: any) {


        await this.bell.draw(data)
   
    }


    async redraw(data: any, range: number[]) {

     //   console.log(range || this.range);

        this.scales.x.set(data.map( t=> t.label));
        this.yScale = this.scales.y.set(data.map ( d => d.value));

        await super.redraw(data);
        await this.bell.redraw(data)
        await this.arrowX.redraw();
        await this.arrowY.redraw();
    }

    
    async update(data: EitiData, segment: string, update: boolean) {
       await super._update(data,segment,update);
    } 
}
