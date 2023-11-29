import { breakpoints } from "@local/styleguide";
import { GraphControllerV3 } from "../../../charts/core/graph-v3";
import { GroupObject, IGraphMappingV2 } from "../../shared/interfaces";
import { IPageController } from "../../shared/page.controller";
import { DataObject, EitiData } from "../../shared/types";
import { HtmlCardsV1 } from "../../shared/html/html-cards";


const graphHeight = 480;

export  class UboCardsV1 extends GraphControllerV3  {

    cards;
    cards_2;
    funcList;
    table;

    constructor(
        public slug:  string,
        public page: IPageController, 
        public group: GroupObject, 
        public mapping: IGraphMappingV2,
        public segment: string, 
        public index: number
    ){
        super(slug,page,group,mapping,segment) 
        this.pre();
    }


    pre() {

        this._addMargin(0,40,0,0);
        this._addPadding(0,0,0,0);

    }

    html() {

        const graphHeight = 300;

        if(this.group.element == null ) return;
        this.group.element.style.minWidth = "600px";
        this.graphEl = super._html();
        this.graphEl.style.marginBottom = "3rem";
        this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight + "px" : graphHeight + "px";
 
        const header = document.createElement("h3");
        header.style.marginBottom = "1rem";

        if (this.graphEl != null) this.graphEl.appendChild(header);

     
    }


    async init() {

        const self = this;

        await super._init();

    //    if (this.graphEl != null) super._svg(this.graphEl);

        this.cards = new HtmlCardsV1(this, this.graphEl);
        this.cards_2 = new HtmlCardsV1(this, this.graphEl);


        this.update(this.group.data,this.segment, false);
        return;
    }

    prepareData(data: DataObject): any {

        return data;
    }

    async draw(data: any) {
        this.cards.draw(data.graph);

        const extra_header = document.createElement("h3");
        extra_header.innerText = this.page.main.params.language == 'en' ? "Other members:" : "Overige leden:"

        if (this.element != null) {
            const el = this.element.querySelector(".graph-view")
            if (el!= null) el.appendChild(extra_header);
        }
        
        
        this.cards.draw(data.graph_2);
        
    }


    async redraw(data: any, range: number[]) {
        await super.redraw(data.graph);
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {
       await super._update(data,segment,update, range);
    } 
}
