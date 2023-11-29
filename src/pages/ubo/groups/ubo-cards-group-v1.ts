import { breakpoints } from "@local/styleguide";
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { DataObject, EitiData, EitiEntity } from "../../shared/types";
import { TableData } from "../../shared/types_graphs";


const graphHeight = 480;

export  class UboCardsGroupV1 extends GroupControllerV1  {

    cards;
    cards_2;
    funcList;
    table;

    constructor(
        public page: any,
        public config: IGroupMappingV2,
    ){
       super(page,config);
    }

    html() {

        return super.html()
    }


    prepareData(data: EitiData): any {

        const circles = [];
        const dataGroup = this.config.endpoints[0].toString();
        const members_with_ubo = data[dataGroup].filter( (entity: EitiEntity) =>  entity.member && entity.trade_name !== null);
        const other_members = data[dataGroup].filter( (entity: EitiEntity) =>  entity.member && entity.trade_name == null);
        /// TABLE DATA 

        if (data[dataGroup] == undefined) return;

        const rows: string[][] = [];
      
        for (const m of members_with_ubo) {
            
            const row : string[] = [];

            for (const p of this.config.graphs[0].parameters[0]) { 
                row.push(m[p.column]);
            }

            rows.push(row);
        }

        const table = {

            headers:  this.config.graphs[0].parameters[0].map( p => this.page.main.params.language == "en" ? p.label_en : p.label),
            rows
        };

        return {
            graph: members_with_ubo,
            graph_2: other_members,
            table
        }
    }

    
    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    }

    update(data: DataObject, segment: string, update: boolean) {

        super.update(data,segment,update)
    } 
}
