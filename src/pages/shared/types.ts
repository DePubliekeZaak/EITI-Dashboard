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
    registry_link?: string,
    registry_place?: string,
    legal_env?: string,
    member?: boolean

}

export type EitiCompanies = {
    [key: string] : EitiReport[]
}

export type DataObject = {
    [key: string] : any[] 
}


export type EitiData = {
    
    reconciliation?: EitiReport[],  
    payments?: EitiPayments[],
    entities?: EitiEntity[],
    licences?: any[],
    economy?: any[],
    geodata?: GeoData,
    definitions?: any[]
}

export type TableData = {

    headers: string[],
    rows: string[][]
}

export type SelectorOption = {

    slug: string,
    label: string,
}

