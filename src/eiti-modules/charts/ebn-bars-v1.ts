import { GraphControllerV2  } from '@local/d3_graphs';

import { ChartBars, ChartBarsGrouped, HtmlFunctionality, HtmlHeader, HTMLTable } from '@local/elements';
import { TCtrlrs } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints, colourArray, colours } from '@local/styleguide';
import { EitiData  } from '@local/d3_types';
import { Bars, GroupedBars } from '@local/d3_types';
import { slugify } from '@local/d3-services';
import { filterUnique } from '@local/eiti-services';
import d3, { group } from 'd3';

const graphHeight = 1200;
const barHeight = 100;

// can this be a wrapper for multiple graphcontrollers?
export class EbnBarsV1 extends GraphControllerV2  {

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
        this._addPadding(30,40,70,100);

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

        this.uniqueCompanies = filterUnique(this.data['payments'],"company")

        const svgId = "svg-wrapper-ebn-" + slugify(this.data.payments[0].payment_stream);
        const container = document.createElement('section');
        container.style.height = (this.config.margin.top + this.config.margin.bottom + this.config.padding.bottom + this.config.padding.top + this.uniqueCompanies.length * barHeight).toString() + 'px'
        container.classList.add("graph-container-12")
        container.classList.add("graph-view")
        container.id = svgId;
        this.element.appendChild(container);

      //  this.table = new HTMLTable(this,this.element);

        super._svg(container);

        this.config.paddingInner = .3;
        this.config.paddingOuter =  .2;
        this.config.extra.barHeight = barHeight;
        
        this.chartBar = new ChartBarsGrouped(this);

        await this.update(this.data,this.segment, false);

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

        return;
    }

    prepareData(data: any) : any {

        // can be original eiti data 
        // or new graph data ..
        // so i need to modularize that funnction into service 
// 
   

        const dataGroup = "payments";

        this.data = data;

        const readyForBars: GroupedBars[] = [];
        const uniqueYears = filterUnique(this.data['payments'],"year")

        for (const mapping of this.mapping.parameters[0]) {

            const column = Array.isArray(mapping) ? mapping[0].column : mapping.column;

            for (let company of this.uniqueCompanies) {
 
                    const group: Bars = []

                    uniqueYears.forEach( (year,i) => {

                        const item = data[dataGroup].find( p => p.company == company && p.year == year);
                        
                        if (item != undefined) {

                            group.push({
                                label: year.toString(),
                                colour: colourArray[i][0],
                                value: item.value,
                                format: 'revenue'
                            }) 

                        }
                    });

                    readyForBars.push({
                        label: company,  
                        group 
                    })
            //    }
            }
        }

        // readyForBars.sort( (a: any,b: any) => {
        //     return a.value - b.value;
        // })  


        return {
            
          //  groupedbyCompany,
            readyForBars
        }
    }

    async draw(data: any) {
        this.chartBar.draw(data.readyForBars);
        // this.table.draw(data.groupedbyCompany);
    }


    async redraw(data: any, range: number[]) {

        let values = []

        for (const company of data.readyForBars) {

            for (const year of company.group) {
                values.push(year.value);
            }
        }

        values = values.filter( v => v < 2000)

        this.scales.x.set(values);
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
