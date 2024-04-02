import { colours } from "../../img-modules/styleguide";
import { convertToCurrency } from "../../pages/shared/_helpers";
import { PiePart } from "../../pages/shared/types_graphs";

export class ChartPieV1 {

    constructor(
        private ctrlr
    ){}

    draw(data: PiePart[]) {

        const config = this.ctrlr.config ? this.ctrlr.config : this.ctrlr.graphObject.config;

        let self = this;

        let pie = window.d3.pie();

        let parts = pie(data.map( d => d.value));

        this.ctrlr.svg.arcs = this.ctrlr.svg.layers.data.selectAll(".arc")
            .data(parts)
            .join("path")
            .attr("class", "arc")
            .attr("fill", (d: any, i: number) => colours[data[i].colour][1])
            .attr("stroke", (d: any, i: number) => colours[data[i].colour][0])
            .attr("stroke-width", "1px")
            .on("mouseover", function (event: any, d: any, ii: number) {

                const o = data.find( (e) => e.value == d.value);

                if(o != undefined) {

                    // self.ctrlr.svg.arcs
                    //     .attr("fill", (dd: any, i: number) => {
                    //         return colours[data[i].colour][2]
                    //     });

                    window.d3.select(event.target)
                        .attr("fill", (dd: any, i: number) => {
                            return colours[o.colour][0];
                        });

                 
                    window.d3.select('.tooltip')
                        .html((dd: any, i: number) => {
            
                            let value = (self.ctrlr.mapping[0][0].format === 'currency') ? convertToCurrency(d['value']) : d['value'];
                            if (o == undefined) return;

                            return '<b>' + o['label'] + '</b><br/>' + value;
                        })
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY) + "px")
                        .transition()
                        .duration(250)
                        .style("opacity", 1);

                }
            })
            .on("mouseout", function (event: any, d: any) {

                self.ctrlr.svg.arcs
                    .attr("fill", (dd:any, i: number) => colours[data[i].colour][1]);

                window.d3.select('.tooltip')
                    .transition()
                    .duration(250)
                    .style("opacity", 0);
            });
    }

    redraw() {

        let radius, arc, labelArc, innerRadius;

        const config = this.ctrlr.config ? this.ctrlr.config : this.ctrlr.graphObject.config;

        if(window.innerWidth < 700) {

            radius = 90;
            innerRadius = 20;

            this.ctrlr.svg.layers.data
                .attr("transform", "translate(" + (this.ctrlr.dimensions.width / 2) + "," + 100 + ")");

            labelArc = window.d3.arc()
                .outerRadius(radius - 0)
                .innerRadius(radius - 0);

            arc = window.d3.arc()
                .outerRadius(radius - 0)
                .innerRadius(innerRadius)
                .padAngle(4)
                .padRadius(4);

        } else {

            innerRadius = (config.extra.innerRadius !== undefined) ? config.extra.innerRadius : 30;

            let offset =  ( config.extra.maxRadius) ; //  + (this.ctrlr.dimensions.width - config.extra.maxRadius) / 2;

            this.ctrlr.svg.layers.data
                .attr("transform", "translate(" + offset + "," + ((config.extra.maxRadius) + 20) + ")");

            radius = this.ctrlr.dimensions.svgWidth / 3;

            if(radius > (config.extra.maxRadius)) {
                radius = config.extra.maxRadius;
            }

            labelArc = window.d3.arc()
                .outerRadius(config.extra.maxRadius)
                .innerRadius(config.extra.maxRadius);

            arc = window.d3.arc()
                .outerRadius(config.extra.maxRadius)
                .innerRadius(config.extra.innerRadius)
                .padAngle(4)
                .padRadius(4);
        }

        function arcTween(a) {
            var i = window.d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) {
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

    drawPercentages(data) {

        this.ctrlr.svg.percentageGroup = this.ctrlr.svg.layers.data.selectAll('g.percentage')
            .data(data.percentages)
            .join("g")
            .attr("class", "percentage");

        this.ctrlr.svg.percentageGroup
            .append("text")
            .text( d => d.value + "%")
            .style("font-family", "Sora, sans-serif")
            .style("font-weight", "500")
            .style("line-height", "1")
            .style("font-size", "2.8rem")

        this.ctrlr.svg.percentageGroup
            .append("text")
            .text( d => d.label)
            .attr("dy", 24);
    }

    redrawPercentages() {

        this.ctrlr.svg.layers.data.select('g.percentage')
            
        this.ctrlr.svg.percentageGroup
            .attr("transform", (d,i) => {

                const x = this.ctrlr.config.extra.maxRadius * .33;
                const y = this.ctrlr.config.extra.maxRadius * .33

                return `translate(${x},${y})`;
            })
    }
}
