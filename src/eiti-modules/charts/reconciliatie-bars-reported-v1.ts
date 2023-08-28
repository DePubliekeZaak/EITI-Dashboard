import { AxesService, ChartDimensions, ChartObject, GraphControllerV2, IGraphControllerV2, ScaleService, SvgService } from '@local/d3_graphs';

import { ChartBars, ChartLine, ZeroLine } from '@local/elements';
import { DataPart, GraphData, TCtrlrs } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints, colours } from '@local/styleguide';
import { HTMLCompany } from '@local/elements';
import { EitiCompanies, EitiData, EitiReport } from '@local/d3_types/data';
import * as d3 from 'd3';

const groupHeight = 100;
const companyWidth = 160;
const barHeight = 32;



// can this be a wrapper for multiple graphcontrollers?
export  class ReconciliatieBarsReportedV1 extends GraphControllerV2  {

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

    constructor(
        public main: any,
        public data : EitiData,
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

        this._addMargin(0,0,0,0);
        this._addPadding(0,40,0,0);

        this._addScale('x','linear','horizontal','value');
        this._addScale('y','band','vertical','label');

     //   this._addAxis('x-top','x','top');
     if (this.index === 0) {
        this._addAxis('x','x','top');
     }
        this._addAxis('y','y','left')
    }

    init() {

        super._init();

        // if(window.innerWidth < breakpoints.sm && this.mapping.args && this.mapping.args[0] === 'alternateTicks') {
        //     this._addMargin(20,140,0,0);
        // }

        const svgId = "svg-wrapper-reconciliation-" + this.data[0].entity_slug;
        const container = document.createElement('section');
        container.style.height = (window.innerWidth < breakpoints.sm) ? "140px" : "140px";
        container.classList.add("graph-container-6")
        container.id = svgId;
        this.element.appendChild(container);

        super._svg(container);

        this.config.paddingInner = .25;
        this.config.paddingOuter = 0.25;

        this.chartBar = new ChartBars(this);
        this.finalRevenueLine = new ChartLine(this,"post_company_report","black");
        this.zeroLine = new ZeroLine(this,"zero", colours.gray[0])

        if(this.data[0][this.firstMapping['column']] != null && this.data[0][this.firstMapping['column']] != 0 ) {
            this.update(this.data,this.segment, false);
        }
    }

    prepareData(data: EitiReport[]) : any {

        const reportedBars = [];
        const finalLines = [];

        const report = data.find( (d: any) => d.year == parseInt(this.segment));

      //  let diff_values = []

        for (let mapping of [this.mapping.parameters[0][0],this.mapping.parameters[0][1]]) {

            let column = Array.isArray(mapping) ? mapping[0].column : mapping.column;

            reportedBars.push({
                    label: mapping.label,
                    colour: mapping.colour,
                    value: report == undefined ? 0 : report[column]
                }
            )
        }

        for (let mapping of [this.mapping.parameters[0][2],this.mapping.parameters[0][3]]) {

            let column = Array.isArray(mapping) ? mapping[0].column : mapping.column;

            finalLines.push({
                label: mapping.label,
                colour: mapping.colour,
                value: report == undefined ? 0 : report[column]
            })
        }

        // andere array maken voor lijn(en) 


        return {
            
            reportedBars,
            finalLines
        }
    }

    async draw(data: any) {

        
        await this.chartBar.draw(data.reportedBars);
        await this.finalRevenueLine.draw(data.finalLines);
        await this.zeroLine.draw(data.reportedBars);
    }


    async redraw(data: any, range: number[]) {


        this.scales.x.set(range || this.range);
        this.yScale = this.scales.y.set(data.reportedBars.map ( d => d.label));

        await super.redraw(data);
        // redraw data
        await this.chartBar.redraw(data.reportedBars);

        await this.finalRevenueLine.redraw();
        await this.zeroLine.redraw();

        this.svg.body.selectAll("g.y-axis path")
            .style("display","none")

        this.svg.body.selectAll("g.x-axis path")
            .style("stroke", colours.gray[0])
            .style("stroke-width",1)
            .style("fill","transparent")

        this.svg.body.selectAll("g.y-axis g.tick line")
            .style("display","none")

        this.svg.body.selectAll("g.x-axis line")
            .style("stroke", colours.gray[0])
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
