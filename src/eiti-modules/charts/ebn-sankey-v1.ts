import { GraphControllerV2  } from '@local/d3_graphs';

import { ChartSankey, ChartSankeyV2, HtmlFunctionality, HtmlHeader, HTMLTable } from '@local/elements';
import { Sankey, TCtrlrs } from '@local/d3_types';
import { IGraphMapping } from '@local/d3_types';
import { breakpoints, colours } from '@local/styleguide';
import * as d3 from 'd3';
import { Line, Lines, EitiData } from '@local/d3_types';
import { filterUnique, formatLines } from '@local/eiti-services';
import { EitiPayments, IntData, SankeyLink, SankeyNode } from '@local/d3_types/data';
import { convertToCurrencyInTable } from '@local/d3-services/_helpers';

const graphHeight = 400;

// can this be a wrapper for multiple graphcontrollers?
export  class EbnSankeyV1 extends GraphControllerV2  {

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


    // do top 5 and then rest 

    constructor(
        public main: any,
        public data : EitiData,
        public element : HTMLElement,
        public mapping: IGraphMapping,
        public segment: string, 
    ){
        super(main,data,element,mapping,segment) 
        this.pre();
    }

    pre() {

        this._addMargin(10,80,0,0);
        this._addPadding(20,20,60,100);

        this._addScale('l','linear','log','company_payments');
    }

    async init() {


        const self = this;

        await super._init();

        if (!this.mapping.multiGraph && this.mapping.header) {
            this.htmlHeader = new HtmlHeader(this.element, this.mapping.header,this.mapping.description);
            this.htmlHeader.draw(); 
        }

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList = new HtmlFunctionality(this,this.element,this.mapping,this.segment);
        }

        this.element.classList.remove("graph-container");
        this.element.classList.add("graph-wrapper");

        const container = document.createElement('section');
        container.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight.toString() + "px" : graphHeight.toString() + "px";
        container.classList.add("graph-container-12")
        container.classList.add("graph-view")
        container.style.marginBottom = "2rem"
        this.element.appendChild(container);

        if (!this.mapping.multiGraph) {
            this.table = new HTMLTable(this,this.element);
        }

        await super._svg(container);

        this.config.nodeWidth = 0;
        this.config.nodePadding = 80;

        this.scales.l.set([1000]);
        this.scales.l.reset();

        this.addGradient();

        this.sankey = new ChartSankeyV2(this,"payments_companies","gray");


        await this.update(this.data,this.segment, false);

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }


        return;
    }

    addGradient() {

        this.gradient_1 = this.svg.body.append("defs").append("linearGradient")
            .attr("id", "gradient_1")//id of the gradient
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "0%")//since its a vertical linear gradient 

        this.gradient_1.append("stop")
            .attr("offset", "0%")
            .style("stop-color", colours["lightBlue"][0])//end in red
            .style("stop-opacity", 1)
            
        this.gradient_1.append("stop")
            .attr("offset", "100%")
            .style("stop-color", colours["lightBlue"][1])//start in blue
            .style("stop-opacity", 1)

        this.gradient_2 = this.svg.body.append("defs").append("linearGradient")
            .attr("id", "gradient_2")//id of the gradient
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "0%")//since its a vertical linear gradient 

        this.gradient_2.append("stop")
            .attr("offset", "0%")
            .style("stop-color", colours["lightBlue"][1])//end in red
            .style("stop-opacity", 1)
            
        this.gradient_2.append("stop")
            .attr("offset", "100%")
            .style("stop-color", colours["gray"][1])//start in blue
            .style("stop-opacity", 1)

        this.gradient_3 = this.svg.body.append("defs").append("linearGradient")
            .attr("id", "gradient_3")//id of the gradient
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "0%")//since its a vertical linear gradient 

        this.gradient_3.append("stop")
            .attr("offset", "0%")
            .style("stop-color", colours["lightBlue"][1])//end in red
            .style("stop-opacity", 1)
            
        this.gradient_3.append("stop")
            .attr("offset", "100%")
            .style("stop-color", colours["lightBlue"][0])//start in blue
            .style("stop-opacity", 1)

        this.gradient_4 = this.svg.body.append("defs").append("linearGradient")
            .attr("id", "gradient_4")//id of the gradient
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "0%")//since its a vertical linear gradient 

        this.gradient_4.append("stop")
            .attr("offset", "0%")
            .style("stop-color", colours["gray"][1])//end in red
            .style("stop-opacity", 1)
            
        this.gradient_4.append("stop")
            .attr("offset", "100%")
            .style("stop-color", colours["lightBlue"][1])//start in blue
            .style("stop-opacity", 1)
    }

    prepareData(data: EitiData) : IntData {

        this.data = data;
        const dataGroup = "payments";

       // console.log(data.government_revenues);

        const filteredData: EitiPayments[] = data[dataGroup].filter( (r: EitiPayments) => r.year == parseInt(this.segment) && r.payments_companies > 0 && r.aggregated);
        const filteredData_n: EitiPayments[] = data[dataGroup].filter( (r: EitiPayments) => r.year == parseInt(this.segment) && r.payments_companies < 0 && r.aggregated);
        const uniqueOrigins = [];
        const uniqueRecipients = [];
        const uniqueStreams = [];
        const uniqueOrigins_n = [];
        const uniqueRecipients_n = [];
        const uniqueStreams_n = [];

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

        for (const report of filteredData_n) {
            if(uniqueOrigins_n.indexOf(report.origin) < 0) {
                uniqueOrigins_n.push(report.origin);
            }
            if(uniqueRecipients_n.indexOf(report.recipient) < 0) {
                uniqueRecipients_n.push(report.recipient);
            }
            if(uniqueStreams_n.indexOf(report.payment_stream) < 0) {
                uniqueStreams_n.push(report.payment_stream);
            }
        }


        const nodes: SankeyNode[] = [];

        // aandeel
        nodes.push({
            "node": nodes.length,
            "name": "shares",
            "label": "40% aandeel in productie olie gas",
            "type": "origin"
        });

        // bedrijven
        nodes.push({
            "node": nodes.length,
            "name": "companies",
            "label": "Productie olie gas",
            "type": "origin"
        });

        // gasterra
        nodes.push({
            "node": nodes.length,
            "name": "gasterra",
            "label": "Opbrengst via Gasterra",
            "type": "origin"
        });

        // markt
        nodes.push({
            "node": nodes.length,
            "name": "markt",
            "label": "Opbrengst via markt",
            "type": "origin"
        });

        // ebn
        nodes.push({
            "node": nodes.length,
            "name": "ebn",
            "label": "Energie Beheer Nederland",
            "type": "origin"
        });

        // kosten
        nodes.push({
            "node": nodes.length,
            "name": "costs",
            "label": "Kosten",
            "type": "origin"
        });

        // vennootschapsbelasting
        nodes.push({
            "node": nodes.length,
            "name": "vennootschapsbelasting",
            "label": "Vennootschapsbelasting",
            "type": "origin"
        });

        // resultaat
        nodes.push({
            "node": nodes.length,
            "name": "resultaat",
            "label": "Resultaat",
            "type": "origin"
        });

        // dividend
        nodes.push({
            "node": nodes.length,
            "name": "dividends",
            "label": "Dividenden",
            "type": "origin"
        });

        // dividend
        nodes.push({
            "node": nodes.length,
            "name": "ezk",
            "label": "Ministerie van Economische Zaken",
            "type": "origin"
        });

        // dividend
        nodes.push({
            "node": nodes.length,
            "name": "belastingdienst",
            "label": "Belastingdienst",
            "type": "origin"
        });
        
        const links: SankeyLink[] = []

        
        links.push({
            "source": nodes.find( n => n.name == "shares").node,
            "target": nodes.find( n => n.name == "gasterra").node,
            "value": 4930,
            "amount": 4930,
            "label" : "Opbrengst aandeel gas",
            "type" : "start",
            "meta" : null
        })

        links.push({
            "source": nodes.find( n => n.name == "gasterra").node,
            "target": nodes.find( n => n.name == "ebn").node,
            "value": 4930,
            "amount": 4930,
            "label" : "Opbrengst aandeel gas",
            "type" : "start",
            "meta" : null
        })

        // wordt gronings gas op de markt verkocht? / niet via gasterra?
        links.push({
            "source": nodes.find( n => n.name == "shares").node,
            "target": nodes.find( n => n.name == "markt").node,
            "value": 4263,
            "amount": 4263,
            "label" : "Opbrengst aandeel gas",
            "type" : "start",
            "meta" : null
        })

        // wordt gronings gas op de markt verkocht? / niet via gasterra?
        links.push({
            "source": nodes.find( n => n.name == "markt").node,
            "target": nodes.find( n => n.name == "ebn").node,
            "value": 4263,
            "amount": 4263,
            "label" : "Opbrengst aandeel gas",
            "type" : "start",
            "meta" : null
        })

        links.push({
            "source": nodes.find( n => n.name == "ebn").node,
            "target": nodes.find( n => n.name == "costs").node,
            "value": 1867,
            "amount": 1867,
            "label" : "Kosten productie",
            "type" : "start",
            "meta" : null
        })

        links.push({
            "source": nodes.find( n => n.name == "costs").node,
            "target": nodes.find( n => n.name == "companies").node,
            "value": 1867,
            "amount": 1867,
            "label" : "Kosten productie",
            "type" : "start",
            "meta" : null
        })

        links.push({
            "source": nodes.find( n => n.name == "ebn").node,
            "target": nodes.find( n => n.name == "vennootschapsbelasting").node,
            "value": 1387,
            "amount": 1387,
            "label" : "Venootschapsbelasting",
            "type" : "start",
            "meta" : null
        })

        links.push({
            "source": nodes.find( n => n.name == "vennootschapsbelasting").node,
            "target": nodes.find( n => n.name == "belastingdienst").node,
            "value": 1387,
            "amount": 1387,
            "label" : "Divenden",
            "type" : "start",
            "meta" : null
        })

        links.push({
            "source": nodes.find( n => n.name == "ebn").node,
            "target": nodes.find( n => n.name == "resultaat").node,
            "value": 5926,
            "amount": 5926,
            "label" : "Resultaat",
            "type" : "start",
            "meta" : null
        })

        links.push({
            "source": nodes.find( n => n.name == "resultaat").node,
            "target": nodes.find( n => n.name == "dividends").node,
            "value": 0,
            "amount": 0,
            "label" : "Divenden",
            "type" : "start",
            "meta" : null
        })

        links.push({
            "source": nodes.find( n => n.name == "dividends").node,
            "target": nodes.find( n => n.name == "ezk").node,
            "value": 0,
            "amount": 0,
            "label" : "Divenden",
            "type" : "start",
            "meta" : null
        })



        

        // FOR TABLE

       const rows = []

       const columnArray = filterUnique(this.data[dataGroup],"year");
       const rowArray = filterUnique(this.data[dataGroup],"origin");
       rowArray.sort( (a: string, b: string) => a.localeCompare(b))
       const rowName = "origin_name";
       const rowSlug = "origin";
       const columnName = "year";
       const columnSlug = "year";
       const valueKey = "payments_companies"

  

       for (const o of uniqueOrigins) {

            const a = data[dataGroup].filter( (s) => s["aggregated"] && s[rowSlug] === o && s.year === parseInt(this.segment));

            for (const s of a) {
                   
                const row = [];
                row.push(s["origin_name"]);
                row.push(s["name_nl"]);
                row.push(s["recipient_name"]);
                row.push(  convertToCurrencyInTable(s["payments_companies"]));
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

    async draw(data: any) {

        

        this.sankey.draw(data.graph);
        
        if (!this.mapping.multiGraph) {
            this.table.draw(data.table);
        }
    }


    async redraw(data: any, range: number[]) {

        // const min = parseFloat(d3.min(data.uniqueYears)) - 0;
        // const max = parseFloat(d3.max(data.uniqueYears)) + 0;

        
     
        // this.scales.y.set(data.readyForLines.flat().map( l => l.value));

        await super.redraw(data.graph);

        
        // redraw data
        this.sankey.redraw(data.graph,this.dimensions);
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
