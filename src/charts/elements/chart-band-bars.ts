import { colours } from "../../img-modules/styleguide";
import { convertToCurrency } from "../../pages/shared/_helpers";
import { DataPart } from "../../pages/shared/types";
import { Bar, Bars } from "../../pages/shared/types_graphs";

export class ChartBandBar {

    bars;
    barsEnter;

    barLabels;
    barLabelsEnter

    constructor(
        private ctrlr
    ){}

    draw(data) {

        this.bars = this.ctrlr.svg.layers.data.selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("fill", (d) => colours[d.colour][1])
            .attr("stroke", (d) => colours[d.colour][0])
        ;

        this.barLabels = this.ctrlr.svg.layers.data.selectAll(".barLabel")
            .data(data)
            .join('text')
            .attr('class','barLabel smallest-label')
            .attr('x', 0)
            .attr('dx', '0px')
            .attr('dy', '-4px')
            .style("text-anchor", "middle")
            ;
    }

    redraw(data: Bars) {

        let self = this;

        this.bars
            .attr("x", (d: Bar)  => {
                return self.ctrlr.scales.x.fn(d.label);
            })
            .attr("y", self.ctrlr.dimensions.height)
            .attr("height", 0)
            .attr("width",  (self.ctrlr.scales.x.config.type === 'band') ? self.ctrlr.scales.x.scale.bandwidth() : self.ctrlr.dimensions.width / data.length - 1)
            .transition()
            .duration(500)
            .attr("y", (d) => (this.ctrlr.config.extra.privacySensitive && d.value < 25) ? self.ctrlr.dimensions.height : self.ctrlr.scales.y.fn(d.value))
            .attr("height", (d) => self.ctrlr.dimensions.graphHeight - self.ctrlr.scales.y.fn(d.value))

        this.bars    
            .on("mouseover", function (event: any, d: any) {
                console.log(d);
            })

        ;

        this.barLabels
            .text( (d) => {

                if(d.format === 'currency') {
                    return convertToCurrency(d.value);

                } else if(d.format === 'percentage') {

                    return d.value + "%";

                } else {
                    return (self.ctrlr.config.extra.privacySensitive && d.value < 25) ? '< 25' : d.value ;
                }
            })
            .attr('transform', (d) => {

                    if (this.ctrlr.scales.x.config.type === "band") {

                        return 'translate(' + (self.ctrlr.scales.x.fn(d.label) + (self.ctrlr.scales.x.scale.bandwidth() / 2)) + ',' +
                            ((self.ctrlr.config.extra.privacySensitive && d.value < 25) ? self.ctrlr.dimensions.height : self.ctrlr.scales.y.fn(d.value))
                            + ')';

                    } else {
                        
                        return 'translate(' + (self.ctrlr.dimensions.width / 2) + ',' +
                            ((self.ctrlr.config.extra.privacySensitive && d.value < 25) ? self.ctrlr.dimensions.height : self.ctrlr.scales.y.fn(d.value))
                            + ')';

                    }
            })
            .attr('fill-opacity', 0)
            .transition()
            .delay(500)
            .duration(500)
            .attr('fill-opacity', 1)
    }
}


