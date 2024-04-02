import { breakpoints } from "@local/styleguide";
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { DataObject, EitiData, EitiEntity } from "../../shared/types";
import { TableData } from "../../shared/types_graphs";


const graphHeight = 480;

export  class FourOFourGroupV1 extends GroupControllerV1  {

    cards;
    cards_2;
    funcList;
    table;

    constructor(
        public page: any,
        public config: IGroupMappingV2,
        public index: number
    ){
        super(page,config,index);
    }

    html() {

        console.log('hallo');

        return super.html()

        
    }


    prepareData(data: EitiData): any {

        return {};
    }

    
    populateTable(tableData: TableData) {

        // super.populateTable(tableData);
    }

    update(data: DataObject, segment: string, update: boolean) {

        super.update(data,segment,update)
    } 
}
