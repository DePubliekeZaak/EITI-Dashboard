import { IGraphMapping, KeyValue } from "../../d3-modules/_d3_types";


export interface IParamService {

    renew() : void,
    isCompanyPage(): boolean
    // matchConfig(): IGraphMapping[]
    topic : string
    company: string
    language: string

}

export class ParamService implements IParamService {

    _params: KeyValue
    _topic: string;
    _company: string;
    _language: string = 'nl'
    _segment:  string
//    segment: string;

    constructor() {

    }

    renew() {

        this._params = this._getParams();

        const primKey = Object.keys(this._params)[0];
        let primValue = Object.values(this._params)[0];

        if (primValue === 'undefined' || 'language') {
            this._topic = 'payments'
            this._company == null;
            this._segment = '2022'
        }

        if (primKey === 'topic') {
            this._topic = primValue.toString();
            this._company == null;
            this._segment = '2022'
        }

        else if (primKey === 'company') {
            this._topic = 'company';
            this._company = Object.values(this._params)[0].toString();
            this._segment = '2022'
        }

        if(Object.keys(this._params).indexOf('language') > -1) {
            this._language = Object.values(this._params)[Object.keys(this._params).indexOf('language')].toString();
        }
    }

    get topic() {
        return this._topic;
    }

    get company() {
        return this._company;
    }

    get language() {
        return this._language;
    }

    set language(lan: string) {
        this._language = lan;
    }

    get segment() {
        return this._segment;
    }

    _getParams() : KeyValue {

        let params = {};
        const parser = document.createElement('a');
        parser.href = window.location.href;
        const query = parser.search.substring(1);
        const vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
    
        return params;
    }

    isCompanyPage() {
        return this._topic === 'company';
    }




}