// import * as d3 from 'd3';
import { select as d3Select } from 'd3-selection';
import { transition as d3Transition } from 'd3-transition';
d3Select.prototype.transition = d3Transition;
import { breakpoints, colourArray } from  '@local/styleguide'
import { thousands } from "@local/d3-services";
import { Circle } from '@local/d3_types';

export class ChartScatterPlot {

    start = {};

    // headerGroup;
    // headerGroupEnter;
    // headerLabels;

    group;
    groupEnter;

    headers_lines;

    circles;
    circlesLabel;
    circlesAmount;


    constructor(
        private ctrlr
    ) {
    }

    draw(data) {

        let self = this;

        this.group = this.ctrlr.svg.layers.data.selectAll('.group')
            .data(data)
            .join("g")
            .attr("class","group");

        this.circles = this.group
            .append("circle")
            .attr("class","circle")
            .style("stroke", (d: Circle, i:number) => {  return colourArray[i][0] })
            .style("fill", (d: Circle, i:number) => { return colourArray[i][1] });

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

            //     // d3.select(event.target)
            //     //     .style("fill", d => { return 'black' });

            //     let html = `
                
            //         Begin deze week bevinden zich ` + d.value + ` dossiers in de fase ` + d.label.toLowerCase() + `
                
            //     `;
                
            //     d3.select('.tooltip') 
            //         .html(html)
            //         .style("left", (event.pageX + 5) + "px")
            //         .style("top", (event.pageY - 5) + "px")
            //         // .transition()
            //         // .duration(250)
            //         .style("opacity", 1);
                
            // })
            // .on("mouseout", function (event, d) {

            //     this.circles    
            //         .style("fill", d => { return 'white' });

            //     d3.select('.tooltip')
            //         // .transition()
            //         // .duration(250)
            //         .style("opacity", 0);
            // });

        this.circlesLabel
            .attr("dy", (d) => { return "-.7rem" })
            .attr("pointer-events","none")
            .text( (d) => { return d.label });

        this.circlesAmount
            .attr("dy", (d) => { return ".7rem" })
            .attr("pointer-events","none")
            .html( (d) => { return "&euro;" + d.value + "M" });
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
