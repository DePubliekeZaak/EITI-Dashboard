
import { colours } from "../../img-modules/styleguide";
import { Line } from "../../pages/shared/types_graphs";


export class ChartLine {

    line;
    lineEnter;

    constructor(
        public ctrlr : any,
        public xParameter: string,
        public yParameter: string
    ){
    }

    draw(data: Line) {

        // console.log(this.yParameter);

        this.line = this.ctrlr.svg.layers.data.selectAll('.line-' + this.yParameter)
            .data([data])
            .join("path")
            .attr("class", "line-" + this.yParameter)
            .attr("fill", 'transparent')
            .attr("stroke", d => colours[data[0].colour || "purple"][0] )
            .attr("stroke-width", 1)
            // .attr("stroke-dasharray","2 4")
    }

    lineMaker() :any {

        const self = this;

        return window.d3.line()
            .x(d => this.ctrlr.scales.x.scale(d["time"]))
            .y(d => self.ctrlr.scales.y1.scale(d["value"]))
            .curve(window.d3.curveStepBefore);
    }

    redraw() {

        let self = this;

        this.line
            .transition()
            .duration(250)
            .attr("d", this.lineMaker())
        ;
    }
}
