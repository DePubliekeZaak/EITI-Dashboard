import { convertToCurrency } from '@local/d3-services';
import { slugify } from '@local/d3-services/_helpers';
import { DataPart, GraphData } from '@local/d3_types';
import { colours} from "@local/styleguide";

const groupHeight = 160;

interface ChartElement {

    draw: (data: GraphData) => void,
    redraw: (data: GraphData) => void
}

export class ChartJanusBars implements ChartElement {

    bars;
    // barEnter;

    barLabels;
    // barLabelEnter

    constructor(
        private ctrlr,
        // private group: string,
        // private params: any[],
        // private groupIndex: number
    ){}

    draw(data: GraphData) {

        this.bars = this.ctrlr.svg.layers.data.selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class","bar")
            .attr("fill", (d,i) => colours[d.colour][1])
            .attr("stroke", (d,i) => colours[d.colour][0])
        ;

        this.barLabels = this.ctrlr.svg.layers.data.selectAll(".barLabel")
            .data(data)
            .join('text')
            .attr('class','barLabel smallest-label')
            // .attr('x', 0)
            .attr('dx', '4px')
            .attr('dy', '20px')
            .style("text-anchor", "start")
            ;
    }

    redraw(data: GraphData) {

        let self = this;

        this.bars
            .attr("x", (d)  => {
                if (d.value >= 0) {
                    return self.ctrlr.scales.x.fn(0) 
                } else { 
                    return self.ctrlr.scales.x.fn(d.value) 
                }
            })
            .attr("y", (d,i) => self.ctrlr.scales.y.fn(0))
            .attr("height", (d) => self.ctrlr.scales.y.scale.bandwidth()) // (this.ctrlr.config.extra.privacySensitive && d[self.ctrlr.parameters.y] < 25) ? 0 : self.ctrlr.dimensions.height - self.ctrlr.scales.y.fn(d[self.ctrlr.parameters.y]))
            // .attr("width", 0)
            .transition()
            .duration(500)
            .attr("width", (d,i) =>  {

                if(d.value >= 0) {
                    return self.ctrlr.scales.x.fn(d.value) - self.ctrlr.scales.x.fn(0)
                } else {
                    console.log(self.ctrlr.scales.x.fn(d.value))
                    return self.ctrlr.scales.x.fn(-(d.value)) - self.ctrlr.scales.x.fn(0) ;
                }
            })
        ;

        this.barLabels
            .text( (d,i) => {

                    if (d.value != 0) { 
                        return d.value;
                    }

            })
            .attr('transform', (d,i) => {

                        return 'translate(' + (20 + self.ctrlr.scales.x.fn(d.value)) + ',' +
                            ((self.ctrlr.scales.y.fn(d.label)))
                            + ')';

                
            })
            .attr('fill-opacity', 1)
    }
}


