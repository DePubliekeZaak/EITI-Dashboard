// import * as d3 from "d3";
import { colours } from '@local/styleguide'

export class ChartPie {

    data;

    constructor(
        private ctrlr
    ){}

    draw(data: any[]) {

        const config = this.ctrlr.config ? this.ctrlr.config : this.ctrlr.graphObject.config;

        let self = this;
        self.data = data;

        let pie = window.d3.pie()
            .sort(null)
            .value((d) => d['value']);


        this.ctrlr.svg.arcs = this.ctrlr.svg.layers.data.selectAll(".arc")
            .data(pie(data))
            .join("path")
            .attr("class", "arc")
            .attr("fill", (d: any) => colours[d.data.colour][1])
            .attr("stroke", (d: any) => colours[d.data.colour][0])
            .attr("stroke-width", "1px")
            .on("mouseover", function (event: any, d: any, array: any[]) {

                self.ctrlr.svg.arcs
                    .attr("fill", (dd: any) => colours[dd.data.colour][1]);

                window.d3.select(event.target)
                    .attr("fill", (dd: any) => colours[dd.data.colour][0]);
                 
                window.d3.select('.tooltip')
                    .html((dd: any) => {
        
                        let value =  d['value'];

                        return '<b>' + d['data']['label'] + '</b><br/>' + value;
                    })
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY) + "px")
                    .transition()
                    .duration(250)
                    .style("opacity", 1);
            })
            .on("mouseout", function (event: any, d: any) {

                self.ctrlr.svg.arcs
                    .attr("fill", (dd:any) => colours[dd.data.colour][1]);

                window.d3.select('.tooltip')
                    .transition()
                    .duration(250)
                    .style("opacity", 0);
            });
    }

    redraw() {

        let self = this;
        let arc, labelArc, innerRadius;

        const radius = this.ctrlr.r.scale(self.data[1].value)

        this.ctrlr.svg.layers.data
            .attr("transform","translate(" + this.ctrlr.dimensions.width / 2 + ", "  + this.ctrlr.dimensions.height   + ")");
       
        labelArc = window.d3.arc()
            .outerRadius(radius)
            .innerRadius(0);

        arc = window.d3.arc()
            .outerRadius(radius)
            .innerRadius(0)
            .padAngle(4)
            .padRadius(4);
        

        function arcTween(a) {

            var i = window.d3.interpolate(this._current, a);
            this._current = i(0);
            return (t) => {
                return arc(i(t));
            };
        }

        this.ctrlr.svg.arcs
            .transition()
            .duration(500)
            .attrTween("d", arcTween);


        this.ctrlr.svg.arcs.select('.arc')
            .attr("d", arc)
            .each(function(d) { this._current = d; });
    }
}
