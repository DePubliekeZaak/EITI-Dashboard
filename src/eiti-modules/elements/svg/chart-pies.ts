// import * as d3 from "d3";
import { colours } from '@local/styleguide'

export class ChartPies {

    constructor(
        private ctrlr
    ){}

    draw(data: any[][]) {

        console.log(data);

        const config = this.ctrlr.config ? this.ctrlr.config : this.ctrlr.graphObject.config;

        let self = this;

        let pie = window.d3.pie()
            .sort(null)
            .value((d) => d['value']);

        this.ctrlr.svg.pies =  this.ctrlr.svg.layers.data.selectAll("g.pie")
            .data(data)
            .join("g")
            .attr("class", "pie");

        this.ctrlr.svg.labels =  this.ctrlr.svg.pies
            .append("text")
            .text((d) => d.year)
            .attr("text-anchor","middle");

        // this.ctrlr.svg.arcs = this.ctrlr.svg.pies
        //     .data( (d) => pie(d), (d => d.data.label))
        //     .join("path")
        //     .attr("class", "arc")
        //     .attr("fill", (d: any) => colours[d.data.colour][1])
        //     .attr("stroke", (d: any) => colours[d.data.colour][0])
        //     .attr("stroke-width", "1px")
        //     .on("mouseover", function (event: any, d: any, array: any[]) {

        //         self.ctrlr.svg.arcs
        //             .attr("fill", (dd: any) => colours[dd.data.colour][1]);

        //         d3.select(event.target)
        //             .attr("fill", (dd: any) => colours[dd.data.colour][0]);
                 
        //         d3.select('.tooltip')
        //             .html((dd: any) => {
        
        //                 let value =  d['value'];

        //                 return '<b>' + d['data']['label'] + '</b><br/>' + value;
        //             })
        //             .style("left", (event.pageX) + "px")
        //             .style("top", (event.pageY) + "px")
        //             .transition()
        //             .duration(250)
        //             .style("opacity", 1);
        //     })
        //     .on("mouseout", function (event: any, d: any) {

        //         self.ctrlr.svg.arcs
        //             .attr("fill", (dd:any) => colours[dd.data.colour][1]);

        //         d3.select('.tooltip')
        //             .transition()
        //             .duration(250)
        //             .style("opacity", 0);
        //     });
    }

    redraw() {

        let radius, arc, labelArc, innerRadius;

        const config = this.ctrlr.config ? this.ctrlr.config : this.ctrlr.graphObject.config;

        this.ctrlr.svg.pies
            .attr("transform", (d) => {

                const x = this.ctrlr.scales.x.scale(d.year);
                const y = 0;
                
                return "translate(" + x + "," + y + ")";

            });



        // if(window.innerWidth < 700) {

        //     radius = 90;
        //     innerRadius = 20;

        //     this.ctrlr.svg.layers.data
        //         .attr("transform", "translate(" + (this.ctrlr.dimensions.width / 2) + "," + 100 + ")");

        //     labelArc = d3.arc()
        //         .outerRadius(radius - 0)
        //         .innerRadius(radius - 0);

        //     arc = d3.arc()
        //         .outerRadius(radius - 0)
        //         .innerRadius(innerRadius)
        //         .padAngle(4)
        //         .padRadius(4);

        // } else {

        //     innerRadius = (config.extra.innerRadius !== undefined) ? config.extra.innerRadius : 30;

        //     let offset = ( config.extra.maxRadius / 2)  + (this.ctrlr.dimensions.width - config.extra.maxRadius) / 2;

        //     this.ctrlr.svg.layers.data
        //         .attr("transform", "translate(" + offset + "," + ((config.extra.maxRadius) + 20) + ")");

        //     radius = this.ctrlr.dimensions.svgWidth / 3;

        //     if(radius > (config.extra.maxRadius)) {
        //         radius = config.extra.maxRadius;
        //     }

        //     labelArc = d3.arc()
        //         .outerRadius(config.extra.maxRadius)
        //         .innerRadius(config.extra.maxRadius);

        //     arc = d3.arc()
        //         .outerRadius(config.extra.maxRadius)
        //         .innerRadius(config.extra.innerRadius)
        //         .padAngle(4)
        //         .padRadius(4);
        // }

        function arcTween(a) {

            var i = window.d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) {
                return arc(i(t));
            };
        }

        // this.ctrlr.svg.arcs
        //     .transition()
        //     .duration(500)
        //     .attrTween("d", arcTween);


        // this.ctrlr.svg.arcs.select('.arc')
        //     .attr("d", arc)
        //     .each(function(d) { this._current = d; });
    }
}
