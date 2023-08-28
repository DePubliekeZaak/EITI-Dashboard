import { AxesService, ChartDimensions, ChartObject, GraphControllerV2, IGraphControllerV2, ScaleService, SvgService } from '@local/d3_graphs';


import { IGraphMapping } from '@local/d3_types';
import { HtmlFunctionality, HtmlHeader, HTMLTable } from '@local/elements';
import { charts }  from '@local/charts';
import { EitiReport, EitiData } from '@local/d3_types';
import { IDashboardController } from '@local/dashboard';
import { filterUnique } from '@local/eiti-services';


export type IGraphGroupControllerV2 = {
    main: IDashboardController
    data: EitiData;
    segment: string;
    init: () => void;
    prepareData: (data: EitiData) => EitiData[];
    update: (data: EitiData, segment: string, update: boolean) => void
}

// can this be a wrapper for multiple graphcontrollers?
export class BetalingenTrendGroupV1 implements IGraphGroupControllerV2 { 

    firstLineGroup: any;
    secondLineGroup: any;
    thirdLineGroup: any;
    funcList: any;
    table;

    htmlHeader;
    yearSelector;

    constructor(
        public main: any,
        public data : EitiData,
        public element : HTMLElement,
        public mapping: IGraphMapping,
        public segment: string  
    ){}

    async init() {

        const self = this;

        if (this.mapping.header) {
            this.htmlHeader = new HtmlHeader(this.element, this.mapping.header,this.mapping.description);
            this.htmlHeader.draw(); 
        }

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList = new HtmlFunctionality(this,this.element,this.mapping,this.segment);
        }

        const data = this.prepareData(this.data);

        this.firstLineGroup = new charts.BetalingenTrendV1(this.main, data[0], this.element, this.mapping, null);
        this.secondLineGroup = new charts.BetalingenTrendV1(this.main, data[1], this.element, this.mapping,null);
        this.thirdLineGroup = new charts.BetalingenTrendV1(this.main, data[2], this.element, this.mapping,null);

        this.firstLineGroup.init();
        this.secondLineGroup.init();
        this.thirdLineGroup.init();

        this.table = new HTMLTable(this,this.element);

        await this.update(this.data,this.segment, false);

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

       // this.table.draw(data);
    }

    prepareData(data: EitiData) : EitiData[] {

        const groups: EitiData[] = [];
        const dataGroup = "reconciliation"

        const uniqueYears = filterUnique(data[dataGroup],"year");

        const reportsFromThisYear : EitiReport[] = data[dataGroup].filter( r => r.year === uniqueYears[0])

        reportsFromThisYear.sort( (a: EitiReport,b: EitiReport) : number => {
            return b["payments_companies"] - a["payments_companies"];
        });

        const firstFive = reportsFromThisYear.slice(0,3).map( r => r.origin);
        const secondFive = reportsFromThisYear.slice(3,11).map( r => r.origin);
        const theRest = reportsFromThisYear.slice(11).map( r => r.origin);

        // console.log(firstFive);
        // console.log(theRest);
        
        const firstGroup = data[dataGroup].filter (( r: EitiReport) => firstFive.indexOf(r.origin) > -1);
        const secondGroup = data[dataGroup].filter (( r: EitiReport) => secondFive.indexOf(r.origin) > -1);
        const thirdGroup = data[dataGroup].filter (( r: EitiReport) => theRest.indexOf(r.origin) > -1);

        return [ 
            {"reconciliation": firstGroup},
            {"reconciliation": secondGroup},
            {"reconciliation": thirdGroup}
        ];
    }

    
    async update(data: EitiData, segment: string, update: boolean) {

        this.segment = segment;

        const formattedData = this.prepareData(data);

        if(update) {
            await this.firstLineGroup.update(formattedData[0]);
            await this.secondLineGroup.update(formattedData[1]);
            await this.thirdLineGroup.update(formattedData[2]);
        }
    } 
}
