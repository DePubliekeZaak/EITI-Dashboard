export type GeoData = any;


export interface DataPart {
    KeyValue?,
    _date?:  string,
    year : string,
}

export type DataObject = {
    [key: string] : any[] 
}



export type TableData = {

    headers: string[],
    rows: string[][]
}

export type SelectorOption = {

    slug: string,
    label: string,
}

export type ImgDataItem = {

    [key: string] : string,
    _date : string,
    _gemeente : string,
    _week: string,
    _month: string,
    _year: string

}

export type ImgData = ImgDataItem[]
