// aparte instance of class per axis 
// scale slug meegeven + ctrlr 

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
    width: number,
    svgHeight: number,
    height: number
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