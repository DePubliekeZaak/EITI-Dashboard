// import * as d3 from 'd3';
import { colours } from '@local/styleguide';
import { Dimensions, DataPart, GraphData} from "@local/d3_types";


export class ChartLine {

    line;
    lineEnter;

    constructor(
        public ctrlr : any,
        public yParameter: string,
        public colour: string
    ){
    }

    draw(data: any) {

        const yParameter = this.ctrlr.parameters[this.yParameter] != undefined ? this.ctrlr.parameters[this.yParameter] : this.yParameter;

        this.line = this.ctrlr.svg.layers.data.selectAll('.line-' + yParameter)
            .data([data])
            .join("path")
            .attr("class", "line-" + yParameter);
    }

    lineMaker() : d3.Line<[number, number]> {

        const yParameter = this.ctrlr.parameters[this.yParameter] != undefined ? this.ctrlr.parameters[this.yParameter] : this.yParameter;

        // console.log(yParameter)

        return window.d3.line()
            .x(d => this.ctrlr.scales.x.scale(d['value']  ))
            .y((d, i) => { 

                if(i == 0) {
                    return this.ctrlr.scales.y.scale(d['label']) + this.ctrlr.scales.y.scale.bandwidth() + 20
                } else if (i == 1) {
                    return this.ctrlr.scales.y.scale(d['label'])  - 20
                }
            }) 
            .curve(window.d3.curveBasis);
    }

    redraw() {

        let self = this;

        this.line
            .transition()
            .duration(500)
            .attr("d", this.lineMaker())
            .attr("fill", 'transparent')
            .attr("stroke", d => colours[this.colour][0] )
            .attr("stroke-width", 2)
            // .attr("stroke-dasharray","2 4")
        ;
    }
}
