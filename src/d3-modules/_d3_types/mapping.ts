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
    linkLabel?: string,
    linkTopic?: string,
    description: string,
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
