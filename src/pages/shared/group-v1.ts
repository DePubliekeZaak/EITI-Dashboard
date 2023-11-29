import { HtmlFunctionality } from "./html/html-functionality";
import { HtmlHeader } from "./html/html-header";
import { HTMLTable } from "./html/html-table";
import { IGroupCtrlr, IGroupMappingV2 } from "./interfaces";
import { DataObject, EitiData, TableData } from "./types";

export class GroupControllerV1 implements IGroupCtrlr {

    slug: string;
    element: HTMLElement | null;
    segment: string;

    htmlHeader;
    funcList;
    table;

    constructor(
        public page: any,
        public config: IGroupMappingV2,
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

        if (this.config.functionality && this.config.functionality.length > 0) {
            this.funcList = new HtmlFunctionality(this,groupWrapper,this.config,this.segment);
            this.funcList.draw();
        }

        const graphWrapper = document.createElement('section');
        graphWrapper.classList.add('graph-container-12');
        graphWrapper.classList.add('graph-wrapper');

        groupWrapper.appendChild(graphWrapper);

        if (this.config.functionality && this.config.functionality.indexOf('tableView') > -1) {
            this.table = new HTMLTable(this,groupWrapper);
        }

        return graphWrapper;
    }

    prepareData(data: EitiData) : DataObject {

        
        return data 
    }

    populateTable(tableData: TableData) {

        if (this.config.functionality && this.config.functionality.indexOf('tableView') > -1) {
            this.table.draw(tableData);
        }
   }


    update(data: DataObject, segment: string, update: boolean) {

        this.segment = segment;
        const group = this.page.chartArray.find( (i) => i.config.slug === this.slug );

        group.data = this.prepareData(this.page.main.data.collection());

        this.funcList.redraw();

        for (const graph of group.graphs) {
            graph.ctrlr.update(group.data, segment, false)
        }

        this.populateTable(group.data.table);
    }  

}