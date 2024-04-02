// aparte instance of class per axis 
// scale slug meegeven + ctrlr 

// export type TCtrlrs = {
//     [key: string] : IGraphControllerV2
// }

export interface IScale {

    slug: string,
    type: string,
    direction: string,
    parameter?: string // is fit nodig? 
}

export interface IAxis {

    slug: string,
    scale: string,
    position: string,
    format?: string,
    extra?: string,
    label?: string,
    
}

export interface IGraphConfig {

    graphRatio?: number;
    graphHeight?: number,
    padding: {
        top : number,
        bottom : number,
        left : number,
        right : number
    },
    margin: {
        top : number,
        bottom : number,
        left : number,
        right : number
    },
    scales: IScale[],
    axes: IAxis[],
    paddingInner?: number,
    paddingOuter? : number,
    nodeWidth? : number,
    nodePadding? : number,
    extra? : any,
    companyWidth?: number,
    groupHeight?: number,
    barHeight?: number,
    minRadius?: number,
    radiusFactor?: number
    
}


export interface Dimensions {

    svgWidth: number,
    graphWidth: number,
    svgHeight: number,
    graphHeight: number
}


export interface IParameterMapping {

    label: string,
    column: string,
    scale?: string,
    colour?: string,
    group?: string,
    short?: string,
    outflow?: any,
    duration?: string,
    units? : string
    format? : string
}


export interface IGraphMapping {

    slug: string,
    graph: string
    args?: string[],
    parameters: IParameterMapping[][],
    header: string,
    header_en?: string
    linkLabel?: string,
    linkTopic?: string,
    description: string,
    description_en?: string,
    endpoint: string | boolean,
    segment: string | boolean,
    segmentIndicator?: boolean,
    multiGraph: boolean,
    elementClasslist: string[],
    publishDate?: string,
    functionality?: string[],
    children? : IGraphMapping[]
}

export type IMappingOption = IParameterMapping | boolean;

export interface KeyValue {
    [key: string]: number | string;
 }