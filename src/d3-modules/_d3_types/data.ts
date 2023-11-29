
export interface ResponseData {
    features: any[];
}

export interface KeyValue {
    [key: string]: number | string;
 }

export interface DataPart {
    KeyValue?,
    _date?:  string,
    year : string,
}

// export interface GraphData {
//     slice: DataPart[],
//     history: DataPart[],
//     latest: DataPart,
//     flowData?: any[],
//     outflowData? : any[],
//     features?: any[],
//     grouped?: any[],
//     stacked?: ID3DataStackedSerie[]
//     average?: number
// }

// export interface D3DataTypeLatest extends DataPart { // extends mapping
//     label: string,
//     value: string,
//     colour?: string

// }

// export interface D3DataTypeHistorical extends DataPart {
//     colour? : string
    
// }

// export interface IKeyValueObject {
//     label: string,
//     KeyValue?
// }

// export interface ID3DataStackedItem {
//     '0': number,
//     '1': number,
//     data: IKeyValueObject
// }

// export interface ID3DataStackedSerie {
//     key: string,
//     index: number,
//     [key: number]: ID3DataStackedItem
// }

export type GeoData = any;

export type EitiReport = {
    origin: string,
    entity_name: string,
    sector: string,
    type: string,
    year: number,
    payments_companies_reported: number,
    payments_government_reported: number,
    payments_companies: number,
    payments_government: number,
    company_diff_percentage?: number,
    gov_diff_percentage?: number
}
export type EitiPayments = {
    payment_stream: string,
    code: string,
    name_nl: string,
    def_nl: string,
    name_en: string,
    def_en: string,
    year: number,
    payments_companies: number,
    origin: string,
    origin_name: string,
    origin_sector: string,
    recipient: string,
    recipient_name: string,
    aggregated: boolean,
    project?: string,
    geometry?: string
}

export type EitiEntity = {
    slug: string,
    name: string,
    type: string,
    sector: string,
    trade_name?: string,
    registration_ref?: string,
    parent_company?: string,
    parent_company_en?: string,
    registry_link?: string,
    registry_place?: string,
    registry_place_en?: string,
    legal_env?: string,
    member?: boolean

}




export type EitiCompanies = {
    [key: string] : EitiReport[]
}

export type EitiData = {
    
    reconciliation?: EitiReport[],  
    payments?: EitiPayments[],
    entities?: EitiEntity[],
    licences?: any[],
    economy?: any[],
    geodata?: GeoData
}

export type LinePoint = {
    time: string|number|Date,
    value: number,
    label: string,
    colour?: string
}

export type Line = LinePoint[]

export type Lines = Line[]

export type Bar = {
    label : string,
    value : number,
    value2?: number,
    colour: string,
    format? : string,
    type?: string,
    meta?: any,
    year?: number,
    y?: number,
    dy?: number
}

export type Bars = Bar[];

export type GroupedBars = {
    label: string,
    group: Bars
}

export type Circle = {
    label : string,
    value : number,
    colour: string,
}

export type Circles = Circle[];

export type Feature = any;

export type GraphData = (Lines|Bars|Feature[][])

export type Sankey = {

    nodes: SankeyNode[],
    links: SankeyLink[]
}

export type SankeyNode = {
    node: number,
    name: string,
    label?: string,
    type?: string
    
}

export type SankeyLink = {
    source: number,
    target: number,
    value: number,
    label?: string,
    amount?: number,
    type?: string,
    meta?: any
}

export type PlotItem = {
    label: string,
    time: string,
    value: string,
    radius: string,
    meta?: any
}

export type TableData = {

    headers: string[],
    rows: string[][]
}

export type IntData  = {
    graph: (Circle|Bar)[]|Sankey,
    graph_2?: (Circle|Bar)[]|Sankey,
    table: TableData
}

export type GeoJsonGeometry = {
    type: string,
    coordinates: number[]
}

export type GeoJsonFeature = {
    type: string | number,
    properties: { [key: string] : string|number }
    geometry: GeoJsonGeometry
}   

export type GeoJsonCollection = {
    name: string,
    type: string | number,
    features: GeoJsonFeature[]
}

export type Pie = {
    
}