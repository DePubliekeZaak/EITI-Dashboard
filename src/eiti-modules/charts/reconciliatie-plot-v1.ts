// import { AxesService, ChartDimensions, ChartObject, GraphControllerV2, ScaleService, SvgService } from '@local/d3_graphs';

// import { ChartBarReconciliation, ChartGrid, ChartScatterPlot, ZeroLine } from '@local/elements';
// import { DataPart, GraphData } from '@local/d3_types';
// import { IGraphMapping } from '@local/d3_types';
// import { breakpoints, colours } from '@local/styleguide';
// import { HTMLCompany } from '@local/elements';
// import { Bars, EitiCompanies, EitiData, EitiReport, PlotItem } from '@local/d3_types/data';
// import * as d3 from 'd3';

// const graphHeight = 400;

// export class ReconciliatiePlotV1 extends GraphControllerV2 {

//     plot;


//     constructor(
//         public main: any,
//         public data : any,
//         public element : HTMLElement,
//         public mapping: IGraphMapping,
//         public segment: string, 
//         public range : number[],
//         public index: number
//     ){
//         super(main,data,element,mapping,segment) 
//         this.pre();
//     }

//     pre() {

//         this._addMargin(40,0,0,0);
//         this._addPadding(0,30,0,0);



//         this._addScale('x','band','horizontal','year');
//         this._addScale('y','linear','vertical','percentage');

//      //   this._addAxis('x-top','x','top');
//    //  if (this.index === 0) {
//         this._addAxis('x','x','bottom');
//     // }
//         this._addAxis('y','y','left')
//     }

//     init() {

//         super._init();

//         // if(window.innerWidth < breakpoints.sm && this.mapping.args && this.mapping.args[0] === 'alternateTicks') {
//         //     this._addMargin(20,140,0,0);
//         // }

//         const svgId = "svg-wrapper-reports-" + this.data[0].origin;
//         const container = document.createElement('section');
//         container.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight + "px" : graphHeight + "px";
//         container.classList.add("graph-container-12")
//         container.id = svgId;
//         this.element.appendChild(container);

//         super._svg(container);

//         this.config.paddingInner = 0.25;
//         this.config.paddingOuter = 0.25;

//         this.plot = new ChartScatterPlot(this);

//         if(this.data[0][this.firstMapping['column']] != null && this.data[0][this.firstMapping['column']] != 0 ) {
//             this.update(this.data,this.segment, false);
//         }
//     }

//     // werkt alleen wanneer je er een pie chart in zet.
//     prepareData(data: EitiReport[]) : PlotItem[] {

//         // console.log(data);

//         const slice = [];

//         for (const report of data) {

//             // for (const year of reports)

//             slice.push({
//                 type : "overheid",
//                 time: report.year,
//                 value : report.gov_diff_percentage * 100,
//                 colour: "lightBlue",
//                 // format: "percentage"
//             })

//             slice.push({
//                 type : "bedrijf",
//                 label : report.year.toString(),
//                 value : report.company_diff_percentage * 100,
//                 colour: "orange",
//                 format: "percentage"
//             })

//         }

//         return slice
//     }

//     async draw(data: any) {

//         // await this.grid.draw(data)
//         await this.plot.draw(data);
//     }


//     async redraw(data: any, range: number[]) {

//         this.scales.x.set(data.map ( d => d.year));
//         this.yScale = this.scales.y.set(data.map ( d => d.percentage));

//         await super.redraw(data);

//         // redraw data
//         await this.plot.redraw(data);
     

//         // this.svg.body.selectAll("g.x-axis path")
//         //     .style("stroke", colours.gray[0])
//         //     .style("stroke-width",1)
//         //     .style("fill","transparent")

//         // this.svg.body.selectAll("g.y-axis g.tick line")
//         //     .style("display","none")

//         // this.svg.body.selectAll("g.x-axis line")
//         //     .style("stroke", colours.gray[0])

//         // this.svg.body.selectAll("g.y-axis text")
//         //     .style("font-size",".85rem")
//     }

    
//     async update(data: EitiData, segment: string, update: boolean) {
//        await super._update(data,segment,update);
//     } 
// }
