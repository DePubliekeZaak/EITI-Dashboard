
import { breakpoints, colours } from '@local/styleguide';
import { DataObject, EitiData } from '../../shared/types';
import { GraphControllerV3 } from '../../../charts/core/graph-v3';
import { IPageController } from '../../shared/page.controller';
import { GroupObject, IGraphMappingV2 } from '../../shared/interfaces';
import { elements } from '../../../charts';
import { HTMLSource } from '../../shared/html/html-source';


const graphHeight = 600;

// can this be a wrapper for multiple graphcontrollers?
export  class RevenueTypeSankeyV1 extends GraphControllerV3  {

    sankey

    gradient_1;
    gradient_2;
    gradient_3;
    gradient_4;


    htmlHeader;
    uniqueSectors;
    scrollingContainer;


    constructor(
        public slug:  string,
        public page: IPageController, 
        public group: GroupObject, 
        public mapping: IGraphMappingV2,
        public segment: string, 
        public index: number
        
        ) {
            super(slug,page,group,mapping,segment) 
            this.pre();
        }


    pre() {

        this._addMargin(10,80,0,0);
        this._addPadding(20,20,60,100);

        this._addScale('l','log','log','company_payments');
    }

    html() {

        if(this.group.element == null ) return;
        // this.group.element.style.minWidth = "600px";

        this.graphEl = super._html();
        if(this.graphEl != null) {
            this.graphEl.style.height = (window.innerWidth < breakpoints.sm) ? graphHeight.toString() + "px" : graphHeight.toString() + "px";
            this.graphEl.style.overflowX = "auto";
            this.graphEl.style.marginBottom = "2rem";
        }

        this.scrollingContainer = document.createElement('section');
        this.scrollingContainer.classList.add("graph-container-12")
        this.scrollingContainer.classList.add("graph-view")
        this.scrollingContainer.style.height = "100%";
        this.scrollingContainer.style.minWidth = "800px";

        this.graphEl.appendChild(this.scrollingContainer);

        let source = HTMLSource(this.graphEl.parentNode as HTMLElement,this.page.main.params.language,"NL-EITI");


    }

    async init() {

        this.config.nodeWidth = 0;
        this.config.nodePadding = 50;

        await super._init();
        await super._svg(this.scrollingContainer);

        this.scales.l.set([1500]);
        this.scales.l.reset();

        // this.addGradient();

        this.sankey = new elements.ChartSankeyV1(this,"payments_companies","gray");

        await this.update(this.group.data,this.segment, false);

        return;
    }

    // addGradient() {

    //     this.gradient_1 = this.svg.body.append("defs").append("linearGradient")
    //         .attr("id", "gradient_1")//id of the gradient
    //         .attr("x1", "0%")
    //         .attr("x2", "100%")
    //         .attr("y1", "0%")
    //         .attr("y2", "0%")//since its a vertical linear gradient 

    //     this.gradient_1.append("stop")
    //         .attr("offset", "0%")
    //         .style("stop-color", colours["lightBlue"][0])//end in red
    //         .style("stop-opacity", 1)
            
    //     this.gradient_1.append("stop")
    //         .attr("offset", "100%")
    //         .style("stop-color", colours["lightBlue"][1])//start in blue
    //         .style("stop-opacity", 1)

    //     this.gradient_2 = this.svg.body.append("defs").append("linearGradient")
    //         .attr("id", "gradient_2")//id of the gradient
    //         .attr("x1", "0%")
    //         .attr("x2", "100%")
    //         .attr("y1", "0%")
    //         .attr("y2", "0%")//since its a vertical linear gradient 

    //     this.gradient_2.append("stop")
    //         .attr("offset", "0%")
    //         .style("stop-color", colours["lightBlue"][1])//end in red
    //         .style("stop-opacity", 1)
            
    //     this.gradient_2.append("stop")
    //         .attr("offset", "100%")
    //         .style("stop-color", colours["gray"][1])//start in blue
    //         .style("stop-opacity", 1)

    //     this.gradient_3 = this.svg.body.append("defs").append("linearGradient")
    //         .attr("id", "gradient_3")//id of the gradient
    //         .attr("x1", "0%")
    //         .attr("x2", "100%")
    //         .attr("y1", "0%")
    //         .attr("y2", "0%")//since its a vertical linear gradient 

    //     this.gradient_3.append("stop")
    //         .attr("offset", "0%")
    //         .style("stop-color", colours["lightBlue"][1])//end in red
    //         .style("stop-opacity", 1)
            
    //     this.gradient_3.append("stop")
    //         .attr("offset", "100%")
    //         .style("stop-color", colours["lightBlue"][0])//start in blue
    //         .style("stop-opacity", 1)

    //     this.gradient_4 = this.svg.body.append("defs").append("linearGradient")
    //         .attr("id", "gradient_4")//id of the gradient
    //         .attr("x1", "0%")
    //         .attr("x2", "100%")
    //         .attr("y1", "0%")
    //         .attr("y2", "0%")//since its a vertical linear gradient 

    //     this.gradient_4.append("stop")
    //         .attr("offset", "0%")
    //         .style("stop-color", colours["gray"][1])//end in red
    //         .style("stop-opacity", 1)
            
    //     this.gradient_4.append("stop")
    //         .attr("offset", "100%")
    //         .style("stop-color", colours["lightBlue"][1])//start in blue
    //         .style("stop-opacity", 1)
    // }

    prepareData(data: DataObject) : DataObject {

        data.nodes = [];
        data.links = [];

        for (const origin of data.uniqueOrigins) {

            const report = data.filteredData.find ( (s) => s.origin == origin);
            
            if (report != undefined) {

                data.nodes.push({
                    "node": data.nodes.length,
                    "name": origin,
                    "label": this.page.main.params.language == 'en' ? report.origin_name_en : report.origin_name,
                    "type": "origin"
                })
            }
        }

        for (const recipient of data.uniqueRecipients) {

            const report = data.filteredData.find ( (s) => s.recipient == recipient);

            if (report != undefined) {

                data.nodes.push({
                    "node": data.nodes.length,
                    "name": recipient,
                    "label": this.page.main.params.language == 'en' ? report.recipient_name_en: report.recipient_name,
                    "type": "recipient"

                })
            }
        }

        // for (const origin of data.uniqueOrigins_n) {

        //     const report = data.filteredData_n.find ( (s) => s.origin == origin);

        //     if (report != undefined) {

        //         data.nodes.push({
        //             "node": data.nodes.length,
        //             "name": origin,
        //             "label": report.origin_name,
        //             "type": "origin"
        //         })

        //     }
        // }

        // for (const recipient of data.uniqueRecipients_n) {

        //     const report = data.filteredData_n.find ( (s) => s.recipient == recipient);

        //     if (report != undefined) {
        //         data.nodes.push({
        //             "node": data.nodes.length,
        //             "name": recipient,
        //             "label": report.recipient_name,
        //             "type": "recipient"

        //         })
        //     }
        // }

        if (data.nodes.length > 1) {

            for (const stream of data.uniqueStreams) {

                    const report = data.filteredData.find ( (s) => s.payment_stream == stream);

                    if (report != undefined) {

                        data.nodes.push({
                            "node": data.nodes.length,
                            "name": stream,
                            "label": this.page.main.params.language == 'en' ? report.name_en : report.name_nl,
                            "type": "stream"
                        })
                    }
            }

            // for (const stream of data.uniqueStreams_n) {

            //     const report = data.filteredData_n.find ( (s) => s.payment_stream == stream);

            //     if (report != undefined) {

            //         data.nodes.push({
            //             "node": data.nodes.length,
            //             "name": stream,
            //             "label": report.name_nl,
            //             "type": "stream"
            //         })
            //     }
            // }
        
            for (const stream of data.filteredData) {

                if (stream.payments_companies > 0) {

                    const value = (stream.payments_companies < 1) ? 1 : stream.payments_companies;

                    const origin = data.nodes.find( n => n.name == stream.origin);
                    const recipient = data.nodes.find( n => n.name == stream.recipient);
                    const type = data.nodes.find( n => n.name == stream.payment_stream);

                    if(origin != undefined && type != undefined) {

                    //    scales are on the graph ...

                    // move to graph ? 

                        data.links.push({
                            "source": origin.node,
                            "target": type.node,
                            "value": this.scales.l.fn(value),
                            "amount": stream.payments_companies,
                            "label" : this.page.main.params.language == 'en' ? stream.name_en : stream.name_nl,
                            "type" : "start",
                            "meta" : stream
                        })

                        data.links.push({
                            "source": type.node,
                            "target": recipient.node,
                            "value": this.scales.l.fn(value),
                            "amount": stream.payments_companies,
                            "label" : this.page.main.params.language == 'en' ? stream.name_en : stream.name_nl,
                            "type" : "end",
                            "meta" : stream
                        })
                    }

                }

            }

            // for (const stream of data.filteredData_n) {

            //     if (stream.payments_companies < 0) {

            //         const origin = data.nodes.filter( n => n.name == stream.origin);
            //         const recipient = data.nodes.find( n => n.name == stream.recipient);
            //         const type = data.nodes.find( n => n.name == stream.payment_stream);

            //         if(origin != undefined && type != undefined) {

            //         const value = (stream.payments_companies > -1) ? 1 : -stream.payments_companies;

            //             data.links.push({
            //                 "source": origin[1].node,
            //                 "target": type.node,
            //                 "value": this.scales.l.fn(value),
            //                 "amount": stream.payments_companies,
            //                 "label" : stream.name_nl,
            //                 "type" : "start-reverse",
            //                 "meta" : stream
            //             })

            //             data.links.push({
            //                 "source": type.node,
            //                 "target": recipient.node,
            //                 "value": this.scales.l.fn(value),
            //                 "amount": stream.payments_companies,
            //                 "label" : stream.name_nl,
            //                 "type" : "end-reverse",
            //                 "meta" : stream
            //             })

            //         }

            //     }

            // }

        }


        return data;
    }

    async draw(data: DataObject) {

        // const graph = {
        //     nodes: data.nodes,
        //     links: data.links
        // }

        this.sankey.draw();
    }


    async redraw(data: any, range: number[]) {

        const graph = {
            nodes: data.nodes,
            links: data.links
        }

        await super.redraw();

        this.sankey.redraw(graph,this.dimensions);
    }

    
    async update(data: EitiData, segment: string, update: boolean, range?: number[]) {

       await super._update(data,segment,update, range);
    } 
}
