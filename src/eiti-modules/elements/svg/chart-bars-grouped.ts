import { convertToCurrency } from '@local/d3-services';
import { slugify } from '@local/d3-services/_helpers';
import { DataPart, GraphData } from '@local/d3_types';
import { Bars, GroupedBars } from '@local/d3_types/data';
import { colours} from "@local/styleguide";

const groupHeight = 160;

interface ChartElement {

    draw: (data: GroupedBars) => void,
    redraw: (data: GroupedBars) => void
}

export class ChartBarsGrouped implements ChartElement {

    barGroup;
    bars;
    barLabels;

    constructor(
        public ctrlr,
    ){}

    draw(data: GroupedBars) {

        this.barGroup = this.ctrlr.svg.layers.data.selectAll(".bargroup")
            .data(data)
            .join("g")
            .attr("class", (d) => "bargroup " + d.label)
        ;

        

        this.bars = this.barGroup.selectAll(".bar")
            .data( d => d.group)
            .join("rect")
            .attr("class","bar")
            .attr("fill", (d,i) => d.colour)
            .attr("stroke", (d,i) => d.colour)

        this.barLabels = this.barGroup.selectAll(".barLabel")
            .data( d => d.group)
            .join('text')
            .attr('class','barLabel')
            .attr('dx', '4px')
            .attr('dy', '15px')
            .style("text-anchor", "start")
            ;
    }

    redraw(data: GroupedBars) {

        let self = this;

        this.barGroup
            .attr("transform", (d,i) => {
                
                const x = 0;

                const y = self.ctrlr.scales.y.fn(d.label);
                
                return "translate(" + x + "," + y + ")"
                
            })

        this.bars
            .attr("y", (d,i) => i * (self.ctrlr.scales.y.scale.bandwidth() / 4))
            .attr("height", (d) => self.ctrlr.scales.y.scale.bandwidth() / 4 - 2)
            // .transition()
            // .duration(500)
            .attr("x", (d)  => {
                if (d.value >= 0) {
                    return self.ctrlr.scales.x.fn(0) 
                } else { 
                    return self.ctrlr.scales.x.fn(d.value) 
                }
            })
            .attr("width", (d,i) =>  {

                if(d.value >= 0) {
                    return self.ctrlr.scales.x.fn(d.value) - self.ctrlr.scales.x.fn(0)
                } else {
                    return self.ctrlr.scales.x.fn(-(d.value)) - self.ctrlr.scales.x.fn(0) ;
                }
            })
            .on
        ;

        this.barLabels
            .html( (d,i) => {
               return d.label + ": " + d.value
            })
            .attr('transform', (d,i) => {

                const x = d.value > 0 ? self.ctrlr.scales.x.fn(d.value) : self.ctrlr.scales.x.fn(0)
                const y =  i * (self.ctrlr.scales.y.scale.bandwidth() / 4) - 2

                return 'translate(' + (0 + x) + ',' +
                    y
                    + ')';

                
            })
            .attr('fill-opacity', 1)
    }
}


