import { Bars } from '@local/d3_types/data';
import { colours} from "@local/styleguide";

// const groupHeight = 220;

interface ChartElement {

    draw: (data: Bars) => void,
    redraw: (data: Bars) => void
}

export class ChartBarBells implements ChartElement {

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
            .attr("fill", (d,i) => colours[d.colour][0])
        ;
    }

    redraw(data: Bars) {

        let self = this;

        let barWidth = (self.ctrlr.scales.x.fn(data[2].label) - self.ctrlr.scales.x.fn(data[0].label)) / 2;

        if (isNaN(barWidth)) {

            barWidth = 0;
        }


        this.bars
            .attr("y", (d,i) => {
                return self.ctrlr.scales.y.fn(d.value) 
            })
            .attr("height", (d) => this.ctrlr.dimensions.height -  self.ctrlr.scales.y.scale(d.value)) 
            .attr("x", (d,i)  => {
                if(!isNaN(d.label) ) {
                    return d.type == 'government' ? self.ctrlr.scales.x.fn(d.label)  : self.ctrlr.scales.x.fn(d.label) + barWidth
                } 
            })
            .attr("width", (d,i) =>  {
                return  barWidth
            })
        ;
    }
}


