import { colours } from '@local/styleguide';


export class ChartGrid {

    constructor(
        public ctrlr
    ) {

    }

    draw(data: any[]) {

        this.ctrlr.svg.gridLines = this.ctrlr.svg.layers.underData.selectAll(".gridLine")
            .data(data)
            .join("line")
            .attr("class", "gridLine");

        // this.ctrlr.svg.gridNumbers = this.ctrlr.svg.layers.underData.selectAll(".gridNumber")
        //     .data(data.slice(0,data.length - 1))
        //     .join("text")
        //     .attr("class", "gridNumber smallest-label")
        //     .attr("text-anchor","middle")
        //     .attr("font-size",".75rem")
        //     .attr("font-family","NotoSans Regular");
    }

    redraw(data,colour) {

            let self = this;

            this.ctrlr.svg.gridLines
                .attr("x1", (d) => {
                    return 0;// self.ctrlr.scales.x.scale(d.value);
                })
                .attr("x2", function (d) {
                    return self.ctrlr.dimensions.width// self.ctrlr.scales.x.scale(new Date(d[self.ctrlr.parameters.x]));
                })
                .attr("y1", function (d,i) {
                    return self.ctrlr.scales.y.scale(d.label);
                })
                .attr("y2", (d,i) => {
                    return self.ctrlr.scales.y.scale(d.label);
                })
                .attr("fill", "none")
                .style("stroke", colours["gray"][1])
                .style("stroke-width", (d,i) => (i === 0) ? 0 : 1)
            ;

        // this.ctrlr.svg.gridNumbers
        //         .attr("x", (d, i) => {
        //             return ((self.ctrlr.scales.x.scale(new Date(data[i + 1][self.ctrlr.parameters.x])) - self.ctrlr.scales.x.scale(new Date(data[i][self.ctrlr.parameters.x]))) / 2) + self.ctrlr.scales.x.scale(new Date(data[i][self.ctrlr.parameters.x]))
        //         })
        //         .attr("y", this.ctrlr.dimensions.height  + 4) // - self.config.padding.bottom
        //         .attr("dy", 12)
        //         .attr("fill", colours.grey)
        //         .text( (d, i) => d[self.ctrlr.parameters.x])
        //         .style("text-anchor", "middle");

    }
}
