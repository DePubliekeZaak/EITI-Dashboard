import { EitiData } from "@local/d3_types";
import { DataObject, TableData } from "./types";

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
    units? : string
    format? : string
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
    element: HTMLElement | null,
    data: any
}

export interface IGroupCtrlr {

    page: any,
    segment: string,
    html: () => HTMLElement | undefined,
    prepareData: (data:EitiData) => DataObject,
    populateTable: (tableData: TableData) => void
    update: (data: DataObject, segment: string, update: boolean) => void
    
}




export interface GraphCtrlr {
    
}

