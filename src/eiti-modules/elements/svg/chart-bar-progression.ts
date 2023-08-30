import { slugify, thousands } from '@local/d3-services';
import { Dimensions } from '@local/d3_types';
import { Bars } from '@local/d3_types';
import { colourArray, colours} from "@local/styleguide";
import * as d3 from 'd3';


const groupHeight = 320;

interface ChartElement {

    draw: (data: Bars) => void,
    redraw: (data: Bars) => void
}

export class ChartBarProgression   {

    bars;
    barLabels;
    tooltipArray: string[] = [];

    constructor(
        private ctrlr
    ){
      
    }

    draw(data: Bars) {

        this.bars = this.ctrlr.svg.layers.data.selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", d => "bar " + slugify(d.label))
            .attr("fill", (d,i) => d.colour[1])
            .attr("stroke", (d,i) => d.colour[0])
        ;

        this.barLabels = this.ctrlr.svg.layers.data.selectAll(".barLabel")
            .data(data)
            .join('text')
            .attr('class','barLabel')
            .attr('dx', '10px')
            .attr('dy', '16px')
            .style("text-anchor", "start")
            ;
    }

    redraw(dimensions: Dimensions) {

        let self = this;

        // console.log(this.ctrlr.scales.y.range());
        // console.log(this.ctrlr.scales.y.domain());

        this.bars
            .attr("x", (d)  => self.ctrlr.scales.x.fn(d.year))
            .attr("width", (d,i) =>  self.ctrlr.scales.x.scale.bandwidth())
            .attr("y", (d,i) => self.ctrlr.scales.y.fn(d.dy + d.y)) 
            .attr("height", (d) => dimensions.height - self.ctrlr.scales.y.fn(d.dy))
        ;

        this.bars
            .on("mouseover", function (event: any, d: any) {
                    
                let html = `
                    <b>` + d.label +  `</b> 
                    <div>` + d.meta.def_nl +  `</div>
                    <div>GFS code:` + d.meta.code +  `</div>
                    <div>Bedrag: &euro;` + thousands(d.dy) + `</div>
                `;

                d3.select('.tooltip') 
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
                        d3.select('.tooltip')
                            .transition()
                            .duration(250)
                            .style("opacity", 0);
                    }

                },250);
        })

    }
}


