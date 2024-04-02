import { HtmlFilters} from "./html/html-filters";
import { HtmlTabs } from "./html/html-tabs";
import { HtmlHeader } from "./html/html-header";
import { HTMLTable } from "./html/html-table";
import { HTMLDefinitions } from "./html/html-definitions";
// import { HTMLDescription } from "./html/html-description";
import { IGroupCtrlr, IGroupMappingV2 } from "./interfaces";
import { DataObject, ImgData, TableData } from "./types";
import { Definitions } from "./types_graphs";

export class GroupControllerV1 implements IGroupCtrlr {

    slug: string;
    element: HTMLElement | null;
    segment: string;

    htmlHeader;
    tabs;
    table;
    definitions;
    filter: any;
    description;

    constructor(
        public page: any,
        public config: IGroupMappingV2,
        public index: number,
    ){
        this.slug = config.slug;
        this.element = page.main.htmlContainer;
        this.segment = config.segment;

    }

    html(groupEl?: HTMLElement) {

        if (this.element == null) return;

        let groupWrapper: HTMLElement;

        if (groupEl == undefined) {

            groupWrapper = document.createElement('section');
            groupWrapper.classList.add('graph-container-12');
            groupWrapper.classList.add('group-wrapper');

            this.element.appendChild(groupWrapper);

        } else {

            groupWrapper = groupEl;
        }
  
        
        this.htmlHeader = new HtmlHeader(
            groupWrapper,  
            this.page.main.params.language == 'nl' ? this.config.header : this.config.header_en,
            this.page.main.params.language == 'nl' ? this.config.description : this.config.description_en,
        );

        this.htmlHeader.draw(); 

        if (this.config.functionality) {
            this.tabs = new HtmlTabs(this,groupWrapper,this.config,this.segment, this.index);
            this.tabs.draw();
        }

        // TAB PANELS

        const graphWrapper = document.createElement('section');
        graphWrapper.classList.add('graph-container-12');
        graphWrapper.classList.add('graph-wrapper');
        graphWrapper.classList.add("tabpanel");
        graphWrapper.role = "tabpanel";
        graphWrapper.id = "panel_" + this.slug + "__graph";
        graphWrapper.setAttribute("aria-labelledby","tab_" + this.slug + "__graph");
        graphWrapper.tabIndex = 0

        groupWrapper.appendChild(graphWrapper);

        if (this.config.functionality == undefined) return;

        if (this.config.functionality.length > 0) {   
            this.filter = new HtmlFilters(this, graphWrapper, this.config, "");
            this.filter.draw();
        }

        if (this.config.functionality && this.config.functionality.indexOf('table') > -1) {
            this.table = new HTMLTable(this,groupWrapper);
        }

        if (this.config.functionality && this.config.functionality.indexOf('definitions') > -1) {
            this.definitions = new HTMLDefinitions(this, groupWrapper);
        }

        // if (this.config.functionality && this.config.functionality.indexOf('description') > -1) {
        //     this.description = new HTMLDescription(this,groupWrapper);
        // }


        return graphWrapper;
    }

    prepareData(data: ImgData) : any {

        
        return data 
    }

    populateTable(tableData: TableData) {

        if (this.config.functionality && this.config.functionality.indexOf('table') > -1) {
            this.table.draw(tableData);
        }
   }

   populateDefinitions(definitionData: Definitions) {

        if (this.config.functionality && this.config.functionality.indexOf('definitions') > -1) {
            this.definitions.draw(definitionData);
        }
    }

    populateDescription() {

        if (this.config.functionality && this.config.functionality.indexOf('description') > -1) {
            this.description.draw();
        }
    }

    armTabs() {

        this.tabs.handleInitialState();
        this.tabs.arm();
    }

    armDownloads() {
        this.tabs.armDownload();
    }



    update(data: DataObject, segment: string, update: boolean) {

        this.segment = segment;
        const group = this.page.chartArray.find( (i) => i.config.slug === this.slug );

        group.data = this.prepareData(this.page.main.data.collection());

        this.tabs.redraw();

        for (const graph of group.graphs) {
            graph.ctrlr.update(group.data, segment, false)
        }

        this.populateTable(group.data.table);

        this.populateDefinitions(group.data.definitions);

    }  

}