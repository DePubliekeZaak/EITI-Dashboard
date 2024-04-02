import { DataObject, TableData, ImgData } from "./types";
import { Definitions } from "./types_graphs";

export interface IParameterMapping {

    label: string,
    label_en?: string,
    column: string,
    scale?: string,
    colour: string,
    group?: string,
    short?: string,
    outflow?: any,
    duration?: string,
    units? : string,
    format? : string,
    description? : string
}

export interface IGraphMappingV2 {

    slug: string,
    ctrlr: string
    multiples?: string,
    args?: string[],
    parameters: IParameterMapping[][]
}

export type IMappingOption = IParameterMapping | boolean;

export interface IGroupMappingV2 {

    slug: string,
    ctrlr: string
    header: string | null,
    header_en?: string | null,
    description: string | null,
    description_en?: string | null,
    endpoints: string[],
    segment: string,
    publishDate?: string,
    functionality?: string[],
    graphs : IGraphMappingV2[],
    splice?: boolean,
}

export interface GroupObject {

    slug: string,
    ctrlr: IGroupCtrlr,
    splice?: boolean,
    graphs: GraphCtrlr[],
    config: IGroupMappingV2,
    element: HTMLElement | undefined,
    data: any
}

export interface IGroupCtrlr {

    slug: string,
    page: any,
    segment: string,
    html: () => HTMLElement | undefined,
    prepareData: (data:any) => DataObject,
    populateTable: (tableData: TableData) => void,
    populateDefinitions: (definitions: Definitions) => void,
    populateDescription?: () => void,
    armTabs: () => void,
    update: (data: DataObject, segment: string, update: boolean) => void
    
}




export interface GraphCtrlr {
    
}

