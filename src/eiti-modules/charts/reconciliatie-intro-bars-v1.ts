import { GraphControllerV2  } from '@local/d3_graphs';

import { ChartBarReconciliation, ChartBarReconIntroV1, ChartGrid, HTMLYear, ZeroLine } from '@local/elements';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints } from '@local/styleguide';
import { Bars, EitiData, EitiReport } from '@local/d3_types/data';
import { reconParameterList } from '@local/eiti-services';
import { slugify } from '@local/d3-services/_helpers';

const graphHeight = 300;


// can this be a wrapper for multiple graphcontrollers?
export  class ReconciliatieIntroBarsV1 extends GraphControllerV2 {

    chartAxis;
    chartBar;
    bars = {};



    zeroLine;

    grid;
    yScale;
    xScale;
    bottomAxis;
    leftAxis;

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

        this._addMargin(0,80,0,0);
        this._addPadding(0,30,10,120);
        this._addScale('x','linear','horizontal','value');
        // this._addScale('x2','linear','horizontal','value2');

        this._addScale('y','band','vertical','label');
        this._addAxis('x','x','bottom');
        // this._addAxis('x2','x','bottom');
    }

    init() {

        super._init();

        const svgId = "svg-wrapper-reports-intro-bars";
        const container = document.createElement('section');
        container.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight + "px" : graphHeight + "px";
        container.classList.add("graph-container-6")
        container.id = svgId;
        this.element.appendChild(container);

        super._svg(container);

        this.config.paddingInner = 0.125;
        this.config.paddingOuter = 0.125;

        const h = new HTMLYear(this,container,this.segment == "all" ? "Alle jaren" : this.segment);
        h.container.style.alignItems = 'flex-start';
        this.zeroLine = new ZeroLine(this,"zero", "black")
        this.chartBar = new ChartBarReconIntroV1(this);

        this.update(this.data,this.segment, false);
    }

    prepareData(data: EitiReport) : any {

        const slice: Bars = [];
        const keys = Object.keys(data).filter( k => ["origin","entity_name","sector","type","year"].indexOf(k) < 0);

        for (const key of keys.reverse()) {
            slice.push({
                type : key,
                label: this.mapping.parameters[0].find( m => m.column === key)['label'], 
                value : data[key],
                value2: 100,
                colour: key.indexOf("compan") > -1 ? "blue" : "orange"
            })
        }

        return {
            slice
        }
    }

    async draw(data: any) {

        await this.chartBar.draw(data);
        await this.zeroLine.draw(data);
    }


    async redraw(data: any, range: number[]) {

        this.scales.x.set(data.slice.map( t=> t.value).concat(0));
    //    this.scales.x2.set(data.slice.map( t=> t.value2).concat(0));
        this.yScale = this.scales.y.set(data.slice.map ( d => slugify(d.label)));

        await super.redraw(data);
        await this.zeroLine.redraw();
        // redraw data
        await this.chartBar.redraw(data);
    }

    
    async update(data: EitiData, segment: string, update: boolean) {
       await super._update(data,segment,update);
    } 
}
