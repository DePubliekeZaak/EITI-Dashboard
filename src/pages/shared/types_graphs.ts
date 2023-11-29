
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
    meta?: any
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