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

export class ChartBars implements ChartElement {

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
            // .attr('x', 0)
            .attr('dx', '10px')
            .attr('dy', '16px')
            .style("text-anchor", "start")
            ;
    }

    redraw(data: Bars) {



        let self = this;

        this.bars
            .attr("y", (d,i) => self.ctrlr.scales.y.fn(d.label))
            .attr("height", (d) => self.ctrlr.scales.y.scale.bandwidth()) // (this.ctrlr.config.extra.privacySensitive && d[self.ctrlr.parameters.y] < 25) ? 0 : self.ctrlr.dimensions.height - self.ctrlr.scales.y.fn(d[self.ctrlr.parameters.y]))
            // .attr("width", 0)
            .transition()
            .duration(500)
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
        ;

        this.barLabels
            .html( (d,i) => {

                    if (d.format == 'revenue') {

                        return d.value < 0 ? '-&#x20AC;' + (Math.round(100 * -d.value) / 100) + 'M' : '&#x20AC;' + (Math.round(100 * d.value) / 100).toString().replace(".",",") + 'M';

                    } else if (d.format == 'percentage') { 

                        return (Math.round(100 * d.value) / 100) + '%';

                    } else if (d.value != 0) { 
                        
                        return Math.round(100 * d.value) / 100;
                    }

            })
            .attr('transform', (d,i) => {

                const x = d.value > 0 ? self.ctrlr.scales.x.fn(d.value) : self.ctrlr.scales.x.fn(0)
                

                return 'translate(' + (0 + x) + ',' +
                    ((self.ctrlr.scales.y.fn(d.label)))
                    + ')';

                
            })
            .attr('fill-opacity', 1)
    }
}


