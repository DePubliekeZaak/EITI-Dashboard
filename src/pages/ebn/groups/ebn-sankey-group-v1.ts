import { EitiReport } from "@local/d3_types";
import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { DataObject, EitiData, EitiPayments, TableData } from "../../shared/types";
import { SankeyLink, SankeyNode } from "../../shared/types_graphs";
import { filterUnique } from "../../shared/data.format.factory";
import { convertToCurrencyInTable } from "../../shared/_helpers";

const graphHeight = 400;

export  class EbnSankeyGroupV1 extends GroupControllerV1  {

    chartAxis;
    chartLines;
    finalRevenueLine;
    zeroLine;
    table;
    funcList;

    sankey

    yScale;
    xScale;

    gradient_1;
    gradient_2;
    gradient_3;
    gradient_4;


    constructor(
        public page: any,
        public config: IGroupMappingV2,
    ){
       super(page,config);
    }

    html() {
        return super.html()
    }

    init() { }



    prepareData(data: EitiData) : any {

        const dataGroup = "payments";

        if (data[dataGroup] == undefined) return;

        const  yearData: EitiPayments[] = data[dataGroup].filter( (r: EitiPayments) => r.year == parseInt(this.segment));
        const filteredData: EitiPayments[] = data[dataGroup].filter( (r: EitiPayments) => r.year == parseInt(this.segment) && r.payments_companies > 0 && r.aggregated);
        const filteredData_n: EitiPayments[] = data[dataGroup].filter( (r: EitiPayments) => r.year == parseInt(this.segment) && r.payments_companies < 0 && r.aggregated);
        const uniqueOrigins: string[] = [];
        const uniqueRecipients: string[] = [];
        const uniqueStreams: string[] = [];

        for (const report of filteredData) {
            if(uniqueOrigins.indexOf(report.origin) < 0) {
                uniqueOrigins.push(report.origin);
            }
            if(uniqueRecipients.indexOf(report.recipient) < 0) {
                uniqueRecipients.push(report.recipient);
            }
            if(uniqueStreams.indexOf(report.payment_stream) < 0) {
                uniqueStreams.push(report.payment_stream);
            }
        }

        const nodes: SankeyNode[] = [];

        // aandeel
        nodes.push({
            "node": nodes.length,
            "name": "shares",
            "label": this.page.main.params.language == 'en' ? "Share in production of oil and gas" : "Aandeel in productie olie en gas",
            "type": "origin"
        });

        // bedrijven
        nodes.push({
            "node": nodes.length,
            "name": "companies",
            "label": this.page.main.params.language == 'en' ?  "Production of oil and gas" : "Productie olie gas",
            
            "type": "origin"
        });

        // gasterra
        nodes.push({
            "node": nodes.length,
            "name": "gasterra",
            "label": this.page.main.params.language == 'en' ? "Revenue from Gasterra" : "Opbrengst via Gasterra",
            "type": "origin"
        });

        // markt
        nodes.push({
            "node": nodes.length,
            "name": "markt",
            "label": this.page.main.params.language == 'en' ? "Revenue from market" : "Opbrengst via markt",
            "type": "origin"
        });

        // ebn
        nodes.push({
            "node": nodes.length,
            "name": "ebn",
            "label": this.page.main.params.language == 'en' ? "Energie Beheer Nederland" : "Energie Beheer Nederland",
            "type": "origin"
        });

        // kosten
        nodes.push({
            "node": nodes.length,
            "name": "costs",
            "label": this.page.main.params.language == 'en' ? "Costs" : "Kosten",
            "type": "origin"
        });

        // vennootschapsbelasting
        nodes.push({
            "node": nodes.length,
            "name": "vennootschapsbelasting",
            "label": this.page.main.params.language == 'en' ? "Corporate Income Tax" : "Vennootschapsbelasting",
            "type": "origin"
        });

        // resultaat
        nodes.push({
            "node": nodes.length,
            "name": "resultaat",
            "label": this.page.main.params.language == 'en' ? "Result" : "Resultaat",
            "type": "origin"
        });

         // dividend
         nodes.push({
            "node": nodes.length,
            "name": "dividends",
            "label": this.page.main.params.language == 'en' ? "Dividends" : "Dividenden",
            "type": "origin"
        });

        // equity
        nodes.push({
            "node": nodes.length,
            "name": "equity",
            "label": this.page.main.params.language == 'en' ?  "Equity" : "Eigen vermogen",
            "type": "origin"
        });

        // dividend
        nodes.push({
            "node": nodes.length,
            "name": "belastingdienst",
            "label": this.page.main.params.language == 'en' ? "Tax Office" : "Belastingdienst",
            "type": "origin"
        });

        nodes.push({
            "node": nodes.length,
            "name": "ezk",
            "label": this.page.main.params.language == 'en' ? "Ministry of Economic Affairs" : "Ministerie van Economische Zaken",
            "type": "origin"
        });
        
        const links: SankeyLink[] = []

        const arr = [
            {
                source: "shares",
                target: "gasterra",
                value: 1500,
                label: "Opbrengst aandeel gas",
                label_en: "Revenues from share in gas production"
            },
            {
                source: "gasterra",
                target: "ebn",
                value: 1500,
                label: "Opbrengst aandeel gas",
                label_en: "Revenues from share in gas production"
            },
            {
                source: "shares",
                target: "markt",
                value: 1500,
                label: "Opbrengst aandeel gas",
                label_en: "Revenues from share in gas production"
            },
            {
                source: "markt",
                target: "ebn",
                value: 1500,
                label: "Opbrengst aandeel gas",
                label_en: "Revenues from share in gas production"
            },
            {
                source: "ebn",
                target: "costs",
                value: 1000,
                label: "Opbrengst aandeel gas",
                label_en: "Revenues from share in gas production"
            },
            {
                source: "costs",
                target: "companies",
                value: 1000,
                label: "Productie kosten",
                label_en: "Production costs"
            },
            {
                source: "ebn",
                target: "vennootschapsbelasting",
                value: 1000,
                label: "Venootschapsbelasting",
                label_en: "Corporate Income Tax",
            },
            {
                source: "vennootschapsbelasting",
                target: "belastingdienst",
                value: 1000,
                label: "Dividenden",
                label_en: "Dividends",
            },
            {
                source: "ebn",
                target: "resultaat",
                value: 1000,
                label: "Resultaat",
                label_en: "Result",
            },
            {
                source: "resultaat",
                target: "dividends",
                value: 1000,
                label: "Divenden",
                label_en: "Dividends",
            },
            {
                source: "dividends",
                target: "ezk",
                value: 1000,
                label: "Dividenden",
                label_en: "Dividends",
            },
            {
                source: "resultaat",
                target: "equity",
                value: 1000,
                label: "Equity",
                label_en: ""
            }
        ]

        for (const a of arr) {

            let source = nodes.find( n => n.name == a.source);
            let target = nodes.find( n => n.name == a.target);

            if(source && target) {

                links.push({
                    "source": source.node,
                    "target": target.node,
                    "value": a.value, 
                    "amount": a.value,
                    "label" : this.page.main.params.language == 'en' ? a.label_en : a.label,
                    "type" : "start",
                    "meta" : null
                })
            }
        }
        

        // FOR TABLE

       const rows: any[][] = []

       const columnArray = filterUnique(data[dataGroup],"year");
       const rowArray : string[] = filterUnique(data[dataGroup],"origin").map( a => a.toString())
       rowArray.sort( (a: string, b: string) => a.localeCompare(b))
       const rowName = "origin_name";
       const rowSlug = "origin";
       const columnName = "year";
       const columnSlug = "year";
       const valueKey = "payments_companies"

  

       for (const o of uniqueOrigins) {

            const a = data[dataGroup].filter( (s) => s["aggregated"] && s[rowSlug] === o && s.year === parseInt(this.segment));

            for (const s of a) {
                   
                const row: any[]  = [];
                row.push(s["origin_name"]);
                row.push(s["name_nl"]);
                row.push(s["recipient_name"]);
                row.push(convertToCurrencyInTable(s["payments_companies"]));
                rows.push(row);
            }
  
       }


       const table = {
           headers: ["Origine","Betaalstroom","Ontvanger", this.segment],
           rows
       }

        
        return {
            graph: { 
                nodes,
                links,
            },
            table    
        };
    }

    
    populateTable(tableData: TableData) {

        super.populateTable(tableData);
    }

    update(data: DataObject, segment: string, update: boolean) {

        super.update(data,segment,update)
    }  
}
