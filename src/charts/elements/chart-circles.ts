// import * as d3 from 'd3';
import { select as d3Select } from 'd3-selection';
import { transition as d3Transition } from 'd3-transition';
d3Select.prototype.transition = d3Transition;
import { breakpoints, colourArray } from  '@local/styleguide'
import { slugify, thousands } from "@local/d3-services";
import { Circle } from '@local/d3_types';

export class ChartCircles {

    start = {};

    headerGroup;
    headerGroupEnter;
    headerLabels;

    group;
    groupEnter;

    headers_lines;

    circles;
    circlesLabel;
    circlesAmount;

    tooltipArray :  string[] = []
    hovering: boolean


    constructor(
        private ctrlr
    ) {

    }


    draw(data) {

        let self = this;

        this.group = this.ctrlr.svg.layers.data.selectAll('.group')
            .data(data, d => slugify(d.label))
            .join("g")
            .attr("class","group");

        this.group.selectAll('circle').remove();
        this.group.selectAll('text').remove();

        this.circles = this.group
          
            .append("circle")
            .attr("class","circle")
            .style("stroke", (d: Circle, i:number) => {  return d.colour[0] })
            .style("fill", (d: Circle, i:number) => { return d.colour[1] });

        this.circlesLabel = this.group
            .append("text")
            .attr("class","small-label in-circle")
            .attr("text-anchor","middle")
            .style("font-size","1rem")
            .style("fill","black");

        this.circlesAmount = this.group
            .append("text")
            .attr("class","small-label in-circle")
            .attr("text-anchor","middle")
            .style("font-size","1rem")
            .style("fill","black");
    }

    redraw() {

        let self = this;

        this.circles
            .attr("r", (d) => this.ctrlr.scales.r.scale(d.value));
            // .on("mouseover", function (event: any, d: any) {

            //     self.hovering = true;

        

            //     // detect if is hovering the element 
            //     // unless 

            //     if(!this.hovering) {

            //         let html = `
        
            //             <div>` + d.meta.def_nl +  `</div>
            //             <div>GFS code:` + d.meta.code +  `</div>
            //             <div>Bedrag: &euro;` + thousands(d.value) + `</div>
            //         `;

            //         window.d3.select('.tooltip')
            //             .html(html)
            //             .style("left", (event.pageX + 5) + "px")
            //             .style("top", (event.pageY - 5) + "px")
            //             .style("opacity", 1);

            //         self.tooltipArray.push(d.label);
            //     }
                
            // })
            // .on("mouseout", function (event, d) {

               
            //     // only if has not immediately entered a new one 



            //     // detect rer-entry!

            //     // const index = self.tooltipArray.indexOf(d.label);
                
            //     // if (index > -1) {
            //     //    self.tooltipArray.splice(index,1)
            //     // }

            //     // setTimeout( () => {

            //     //         if(self.tooltipArray.length == 0) {
            //     //             window.d3.select('.tooltip')
            //     //                 .transition()
            //     //                 .duration(250)
            //     //                 .style("opacity", 0);
            //     //         }

            //     //     },250);
            // });

        this.circlesLabel
            .attr("dy", (d) => -12)
            .attr("pointer-events","none")
            .text( (d) => { return d.label });

        this.circlesAmount
            .attr("dy", (d) => 12)
            .attr("pointer-events","none")
            .html( (d) => { 


                
                return "&euro;" + thousands(Math.round(d.value)) 
            });
    }

    forceDirect() {

        let self = this;

        this.group
            .attr("transform", (d) => {

                if(d.x !== undefined) {
                    return "translate(" + d.x + "," + (d.y + 0) + ")";
                }
            })
        ;
    }
}
