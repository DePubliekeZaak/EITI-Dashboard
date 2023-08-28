import * as d3 from 'd3';
import { colours } from '@local/styleguide';
import { Dimensions, DataPart, GraphData} from "@local/d3_types";


export class ZeroLine {

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

      //  const yParameter = this.ctrlr.parameters[this.yParameter] != undefined ? this.ctrlr.parameters[this.yParameter] : this.yParameter;

        // console.log(yParameter)

        return d3.line()
            .x(d => this.ctrlr.scales.x.scale(0))
            .y((d, i) => { 

                // if(i == 0) {
                    return this.ctrlr.scales.y.scale(d)
                // } else if (i == 1) {
                  //  return this.ctrlr.dimensions.svgHeight
    
            }) 
            .curve(d3.curveBasis);
    }

    redraw() {

        let self = this;

        this.line
            .transition()
            .duration(500)
            .attr("d", 'M ' + this.ctrlr.scales.x.scale(0) + ' 0 V ' + this.ctrlr.dimensions.height)
            .attr("fill", 'transparent')
            .attr("stroke", d => this.colour )
            .attr("stroke-width", 1)
            // .attr("stroke-dasharray","2 4")
        ;
    }
}
