import { AxesService, ChartDimensions, ChartObject, GraphControllerV2, ScaleService, SvgService } from '@local/d3_graphs';

import { ChartBarReconciliation, ChartBarReconciliationV2, ChartBarReconciliationV3, ChartGrid, HtmlFunctionality, HtmlHeader, ZeroLine } from '@local/elements';
import { DataPart, GraphData } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints, colours } from '@local/styleguide';
import { HTMLCompany } from '@local/elements';
import { Bars, EitiCompanies, EitiData, EitiReport } from '@local/d3_types/data';
import * as d3 from 'd3';
import { formatReconData } from '@local/eiti-services';

// const graphHeight = 600;
// const companyWidth = 160;
// const barHeight = 32;

// can this be a wrapper for multiple graphcontrollers?
export class CompanyReconciliationV1 extends GraphControllerV2 {

    chartAxis;
    chartBar;
    bars = {};


    funcList;
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

        this._addMargin(20,0,0,0);
        this._addPadding(0,40,40,200);



        this._addScale('x','linear','horizontal','value');
        this._addScale('y','band','vertical-reverse','label');

     //   this._addAxis('x-top','x','top');
   //  if (this.index === 0) {
        this._addAxis('x','x','top','percentage');
    // }
        this._addAxis('y','y','left')
    }

    init() {

        super._init();

        if (!this.mapping.multiGraph && this.mapping.header) {
            this.htmlHeader = new HtmlHeader(this.element, this.mapping.header,this.mapping.description);
            this.htmlHeader.draw(); 
        }

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList = new HtmlFunctionality(this,this.element,this.mapping,this.segment);
        }

        const graphHeight = (this.data.length + 1) * 6
        
        const svgId = "svg-wrapper-company-reconciliation";
        const container = document.createElement('section');
        container.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight + "px" : graphHeight + "px";
        container.classList.add("graph-container-12")
        container.id = svgId;
        this.element.appendChild(container);

        super._svg(container);

        this.config.paddingInner = 0;
        this.config.paddingOuter = 0;

        // this.grid = new ChartGrid(this)
        this.zeroLine = new ZeroLine(this,"zero", "black")
        this.chartBar = new ChartBarReconciliationV2(this);

     //   if(this.data[0][this.firstMapping['column']] != null && this.data[0][this.firstMapping['column']] != 0 ) {
            this.update(this.data,this.segment, false);
     //   }
    }

    prepareData(data: EitiReport[]) : any {

        const dataGroup = 'reconciliation';

        data = data[dataGroup].filter( d => d.origin == this.main.params.company);

        data = formatReconData(data);



        const slice: Bars = [];

        const p1 = "discrepancy_company_relative";
        const p2 = "discrepancy_government_relative";
        const p3 = "outcome_absolute"
        const p4 = "outcome_relative"

        for (const report of data) {

            // for (const year of reports

            slice.push({
                type : "overheid",
                label: report.year.toString(),
                value : report[p2],
                value2: report[p4],
                colour: "blue",
                format: "percentage"
            })

            slice.push({
                type : "bedrijf",
                label : report.year.toString(),
                value : report[p1],
                value2: report[p4],
                colour: "orange",
                format: "percentage"
            })

        }
        // console.log(slice);

        return slice
    }

    // wat is nu belangrijk? dat iemand heeft bijbetaald .. of geld teruggekregen 
    // of dat er sprake was van een verschil tussen rapporten 
    // na verschil wele kant is de nacalculatie opgegaan? -- afwijking van het midden?

    async draw(data: any) {


        this.element.style.height = ((data.length + 1) * 36).toString() + 'px';

        // await this.grid.draw(data)
        await this.chartBar.draw(data);
        await this.zeroLine.draw(data);
    }


    async redraw(data: any, range: number[]) {

        // console.log(data);
        const values : number[] = data.map( (r) => {

            
           return  r.value2 - r.value
            
        });

        let min = d3.min(values) * 1
        const max = d3.max(values) * 1
        if (min > 0 ) { min = -5}
        this.scales.x.set([min,max]);
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
