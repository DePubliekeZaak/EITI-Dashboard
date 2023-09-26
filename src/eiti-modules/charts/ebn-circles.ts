import { GraphControllerV2  } from '@local/d3_graphs';

import { ChartCircleGroupsV1, HtmlFunctionality, HtmlHeader, HtmlLegend, HTMLTable } from '@local/elements';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints, colours } from '@local/styleguide';
import { EitiData, EitiPayments } from '@local/d3_types';
import { BallenbakSimulation, filterUnique } from '@local/eiti-services';
import { EitiEntity, IntData } from '@local/d3_types/data';
import { convertToCurrencyInTable } from '@local/d3-services/_helpers';

const graphHeight = 480;

// can this be a wrapper for multiple graphcontrollers?
export  class EbnCirclesV1 extends GraphControllerV2  {


    circleGroups;
    simulation = {};

    funcList;
    table;

    // do top 5 and then rest 

    constructor(
        public ctrlr: any,
        public data : EitiData,
        public element : HTMLElement,
        public mapping: IGraphMapping,
        public segment: string, 
    ){
        super(ctrlr,data,element,mapping,segment) 
        this.pre();
    }

    pre() {

        this._addMargin(60,40,0,0);
        this._addPadding(0,0,0,0);

        this._addScale('x','band','horizontal','value');
        this._addScale('y','band','vertical-reverse','value');
        this._addScale('r','linear','radius','value');
    }

    async init() {


        const self = this;

        

        await super._init();

        if (!this.mapping.multiGraph) {
            this.htmlHeader = new HtmlHeader(this.element, this.mapping.header,this.mapping.description);
            this.htmlHeader.draw(); 
        }

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList = new HtmlFunctionality(this,this.element,this.mapping,this.segment);
        }

        const container = document.createElement('section');
        container.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight.toString() + "px" : graphHeight.toString() + "px";
        container.style.flexDirection = 'column';

        for (const className of this.mapping.elementClasslist) { }
        container.classList.add("graph-container-12")
        container.classList.add("graph-view")
        
        this.element.appendChild(container);

        if (!this.mapping.multiGraph && this.mapping.functionality.indexOf('tableView') > -1) {
            this.table = new HTMLTable(this,this.element);
        }

        await super._svg(container);

        this.config.minRadius = 20;
        this.config.radiusFactor = this.ctrlr.params.isCompanyPage() ? .6 : .6;
        this.config.paddingInner = .4;
        this.config.paddingOuter = .2;

        this.circleGroups = new ChartCircleGroupsV1(this);

        await this.update(this.data,this.segment, false);

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

        const legend = new HtmlLegend(this)


        return;
    }

    prepareData(data: EitiData): IntData {

        // this.data = data;
        const dataGroup = "payments";
        const filteredData = data[dataGroup].filter( (stream: EitiPayments) => ["sales","costs"].indexOf(stream.payment_stream) > -1  && (stream.origin === this.segment || stream.recipient == this.segment)) ;
        const uniqueYears = filterUnique(data[dataGroup],"year");
        uniqueYears.sort( (a:any,b: any) => parseInt(a) - parseInt(b));

        const years = [];

        for (const uyear of uniqueYears) {

            const yearData = filteredData.filter( p => p.year == uyear)
            const group = [];

            const salesReport = yearData.find( p => p.payment_stream == 'sales');
            const costsReport = yearData.find( p => p.payment_stream == 'costs');

            const sales = salesReport != undefined ? 1000 * 1000 * salesReport["payments_companies"] : 0;
            const costs = costsReport != undefined ? 1000 * 1000 * costsReport["payments_companies"] : 0;

            group.push({
                label: "sales",
                colour: colours["blue"],
                value: sales,
                format: "revenue"
            })

            group.push({
                label: "costs",
                colour: colours["orange"],
                value: costs,
                format: "revenue"
            })

            group.push({
                label: "netto",
                colour: colours["green"],
                value: sales - costs,
                format: "revenue"
            })

            years.push({
                label: uyear.toString(),
                group
            })
        }

    

        /// TABLE DATA 

        const rows = [];

        for (const entity of data.entities.filter( (e) => e.type === 'company' && e.slug != 'ebn').sort( (a: EitiEntity, b: EitiEntity) =>  a.name.localeCompare(b.name)) ) {

            
            const companyData = data[dataGroup].filter( (stream: EitiPayments) => ["sales","costs"].indexOf(stream.payment_stream) > -1  && (stream.origin === entity.slug|| stream.recipient == entity.slug)) ;

            if (companyData.length > 0) {


                for (const ustream of ['costs','sales']) {

                    const row = [];


                    row.push(entity.name);

                    const report = companyData.find( (s) => s.payment_stream === ustream);

                    if (report != undefined) {
                        row.push(report.name_nl);
                    }
                

                    for (const year of uniqueYears) { 

                        const item = companyData.find( (s) => s.payment_stream === ustream && s.year == year);
                        row.push(item != undefined ?  convertToCurrencyInTable(item.payments_companies * 1000 * 1000) : "-")
                    }

                    rows.push(row);
                }

            }

        }

        const table = {

            headers:  ["Bedrijf","Betaalstroom"].concat(uniqueYears.map( (y) => y.toString())),
            rows
        };

        console.log(years);


        return {
            graph: years,
            table
        }
    }

    async draw(data: any) {

        let values = [0];
        for (const year of data.graph) {
            values = values.concat(year.group.map(p => p.value))
        }

        this.scales.x.set(data.graph.map( (d) => d['label']));
        this.scales.y.set(data.graph.map( (d) => d['label']));
        this.scales.r.set(values.filter( v => v >= 0)); // = radius !!
        
        this.circleGroups.draw(data.graph);
        //

        for (let year of data.graph) {

            this.simulation[year.label] = new BallenbakSimulation(this);
            this.simulation[year.label].supply(year.group.filter( g => g.label != 'netto'), "circleGroups", null)
        }
        
        if (!this.mapping.multiGraph && this.mapping.functionality.indexOf('tableView') > -1) {
            this.table.draw(data.table);
        }
    }


    async redraw(data: any, range: number[]) {
     

        await super.redraw(data.graph);
        // redraw data
        this.circleGroups.redraw(this.dimensions);

        data.graph.forEach( (group,i) => {
            this.simulation[group.label].redraw(data.graph.length)
        });
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
