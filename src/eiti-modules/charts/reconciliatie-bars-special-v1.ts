import { AxesService, ChartDimensions, ChartObject, GraphControllerV2, ScaleService, SvgService } from '@local/d3_graphs';

import { ChartBarReconciliation, ChartGrid, ZeroLine } from '@local/elements';
import { DataPart, GraphData } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints, colours } from '@local/styleguide';
import { HTMLCompany } from '@local/elements';
import { Bars, EitiCompanies, EitiData, EitiReport } from '@local/d3_types/data';
import * as d3 from 'd3';

const graphHeight = 300;
// const companyWidth = 160;
// const barHeight = 32;

// can this be a wrapper for multiple graphcontrollers?
export  class ReconciliatieBarsSpecialV1 extends GraphControllerV2 {

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

        this._addMargin(40,0,0,0);
        this._addPadding(0,30,10,10);



        this._addScale('x','linear','horizontal','value');
        this._addScale('y','band','vertical','label');

     //   this._addAxis('x-top','x','top');
   //  if (this.index === 0) {
        this._addAxis('x','x','top');
    // }
        this._addAxis('y','y','left')
    }

    init() {

        super._init();

        // if(window.innerWidth < breakpoints.sm && this.mapping.args && this.mapping.args[0] === 'alternateTicks') {
        //     this._addMargin(20,140,0,0);
        // }

        const svgId = "svg-wrapper-reports-" + this.data[0].origin;
        const container = document.createElement('section');
        container.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight + "px" : graphHeight + "px";
        container.classList.add("graph-container-12")
        container.id = svgId;
        this.element.appendChild(container);

        super._svg(container);

        this.config.paddingInner = 0.25;
        this.config.paddingOuter = 0.25;

        this.grid = new ChartGrid(this)
        this.zeroLine = new ZeroLine(this,"zero", "black")
        this.chartBar = new ChartBarReconciliation(this);

        if(this.data[0][this.firstMapping['column']] != null && this.data[0][this.firstMapping['column']] != 0 ) {
            this.update(this.data,this.segment, false);
        }
    }

    prepareData(data: EitiReport[]) : any {

        // console.log(data);

        const slice: Bars = [];

        for (const report of data) {

            // for (const year of reports)

            slice.push({
                type : "overheid",
                label: report.year.toString(),
                value : report.gov_diff_percentage * 100,
                colour: "lightBlue",
                format: "percentage"
            })

            slice.push({
                type : "bedrijf",
                label : report.year.toString(),
                value : report.company_diff_percentage * 100,
                colour: "orange",
                format: "percentage"
            })

        }

        return slice
    }

    async draw(data: any) {

        // await this.grid.draw(data)
        await this.chartBar.draw(data);
        await this.zeroLine.draw(data);
    }


    async redraw(data: any, range: number[]) {

     //   console.log(range || this.range);

        this.scales.x.set(this.range);
        this.yScale = this.scales.y.set(data.map ( d => d.label));

        
        await super.redraw(data);

        // await this.grid.redraw();
        await this.zeroLine.redraw();
        // redraw data
        await this.chartBar.redraw(data);

        // company + property

        //this.yScale = this.scales.y.set(data.slice.map ( d => d[this.parameters.y]));

        // super.redraw(data);
        // redraw data
        // for (let company of data.slice) {

        //     console.log(this.bars);

        //     this.bars[company['entity_slug']].redraw(data.slice.find( d => d['entity_slug'] == company['entity_slug']));
        // }

     

        // this.svg.body.selectAll("g.x-axis path")
        //     .style("stroke", colours.gray[0])
        //     .style("stroke-width",1)
        //     .style("fill","transparent")

        // this.svg.body.selectAll("g.y-axis g.tick line")
        //     .style("display","none")

        // this.svg.body.selectAll("g.x-axis line")
        //     .style("stroke", colours.gray[0])

        // this.svg.body.selectAll("g.y-axis text")
        //     .style("font-size",".85rem")
    }

    
    async update(data: EitiData, segment: string, update: boolean) {
       await super._update(data,segment,update);
    } 
}
