import { GraphControllerV2  } from '@local/d3_graphs';

import { HtmlCardsV1, HtmlFunctionality, HtmlHeader, HTMLTable } from '@local/elements';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints } from '@local/styleguide';
import { EitiData } from '@local/d3_types';
import { EitiEntity, IntData } from '@local/d3_types/data';

const graphHeight = 480;

// can this be a wrapper for multiple graphcontrollers?
export  class UboCardsV1 extends GraphControllerV2  {

    cards;
    cards_2;
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

        this._addMargin(0,40,0,0);
        this._addPadding(0,0,0,0);

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

        for (const className of this.mapping.elementClasslist) { }
        container.classList.add("graph-container-12")
        container.classList.add("graph-view")
        container.style.flexDirection = "column";
        container.style.marginBottom = "3rem";
        
        this.element.appendChild(container);

        if (!this.mapping.multiGraph && this.mapping.functionality.indexOf('tableView') > -1) {
            this.table = new HTMLTable(this,this.element);
        }

        this.cards = new HtmlCardsV1(this,container);
        this.cards_2 = new HtmlCardsV1(this,container);
        // await super._svg(container);

        await this.update(this.data,this.segment, false);

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }
        return;
    }

    prepareData(data: EitiData): IntData {

        this.data = data;
        const circles = [];
        const dataGroup = this.mapping.endpoint.toString();
        const members_with_ubo = data[dataGroup].filter( (entity: EitiEntity) =>  entity.member && entity.trade_name !== null);
        const other_members = data[dataGroup].filter( (entity: EitiEntity) =>  entity.member && entity.trade_name == null);
        /// TABLE DATA 

        const rows = [];
      
        for (const m of members_with_ubo) {

            const row = [];

            for (const p of this.mapping.parameters[0]) { 
                row.push(m[p.column]);
            }

            rows.push(row);
        }

        const table = {

            headers:  this.mapping.parameters[0].map( p => p.label),
            rows
        };

        return {
            graph: members_with_ubo,
            graph_2: other_members,
            table
        }
    }

    async draw(data: any) {

        if (!this.mapping.multiGraph && this.mapping.functionality.indexOf('tableView') > -1) {
            this.table.draw(data.table);
        }
        this.cards.draw(data.graph);

        const extra_header = document.createElement("h3");
        extra_header.innerText = "Overige leden:"
        this.element.querySelector(".graph-view").appendChild(extra_header);
        
        this.cards.draw(data.graph_2);
        
    }


    async redraw(data: any, range: number[]) {
        await super.redraw(data.graph);
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {
       await super._update(data,segment,update, range);
    } 
}
