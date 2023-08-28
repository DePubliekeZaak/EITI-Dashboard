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

export class ChartBarReconciliation implements ChartElement {

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
            .attr('dx', (d) => d.value > 0 ? 6 : -6)
            .attr('dy',  '13px')
            .style("text-anchor", (d) => d.value > 0 ? "start" : "end")
            ;
    }

    redraw(data: Bars) {

        let self = this;

        const barHeight = self.ctrlr.scales.y.scale.bandwidth() / 2;

        this.bars
            .attr("y", (d,i) => d.type == "bedrijf" ? self.ctrlr.scales.y.fn(d.label) : self.ctrlr.scales.y.fn(d.label) +  barHeight)
            .attr("height", (d) => barHeight) // (this.ctrlr.config.extra.privacySensitive && d[self.ctrlr.parameters.y] < 25) ? 0 : self.ctrlr.dimensions.height - self.ctrlr.scales.y.fn(d[self.ctrlr.parameters.y]))
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
            });

        this.barLabels
            .html( (d,i) => {
                if (d.value) {
                    return (Math.round(100 * d.value) / 100) + '%';
                }
            })
            .attr('transform', (d,i) => {
                const x = self.ctrlr.scales.x.fn(d.value) 
                const y = d.type == "bedrijf" ? self.ctrlr.scales.y.fn(d.label) : self.ctrlr.scales.y.fn(d.label) + barHeight       
                return 'translate(' + (0 + x) + ',' + ((y)) + ')';
            })
            .attr('fill-opacity', 1)

        if (this.ctrlr.index % 3 !== 0) {
            this.ctrlr.svg.body.selectAll("g.y-axis")
            .style("display","none")
        } else  {

        this.ctrlr.svg.body.selectAll("g.y-axis")
            .attr('transform', (d,i) => "translate(42,0)");

        this.ctrlr.svg.body.selectAll("g.y-axis path")
            .style("display","none")

        this.ctrlr.svg.body.selectAll("g.y-axis line")
            .style("display","none")

        this.ctrlr.svg.body.selectAll("g.y-axis text")
        .style("fill", colours["gray"][0])

        }
    }
}


