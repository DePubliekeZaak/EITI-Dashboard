import { AxesService, ChartDimensions, ChartObject, GraphControllerV2, IGraphControllerV2, ScaleService, SvgService } from '@local/d3_graphs';


import { IGraphMapping } from '@local/d3_types';
import { HtmlFunctionality, HtmlHeader, HTMLTable } from '@local/elements';
import { charts }  from '@local/charts';
import { EitiReport, EitiData } from '@local/d3_types';
import { IDashboardController } from '@local/dashboard';
import { filterUnique } from '@local/eiti-services';
import { EitiPayments } from '@local/d3_types/data';


export type IGraphGroupControllerV2 = {
    main: IDashboardController
    data: EitiData;
    segment: string;
    init: () => void;
    prepareData: (data: EitiData) => EitiData[];
    update: (data: EitiData, segment: string, update: boolean) => void
}

// can this be a wrapper for multiple graphcontrollers?
export class RevenueTrendGroupV1 implements IGraphGroupControllerV2 { 

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

        this.firstLineGroup = new charts.RevenueTrendV1(this.main, data[0], this.element, this.mapping, null);
        this.secondLineGroup = new charts.RevenueTrendV1(this.main, data[1], this.element, this.mapping,null);
//this.thirdLineGroup = new charts.BetalingenTrendV1(this.main, data[2], this.element, this.mapping,null);

        this.firstLineGroup.init();
        this.secondLineGroup.init();
        // this.thirdLineGroup.init();

        this.table = new HTMLTable(this,this.element);

        await this.update(this.data,this.segment, false);

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

       // this.table.draw(data);
    }

    prepareData(data: EitiData) : EitiData[] {

        const dataGroup = "government_revenues";
        const dataKey = "payment_stream"

        const groups: EitiData[] = [];

        const uniqueYears = filterUnique(data[dataGroup],"year");

        const reportsFromThisYear : EitiPayments[] = data[dataGroup].filter( r => r.year === uniqueYears[uniqueYears.length - 1])

        reportsFromThisYear.sort( (a: EitiPayments,b: EitiPayments) : number => {
            return b["payments_companies"] - a["payments_companies"];
        });

        const first = ['corporate_income_tax', 'profit_share',"dividends"]     // reportsFromThisYear.slice(0,2).map( r => r[dataKey]);

        const firstGroup = data[dataGroup].filter (( r: EitiPayments) => first.indexOf(r[dataKey]) > -1);
        const thirdGroup = data[dataGroup].filter (( r: EitiPayments) => first.indexOf(r[dataKey]) < 0);

        return [ 
            {"payments": firstGroup},
            {"payments": thirdGroup}
        ];
    }

    
    async update(data: EitiData, segment: string, update: boolean) {

        this.segment = segment;
        const formattedData = this.prepareData(data);

        console.log(formattedData)

        if(update) {
            await this.firstLineGroup.update(formattedData[0]);
            await this.secondLineGroup.update(formattedData[1]);
          //  await this.thirdLineGroup.update(formattedData[2]);
        }
    } 
}
