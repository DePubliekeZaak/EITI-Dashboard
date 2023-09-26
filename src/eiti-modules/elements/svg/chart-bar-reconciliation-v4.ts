import { convertToCurrency } from '@local/d3-services';
import { slugify, thousands } from '@local/d3-services/_helpers';
import { DataPart, GraphData } from '@local/d3_types';
import { Bars } from '@local/d3_types/data';
import { colours} from "@local/styleguide";
// import * as d3 from 'd3';
import { join } from 'lodash';

// const groupHeight = 160;
// const barHeight = 40;

interface ChartElement {

    draw: (data: Bars) => void,
    redraw: (data: Bars) => void
}

export class ChartBarReconciliationV4 implements ChartElement {

    background;
    barGroup;
    outcome;
    bar;
    arrow;

    label;
    mouseOverTrigger;
    tooltipArray = [];

    constructor(
        public ctrlr,
    ){}

    draw(data: Bars) {

        this.ctrlr.svg.layers.data.selectAll("rect").remove();
        this.ctrlr.svg.layers.data.selectAll("g").remove();

        this.barGroup = this.ctrlr.svg.layers.data.selectAll(".bar_group")
            .data(data)
            .join("g")
            .attr("class","bar_group");


        this.background = this.barGroup
            .append("rect")
            .attr("fill","#fff");

        
        this.outcome = this.barGroup
            // .data(data)
            .append("rect")
            .attr("class", (d) => "diff " + slugify(d.label))
            .attr("fill", "#eee")

        this.bar = this.barGroup
            .append("rect")
            .attr("fill", (d,i) => colours[d.colour][1])
        ;

        this.arrow = this.barGroup
            .append("path")
            .attr("d", (d) => {

                if(d.value > 0) {

                    return "M0 14 L-28 0 L-28 28 Z"

                } else if(d.value < 0) {

                    return "M0 14 L28 0 L28 28 Z";
                }
            })
            .attr("fill", (d,i) => colours[d.colour][1])
        ;

        this.label = this.barGroup
            .append('text')
            .attr('class','barLabel')
            .attr('dx', (d) => d.value > 0 ? -36 : 36)
            .attr('dy',  '19px')
            .style("text-anchor", (d) => d.value > 0 ? "end" : "start")
            ;


        this.mouseOverTrigger = this.barGroup
            .append("rect")
            .attr("fill","transparent");
    }

    redraw(data: Bars) {

        let self = this;

        const barHeight = self.ctrlr.scales.y.scale.bandwidth() / 2;

        this.background
            .attr('height', barHeight )
            .attr('width', this.ctrlr.dimensions.width)
            .attr('x', (d) => - self.ctrlr.scales.x.fn(d.value2))

        this.barGroup 
            .attr("transform", (d) => {
                const x = self.ctrlr.scales.x.fn(d.value2);
                const y = d.type == "bedrijf" ? self.ctrlr.scales.y.fn(d.label) : self.ctrlr.scales.y.fn(d.label) +  barHeight;
                return "translate(" + x + "," + y + ")"
            });

        this.outcome
            .attr("height", (d) => barHeight)
            .attr("width", (d) => {

                const p = self.ctrlr.scales.x.fn(d.value2);
                const z = self.ctrlr.scales.x.fn(0);

                return p > z ? p - z : z - p                
            })
            .attr("x", (d) => {

                const p = self.ctrlr.scales.x.fn(d.value2);
                const z = self.ctrlr.scales.x.fn(0);

                return p > z ? -(p - z) : 0       
                
            })
            // .attr("y", (d,i) => self.ctrlr.scales.y.fn(d.label))
        ;
            
        this.bar
            .attr("height", (d) => barHeight - 1) // (this.ctrlr.config.extra.privacySensitive && d[self.ctrlr.parameters.y] < 25) ? 0 : self.ctrlr.dimensions.height - self.ctrlr.scales.y.fn(d[self.ctrlr.parameters.y]))
            // .transition()
            // .duration(500)
            .attr("x", (d)  => {
                if (d.value >= 0) {
                    return -(self.ctrlr.scales.x.fn(d.value) - self.ctrlr.scales.x.fn(0)) 
                } else { 
                    return 27; // (self.ctrlr.scales.x.fn(-(d.value)) - self.ctrlr.scales.x.fn(0))
                }
            })
            .attr("width", (d,i) =>  {

                if(d.value >= 0) {

                    const w = self.ctrlr.scales.x.fn(d.value) - self.ctrlr.scales.x.fn(0) - 28

                    return w > 0 ? w : 0;
                
                
                } else {

                    const w = self.ctrlr.scales.x.fn(-(d.value)) - self.ctrlr.scales.x.fn(0) - 28;

                    return w > 0 ? w : 0;
                }
            })
        ;

        this.label
            .html( (d,i) => {

               

                if (d.value) {
                    
                    return convertToCurrency(d.value * 1000 * 1000);
                } else {
                    // return 'geen verschil';
                }
            })
            .attr('fill-opacity', 1)


        this.mouseOverTrigger
            .attr('height', barHeight )
            .attr('width', this.ctrlr.dimensions.width)
            .attr('x', (d) => - self.ctrlr.scales.x.fn(d.value2))
            .on("mouseover", function (event: any, d: any) {

                let html =  "<h3>" + d.label + "</h3><table><thead><td></td><td>betalingen aangeleverd</td><td>betalingen</td><td>verschil t.o.v gemiddelde aangeleverde betaalstromen</td></thead><tbody>"



                let reports = data.filter( (r) => r.label == d.label);

                for (const r of reports) {

                
                    console.log(r);

                    html = html.concat("<tr>");

                    switch (r.type) {

                        case "bedrijf":

                            html = html.concat('<td>Bedrijf</td><td>' + convertToCurrency(r.meta.payments_companies_reported * 1000 * 1000) + '</td>' + '<td>' + convertToCurrency(r.meta.payments_companies * 1000 * 1000) + '</td><td>' + (Math.round(10000 * r.value) / 10000) + '%</td>')

                        break;

                        case "overheid":

                            html = html.concat('<td>Overheid</td><td>' + convertToCurrency(r.meta.payments_government_reported * 1000 * 1000) + '</td>' + '<td>' + convertToCurrency(r.meta.payments_government * 1000 * 1000)+ '</td><td>' + (Math.round(10000 * r.value) / 10000) + '%</td>')

                        break;
                
                    }

                    html = html.concat("</tr>")
                 
                }

                html = html.concat("</tbody></table>");
                
                window.d3.select('.tooltip') 
                    .html(html)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 5) + "px")
                    .style("opacity", 1);

                self.tooltipArray.push(d.label);

            })
            .on("mouseout", function (event: any, d: any) {
               
                // only if has not immerdiately entered a new one 

                const index = self.tooltipArray.indexOf(d.label);
                
               if (index > -1) {
                   self.tooltipArray.splice(index,1)
               }

               setTimeout( () => {

                    if(self.tooltipArray.length == 0) {
                        window.d3.select('.tooltip')
                            .transition()
                            .duration(250)
                            .style("opacity", 0);
                    }

                },250);

            });

        
    }
}


