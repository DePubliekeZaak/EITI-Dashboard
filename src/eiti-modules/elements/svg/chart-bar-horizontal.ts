import { convertToCurrency } from '@local/d3-services';
import { slugify } from '@local/d3-services/_helpers';
import { DataPart, GraphData } from '@local/d3_types';
import { Bars } from '@local/d3_types/data';
import { colours} from "@local/styleguide";

const groupHeight = 160;

interface ChartElement {

    draw: (data: Bars) => void,
    redraw: (data: Bars) => void
}

export class ChartBarsHorizontal implements ChartElement {

    bars;
    barLabels;

    constructor(
        public ctrlr,
    ){}

    draw(data: Bars) {

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
            .attr('class','barLabel')
            .attr('dx', '0px')
            .attr('dy', '-10px')
            .style("text-anchor", "middle")
            ;
    }

    redraw(data: Bars) {

        let self = this;

        this.bars
            .attr("x", (d,i) => self.ctrlr.scales.x.fn(d.label))
            .attr("width", (d) => self.ctrlr.scales.x.scale.bandwidth()) // (this.ctrlr.config.extra.privacySensitive && d[self.ctrlr.parameters.y] < 25) ? 0 : self.ctrlr.dimensions.height - self.ctrlr.scales.y.fn(d[self.ctrlr.parameters.y]))
            .attr("y", (d)  => self.ctrlr.dimensions.height)
            .attr("height", 0)
            .transition()
            .duration(250)
            .attr("y", (d)  => {

                if (d.value >= 0) {
                    return self.ctrlr.scales.y.fn(d.value);
                } else { 
                    return self.ctrlr.scales.y.fn(d.value) 
                }
            })
            .attr("height", (d,i) =>  {
                return self.ctrlr.dimensions.height - self.ctrlr.scales.y.fn(d.value);
            })
        ;

        this.barLabels
            .html( (d,i) => {

                return convertToCurrency(d.value);

            })
            .attr('opacity', 0)
            .attr('transform', (d,i) => {

                const x = self.ctrlr.scales.x.fn(d.label) + self.ctrlr.scales.x.bandwidth()  / 2;
                const y = self.ctrlr.scales.y.fn(d.value);
                
                return 'translate(' + (0 + x) + ',' +
                    (0 + y)
                    + ')';
            })
            .transition()
            .delay(500)
            
            .attr('opacity', 1)
    }
}


