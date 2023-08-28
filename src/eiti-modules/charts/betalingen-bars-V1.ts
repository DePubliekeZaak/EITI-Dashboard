import { GraphControllerV2  } from '@local/d3_graphs';

import { ChartBars, HtmlFunctionality, HtmlHeader, HTMLTable } from '@local/elements';
import { TCtrlrs } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints, colours } from '@local/styleguide';
import { EitiData  } from '@local/d3_types';
import { Bars } from '@local/d3_types';
import { slugify } from '@local/d3-services';
import { filterUnique } from '@local/eiti-services';

const graphHeight = 600;
const barHeight = 32;

// can this be a wrapper for multiple graphcontrollers?
export  class BetalingenBarsV1 extends GraphControllerV2  {

    uniqueCompanies;
    chartAxis;
    chartBar;
    finalRevenueLine;
    zeroLine;
    table;
    funcList;

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

        this._addMargin(10,20,0,0);
        this._addPadding(30,40,270,100);

        this._addScale('x','linear','horizontal','value');
        this._addScale('y','band','vertical','label');
    
        this._addAxis('x','x','top');
        this._addAxis('y','y','left')
    }

    async init() {

        const self = this;

        await super._init();

        if (!this.mapping.multiGraph && this.mapping.header) {
            this.htmlHeader = new HtmlHeader(this.element, this.mapping.header,this.mapping.description);
            this.htmlHeader.draw(); 
        }

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList = new HtmlFunctionality(this,this.element,this.mapping,this.segment);
        }

        this.element.classList.remove("graph-container");
        this.element.classList.add("graph-wrapper");

        this.uniqueCompanies = filterUnique(this.data['reconciliation'],"origin")

        const svgId = "svg-wrapper-reconciliation-" + slugify(this.data.reconciliation[0].sector);
        const container = document.createElement('section');
        container.style.height = (this.config.margin.top + this.config.margin.bottom + this.config.padding.bottom + this.config.padding.top + this.uniqueCompanies.length * barHeight).toString() + 'px'
        container.classList.add("graph-container-12")
        container.classList.add("graph-view")
        container.id = svgId;
        this.element.appendChild(container);

      //  this.table = new HTMLTable(this,this.element);

        super._svg(container);

        this.config.paddingInner = .2;
        this.config.paddingOuter =  .2;
        this.config.extra.barHeight = barHeight;
        
        this.chartBar = new ChartBars(this);

       


        await this.update(this.data,this.segment, false);

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

        return;
    }

    prepareData(data: EitiData) : any {

        // can be original eiti data 
        // or new graph data ..
        // so i need to modularize that funnction into service 

        const dataGroup = "reconciliation";

        this.data = data;

        // console.log(data);

        const uniqueCompanies = [];
        const groupedbyCompany = [];
        const readyForBars: Bars = [];

        for (const report of data[dataGroup]) {
            const slug = report.origin;
            if (uniqueCompanies.indexOf(slug) < 0) {
                uniqueCompanies.push(slug); 
            }
        }

        for (let company of uniqueCompanies) {

            groupedbyCompany.push(data[dataGroup].filter( report => report.origin == company));

            // wat te doen met lege jaren? 
        }

    

        // bovenstaande toch naar start tillen? 
        // want anders steeds weer doen .. bij selecteren jaar


        const report = data[dataGroup].find( (d: any) => d.year == parseInt(this.segment));

        for (const mapping of this.mapping.parameters[0]) {

            const column = Array.isArray(mapping) ? mapping[0].column : mapping.column;

            for (let company of uniqueCompanies) {

                const report = data[dataGroup].find( report => report.origin == company && report.year == parseInt(this.segment));

                if (report !== undefined && report[column] !== 0) {

                    readyForBars.push({
                        label: report.entity_name,
                        colour: report[column] > 0 ? "orange" : "blue",
                        value: report[column],
                        format: 'revenue'
                    })
                }
            }
        }

        readyForBars.sort( (a: any,b: any) => {
            return a.value - b.value;
        })  


        return {
            
            groupedbyCompany,
            readyForBars
        }
    }

    async draw(data: any) {

        
        
        this.chartBar.draw(data.readyForBars);
        //this.finalRevenueLine.draw(data.finalLines);
        // this.zeroLine.draw(data.readyForBars);

        // this.table.draw(data.groupedbyCompany);
    }


    async redraw(data: any, range: number[]) {


        this.scales.x.set(this.range);
        this.scales.y.set(data.readyForBars.map ( d => d.label));

        await super.redraw(data);
        // redraw data
        this.chartBar.redraw(data.readyForBars);

        // this.finalRevenueLine.redraw();
        // this.zeroLine.redraw();

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

        this.svg.body.selectAll("g.y-axis text")
            .style("font-size",".85rem")
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
