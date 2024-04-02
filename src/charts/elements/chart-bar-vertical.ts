import { slugify, thousands } from '@local/d3-services';
import { Dimensions } from '@local/d3_types';
import { Bars } from '@local/d3_types';
import { colourArray, colours} from "@local/styleguide";
import { IGraphControllerV3 } from '../core/graph-v3';


const groupHeight = 320;

interface ChartElement {

    draw: (data: Bars) => void,
    redraw: (data: Bars) => void
}

export class ChartBarVertical   {

    barGroup
    bars;
    barLabels;
    tooltipArray: string[] = [];

    constructor(
        private ctrlr : IGraphControllerV3
    ){
    }

    draw(data: Bars) {
      
        this.bars = this.ctrlr.svg.layers.data.selectAll(".bar")
            .data(data, d => d.year)
            .join("rect")
            .attr("class", d => "bar " + slugify(d.label))
            .attr("fill", (d,i) => colours[d.colour][1])
            .attr("stroke", (d,i) => colours[d.colour][0])
        ;

        this.barLabels = this.ctrlr.svg.layers.data.selectAll(".bar_label")
            .data(data, d => d.year)
            .join('text')
            .filter( (d) => !isNaN(d.value) && d.value > 0)
            .attr('class','bar_label')
            .attr('dy', '-10px')
            .style("text-anchor", "middle")
            .style("font-size",".66rem")
        ;
    }

    redraw(dimensions: Dimensions) {

        let self = this;

        this.bars
            .attr("x", (d)  => self.ctrlr.scales.x.fn(d.year))
            .attr("width", (d,i) =>  self.ctrlr.scales.x.scale.bandwidth())
            .attr("y", (d)  => self.ctrlr.dimensions.height)
            .attr("height", 0)
            .transition()
            .duration(250)
            .attr("y", (d,i) => self.ctrlr.scales.y.fn(d.value)) 
            .attr("height", (d) => dimensions.height - self.ctrlr.scales.y.fn(d.value))
        ;

        this.barLabels
            .attr("x", (d)  => self.ctrlr.scales.x.fn(d.year))
            .attr("y", (d,i) => self.ctrlr.scales.y.fn(d.value)) 
            .html((d) => {

                let s = '';
                if (d.format == 'percentage') {
                    s = (Math.round(d.value * 10) / 10).toString().replace(".",",") + "%";
                } else if (d.format == 'miljard') {
                    let base = self.ctrlr.page.main.params.language == 'en' ? 'bln' : 'mld';
                    s = "&euro;" + thousands(Math.round(d.value * 10) / 10).toString() + base;
                } else if (d.format == 'fte') {
                    s = thousands(Math.round(d.value)).toString() + ' FTE';
                } else if (d.format == 'miljoen') {
                    s = "&euro;" + Math.round(d.value).toString() + 'M';
                } else if (d.format == 'currency') {
                    s = "&euro;" + thousands(Math.round(d.value)).toString();
                } else if (d.format == 'numeric') {
                    s = thousands(Math.round(d.value)).toString();
                }
                return s;
            })
            .attr('dx', self.ctrlr.scales.x.scale.bandwidth() / 2)
            ;

    }
}


