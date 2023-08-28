import * as d3 from "d3";
import { colours,breakpoints } from '@local/styleguide';
import { convertToCurrency, slugify } from '@local/d3-services';
import { EitiData, GraphData } from "@local/d3_types";

export  class ChartMap   {
    projection;
    path;

    constructor(
        private ctrlr,
    ) {
        this.init();
    }


    init() {

        this.projection = d3.geoMercator();
        this.path = d3.geoPath()
            .projection(this.projection);

        var b = [
                [0.114, -1.101],
                [0.12022108488117365, -1.105]
            ],
            s = .02 / Math.max((b[1][0] - b[0][0]) / this.ctrlr.dimensions.svgWidth, (b[1][1] - b[0][1]) / this.ctrlr.dimensions.height),
            t = [((this.ctrlr.dimensions.svgWidth - s * (b[1][0] + b[0][0])) / 2) + 100, ((this.ctrlr.dimensions.height - s * (b[1][1] + b[0][1])) / 2)  - 60];

        this.projection
            .scale(s)
            .translate(t)
        ;
    }


    draw(data: GraphData) {
        
        let self = this;

        this.ctrlr.svg.map = this.ctrlr.svg.layers.data
            .append("g")
            .attr("class","netherlands")
            .selectAll("path.nl")
            .data(data[0])
            .join("path")
            .attr("class", (d: any, i: number) => 'nl ' + slugify(d.properties.name))
            .attr("d", this.path)
            .attr("fill", "#eee")
            .attr("stroke", "#ddd")
            ;

        this.ctrlr.svg.features = this.ctrlr.svg.layers.data
            .append("g")
            .attr("class","areas")
            .selectAll("path.area")
            .data(data[1])
            .join("path")
            .attr("class", (d: any, i: number) => 'area ' + slugify(d.properties.LICENCE_NM))
            .attr("d", this.path)
            .attr("fill", colours["orange"][1])
            .attr("stroke", colours["orange"][0])
            ;


        // this.ctrlr.svg.values = this.ctrlr.svg.layers.data.selectAll(".value")
        //     .data(features)
        //     .join("text")
        //     .attr("class", "value small-label")
        //     .attr("x", (d: any)  => (slugify(d.properties.gemeentenaam) === 'delfzijl') ? self.path.centroid(d)[0] + 20 : self.path.centroid(d)[0])
        //     .attr("y", (d: any) => (slugify(d.properties.gemeentenaam) === 'delfzijl') ? self.path.centroid(d)[1] + 20 : self.path.centroid(d)[1])
        //     .attr("text-anchor", "middle")
        //     .style("font-size",".66rem");
    }

    redraw(property,colour) {

        let self = this;

        this.ctrlr.svg.map
            .attr("fill", d => {
                const c = (colour) ? colour : d.properties.colour;
                return (property !== undefined && d.properties[property] > 0) ? (colours[c][0] || colours[c][0] ): '#eee'
            } )
            .attr("fill-opacity", (d) => (d.properties[property] > 0) ? this.ctrlr.scales.y.scale(d.properties[property]) : 1)
            .on("mouseover", function (event: any, d: any) {

                let html = "<div class='uppercase'>" + d.properties.gemeentenaam + "</div><div>" + d.properties[property] + "</div>";

                if (self.ctrlr.firstMapping.format === 'currency') {
                    html = "<div class='uppercase'>" + d.properties.gemeentenaam + "</div><div>" + convertToCurrency(d.properties[property]) + "</div>";
                } else if (self.ctrlr.firstMapping.format === 'percentage') {
                    html = "<div class='uppercase'>" + d.properties.gemeentenaam + "</div><div>" + d.properties[property] + "%</div>";
                }

                if(d.properties[property] && d.properties[property] > 0) {

                    d3.select(event.target)
                        .attr("fill-opacity", 1);

                    d3.select('.tooltip')
                        .html(html)
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 5) + "px")
                        .transition()
                        .duration(250)
                        .style("opacity", 1);
                }
            })
            .on("mouseout", function (event, d) {

                d3.select(event.target)
                    .attr("fill-opacity", (e: any) => (e.properties[property] > 0) ? self.ctrlr.scales.y.fn(d.properties[property]) : 1)

                d3.select('.tooltip')
                    .transition()
                    .duration(250)
                    .style("opacity", 0);
            });


            // this.ctrlr.svg.values
            //     .text(function (d) {

            //         if (window.innerWidth > breakpoints.sm && d.properties[property] > 0) {

            //             if (self.ctrlr.firstMapping.format === 'currency') {
            //                 return shortenCurrency(convertToCurrency(d.properties[property]));

            //             } else if (self.ctrlr.firstMapping.format === 'percentage') {

            //                 return parseInt(d.properties[property]).toString() + '%';
            //             } else {

            //                 return d.properties[property];
            //             }
            //         }
                // });

    }

    highlight(segment) {

        let self = this;

        this.ctrlr.svg.map
          //  .merge(this.ctrlr.svg.map)
            .attr("fill", d => {
                return (segment === d.properties.gemeenteSlug) ? colours['red'][0] : '#eee'
            } )

    }
}
