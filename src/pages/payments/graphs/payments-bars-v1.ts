
import { GroupObject, IGraphMappingV2 } from "../../shared/interfaces";
import { IPageController } from "../../shared/page.controller";
import { core, elements } from "../../../charts/";
import { DataObject } from "../../shared/types";
import { colours } from "@local/styleguide";
import { HTMLSector } from "../../shared/html/html-sector";
import { HTMLSource } from "../../shared/html/html-source";

export class PaymentsBarsV1 extends core.GraphControllerV3 {
    
    chartBar: any;
    scrollingContainer;

    constructor(
        public slug:  string,
        public page: IPageController, 
        public group: GroupObject, 
        public mapping: IGraphMappingV2,
        public segment: string, 
        public index: number
        
        ) {
            super(slug,page,group,mapping,segment) 
            this.pre();
        }

    pre() {

        this._addMargin(45,20,0,0);
        this._addPadding(30,40,270,100);

        this._addScale('x','linear','horizontal','value');
        this._addScale('y','band','vertical','label');
    
        this._addAxis('x','x','top');
        this._addAxis('y','y','left')
    }

    html() {

        if(this.group.element == null ) return;

        this.graphEl = super._html();

        if(this.graphEl != null) {
            this.graphEl.style.overflowX= "auto";
            this.graphEl.style.marginBottom = "2rem";
        }

        this.scrollingContainer = document.createElement('section');
        this.scrollingContainer.classList.add("graph-container-12")
        this.scrollingContainer.classList.add("graph-view")
        this.scrollingContainer.style.height = "calc(100%)";
        this.scrollingContainer.style.minWidth = "800px";

        this.graphEl.appendChild(this.scrollingContainer);

        // this.graphEl.style.minWidth = "600px";

        // if (this.group.graphs.length - 1 == this.index) {
        //  let source = HTMLSource(this.graphEl.parentNode as HTMLElement,this.page.main.params.language,"NL-EITI");
        // }


    }
        
    async init() {

        this.config.paddingInner = .2;
        this.config.paddingOuter =  .2;
        this.config.extra.barHeight = 32;

        super._init();

        if (this.graphEl != null) await super._svg(this.scrollingContainer);

        const sector = this.page.main.params.language == 'en' ? this.group.data.multiples[this.index][0].sector_en : this.group.data.multiples[this.index][0].sector

        new HTMLSector(this.graphEl, sector);
        
        this.chartBar = new elements.ChartBars(this);

        await this.update(this.group.data,this.segment, false);

        return;

    }

    prepareData(data: DataObject) : DataObject {

        const myData = data.multiples[this.index];

        const uniqueCompanies: string[] = [];
        data.groupedbyCompany  = [];
        data.readyForBars= [];
   
        for (const report of myData) {
            const slug: string = report.origin;
            if (uniqueCompanies.indexOf(slug) < 0) {
                uniqueCompanies.push(slug); 
            }
        }

        for (let company of uniqueCompanies) {
            data.groupedbyCompany.push(myData.filter( report => report.origin == company));
        }

        const report = myData.find( (d: any) => d.year == parseInt(this.segment));

        for (const mapping of this.mapping[0]) {

            const column = Array.isArray(mapping) ? mapping[0].column : mapping.column;

            for (let company of uniqueCompanies) {

                const report = myData.find( report => report.origin == company && report.year == parseInt(this.segment));

                if (report !== undefined && report[column] !== 0) {

                    data.readyForBars.push({
                        label: report.entity_name,
                        colour: report[column] > 0 ? "orange" : "blue",
                        value: report[column],
                        format: 'revenue'
                    })
                }
            }
        }

        data.readyForBars.sort( (a: any,b: any) => {
            return a.value - b.value;
        })  



        return data;
    }

    async draw(data: DataObject) {

       
        this.chartBar.draw(data.readyForBars);
    }


    async redraw(data: DataObject, range: number[]) {

      
        this.scales.x.set(data.range);
        this.scales.y.set(data.readyForBars.map ( d => d.label));

        if (this.graphEl != null) this.graphEl.style.height = (this.config.margin.top + this.config.margin.bottom + this.config.padding.bottom + this.config.padding.top + data.readyForBars.length * this.config.extra.barHeight).toString() + 'px';

        await super.redraw(data);
      
        this.chartBar.redraw(data.readyForBars);

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


    async update(data: DataObject, segment: string, update: boolean, range?: number[]) {

        await super._update(data, segment, update, range);
     } 
       
}