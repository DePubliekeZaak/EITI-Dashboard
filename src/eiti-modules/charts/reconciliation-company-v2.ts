import { AxesService, ChartDimensions, ChartObject, GraphControllerV2, ScaleService, SvgService } from '@local/d3_graphs';

import { AxisArrow, ChartBarReconciliation, ChartBarReconciliationV2, ChartBarReconciliationV3, ChartGrid, HTMLTable, HtmlFunctionality, HtmlHeader, HtmlLegend, HtmlLegendColumn, ZeroLine } from '@local/elements';
import { DataPart, GraphData } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints, colours } from '@local/styleguide';
import { HTMLCompany } from '@local/elements';
import { Bars, EitiCompanies, EitiData, EitiReport } from '@local/d3_types/data';
// import * as d3 from 'd3';
import { formatReconData } from '@local/eiti-services';
import { convertToCurrencyInTable } from '@local/d3-services/_helpers';

// const graphHeight = 600;
// const companyWidth = 160;
// const barHeight = 32;

// can this be a wrapper for multiple graphcontrollers?
export class ReconciliationCompanyV2 extends GraphControllerV2 {

    chartAxis;
    chartBar;
    bars = {};


    funcList;
    zeroLine;
    table;

    grid;
    yScale;
    xScale;
    bottomAxis;
    leftAxis;
    arrowX;

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

        this._addMargin(20,140,0,0);

        const rightSpace = window.innerWidth < breakpoints.xsm ? 0 : 200;
        this._addPadding(0,40,40,rightSpace);

        this._addScale('x','linear','horizontal','value');
        this._addScale('y','band','vertical','label');

        this._addAxis('x','x','bottom','percentage');
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

        const graphHeight = 140 + (36 + 30) * 6
        
        const svgId = "svg-wrapper-company-reconciliation";
        const container = document.createElement('section');
        container.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight + "px" : graphHeight + "px";
        container.style.flexDirection = "column";
        container.classList.add("graph-container-12");
        container.classList.add("graph-view");
        container.id = svgId;
        this.element.appendChild(container);

        super._svg(container);

        this.config.paddingInner = 0.2;
        this.config.paddingOuter = 0;

        // this.grid = new ChartGrid(this)
        this.zeroLine = new ZeroLine(this,"zero", "black")
        this.chartBar = new ChartBarReconciliationV2(this);

        const legend = new HtmlLegendColumn(this)

        this.arrowX = new AxisArrow(this,'x','betaalstroom  na reconciliatie valt hoger uit');
       // this.arrowY = new AxisArrow(this,'y','som betalingen');

        this.update(this.data,this.segment, false);

        if (this.mapping.functionality.indexOf('tableView') > -1) {
            this.table = new HTMLTable(this,this.element.parentNode);
        }

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

     
     
    }

    prepareData(data: EitiReport[]) : any {

        const dataGroup = 'reconciliation';

        data = data[dataGroup].filter( d => d.origin == this.segment);

        console.log(data);

        data = formatReconData(data);

        const slice: Bars = [];

        const p1 = "discrepancy_company_relative";
        const p2 = "discrepancy_government_relative";
        const p3 = "outcome_absolute"
        const p4 = "outcome_relative"

        for (const report of data) {

            slice.push({
                type : "overheid",
                label: report.year.toString(),
                value : report[p2],
                value2: report[p4],
                colour: "blue",
                format: "percentage",
                meta: report
            })

            slice.push({
                type : "bedrijf",
                label : report.year.toString(),
                value : report[p1],
                value2: report[p4],
                colour: "orange",
                format: "percentage",
                meta: report
            })

        }

        // table

        const rows = [];

        for (let c of data) {

            rows.push([
                c.entity_name, 
                c.year, 
                (c.payments_companies_reported) + "M", 
                (c.payments_government_reported) + "M", 
                (c.payments_companies) + "M", 
                (c.payments_government) + "M"
            ])
        }

        const table = {

            headers:  ["Bedrijf","Jaar","Rapportage bedrijf","Rapportage overheid","Uitkomst bedrijf","Uitkomst overheid"],
            rows
        };

        console.log(table);

        return {
            
            slice,
            table

        }
    }

    // wat is nu belangrijk? dat iemand heeft bijbetaald .. of geld teruggekregen 
    // of dat er sprake was van een verschil tussen rapporten 
    // na verschil wele kant is de nacalculatie opgegaan? -- afwijking van het midden?

    async draw(data: any) {


        this.element.style.height = ((data.length + 1) * 36).toString() + 'px';

        // await this.grid.draw(data)
        await this.chartBar.draw(data.slice);
        await this.zeroLine.draw(data);

        if (this.mapping.functionality.indexOf('tableView') > -1) {
            this.table.draw(data.table);
        }
    }


    async redraw(data: any, range: number[]) {

        const values : number[] = data.slice.map( (r) => {
           return  r.value2 - r.value
        });

        let min = window.d3.min(values) * 1
        const max = window.d3.max(values) * 1
        if (min > 0 ) { min = -5}
        this.scales.x.set([min,max]);
        this.yScale = this.scales.y.set(data.slice.map ( d => d.label));

        await super.redraw(data.slice);

        // await this.grid.redraw();
        await this.zeroLine.redraw();
        // redraw data
        await this.chartBar.redraw(data.slice);

        this.arrowX.redraw();

    }

    
    async update(data: EitiData, segment: string, update: boolean) {



       await super._update(data, segment, update);
    } 
}
