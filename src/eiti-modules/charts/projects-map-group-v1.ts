import { AxesService, ChartDimensions, ChartObject, GraphControllerV2, IGraphControllerV2, ScaleService, SvgService } from '@local/d3_graphs';


import { EitiPayments, IGraphMapping } from '@local/d3_types';
import { HtmlFunctionality, HtmlHeader, HTMLTable } from '@local/elements';
import { charts }  from '@local/charts';
import { EitiReport, EitiData } from '@local/d3_types';
import { IDashboardController } from '@local/dashboard';
import { filterUnique } from '@local/eiti-services';
import { convertToCurrencyInTable } from '@local/d3-services/_helpers';


export type IGraphGroupControllerV2 = {
    main: IDashboardController
    data: EitiData;
    segment: string;
    init: () => void;
    prepareData: (data: EitiData) => EitiData[];
    update: (data: EitiData, segment: string, update: boolean) => void
}

// can this be a wrapper for multiple graphcontrollers?
export class ProjectsMapGroupV1 implements IGraphGroupControllerV2 { 

    royalties: any;
    surfaceRental: any;
    retributions: any;
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

        const wrapper = document.createElement('section');
        wrapper.classList.add('graph-container-12');
        wrapper.classList.add('graph-wrapper');
        this.element.appendChild(wrapper);

        const data = this.prepareData(this.data);

        if (this.mapping.functionality.indexOf('tableView') > -1) {
            this.table = new HTMLTable(this,this.element);
            this.table.draw(data.table);
        }

        this.royalties = new charts.ProjectMapV1(this.main, data.graphs[0], wrapper, this.mapping, 'royalties');
        this.surfaceRental = new charts.ProjectMapV1(this.main, data.graphs[1], wrapper, this.mapping, 'surface_rental');
        this.retributions = new charts.ProjectMapV1(this.main, data.graphs[2], wrapper, this.mapping, 'retributions');

        this.royalties.init();
        this.surfaceRental.init();
        this.retributions.init();

        // this.table = new HTMLTable(this,this.element);

        await this.update(this.data,this.segment, false);

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

       // this.table.draw(data);
    }

    prepareData(data: EitiData) : any {

        const groups: EitiData[] = [];
        const dataGroup = "payments"

        const uniqueYears = filterUnique(data[dataGroup],"year");

        uniqueYears.sort( (a:number, b: number) => b - a);

        const paymentsFromThisYear : EitiPayments[] = data[dataGroup].filter( r => r.year === uniqueYears[0])
        paymentsFromThisYear.sort( (a: EitiPayments,b: EitiPayments) : number => {
            return b["payments_companies"] - a["payments_companies"];
        });


        // FOR TABLE

       const rows = [];
       const filteredData = this.data[dataGroup]
        .filter( p => !p["aggregated"] 
                && p.year == parseInt(this.segment)
                && p.geometry != null
        );

       let rowData = this.data[dataGroup]

       const columnArray = filterUnique(this.data[dataGroup],"year");
       const rowArray = filterUnique(filteredData,"project");
   //    rowArray.sort( (a: string, b: string) => a.localeCompare(b))
       const rowName = "entity_name";
       const rowSlug = "origin";
       const columnName = "year";
       const columnSlug = "year";
       const valueKey = "payments_companies"


        // unique project

       for (const r of rowArray) {

            const item = filteredData.find( p => p.project == r );

            const royalties = filteredData.find( p => p.project == r && p.payment_stream === 'royalties');
            const surface_rental = filteredData.find( p => p.project == r && p.payment_stream === 'surface_rental');
            const retributions = filteredData.find( p => p.project == r && p.payment_stream === 'retributions');

            const row = [];
            row.push(item.origin_name);
            row.push(r);
            row.push(royalties != undefined ? royalties['payments_companies'] : "-");
            row.push(surface_rental != undefined ? surface_rental['payments_companies'] : "-");
            row.push(retributions != undefined ? retributions['payments_companies'] : "-");


        //     row.push(data[dataGroup].find( (s) => s[rowSlug] === r)[rowName]);
        //  //   row.push(data[dataGroup].find( (s) => s[rowSlug] === r)["sector"]);

        //     for (const c of columnArray) {

        //         const item = data[dataGroup].find( (s) => s[columnSlug] === c && s[rowSlug] == r);
        //         row.push(item != undefined ?  convertToCurrencyInTable(item[valueKey] * 1000 * 1000) : "-")
        //     }


            rows.push(row)
       }


       const table = {
           headers: ["Bedrijf","Vergunning","Cijns","Oppervlakterecht","Retributies"],
           rows
       }

        return {

           table,
           graphs :  [ 
                    { 
                        "payments": paymentsFromThisYear.filter( p => p.payment_stream == 'royalties' && !p.aggregated),
                        "geodata": data.geodata
                    },
                    { 
                        "payments": paymentsFromThisYear.slice().filter( p => p.payment_stream == 'surface_rental' && !p.aggregated),
                        "geodata": data.geodata
                    },
                    { 
                        "payments": paymentsFromThisYear.slice().filter( p => p.payment_stream == 'retributions' && !p.aggregated),
                        "geodata": data.geodata
                    }
                ]

        }
    }

    
    async update(data: any, segment: string, update: boolean) {

        this.segment = segment;

        const formattedData = this.prepareData(data);

        if(update) {
            // console.log('group update')
            await this.royalties.update(formattedData.graphs[0],'royalties',true);
            await this.surfaceRental.update(formattedData.graphs[1],'surface_rental',true);
            await this.retributions.update(formattedData.graphs[2],'retributions',true);
        }
    } 
}
