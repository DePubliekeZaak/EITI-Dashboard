import { colours } from "../../img-modules/styleguide";
import { toDutchMonths } from "../../pages/shared/_helpers";

export default class ChartStackedBars {

    bars;
    barsEnter;

    barLabels;
    barLabelsEnter;

    group;
    series;

    constructor(
        private ctrlr
    ){}

    draw(data) {

        const mapping = this.ctrlr.mapping ? this.ctrlr.mapping : this.ctrlr.graphObject.mapping;

        this.series = this.ctrlr.svg.layers.data.selectAll("g.serie")
            .data(data.stacked)
            .join("g")
            .attr("class", (d,i) => "serie " + mapping[0][i]['colour'])
            .attr("stroke", (d,i) => colours[mapping[0][i]['colour']][0])
            .attr("fill", (d,i) => colours[mapping[0][i]['colour']][1])

        this.bars = this.series.selectAll(".bar")
            .data(d => d)
            .join("rect")
            .attr("class", "bar")
        ;
    }

    redraw(data: any) {

        let self = this;

        const mapping = this.ctrlr.mapping ? this.ctrlr.mapping : this.ctrlr.graphObject.mapping;

        const width = self.ctrlr.dimensions.svgWidth / data.stacked[0].length - 1;

        this.bars
            .attr("x", (d: any, i: number)  => self.ctrlr.scales.x.scale(d.data["date"]))
            .attr("y", self.ctrlr.dimensions.height)
            .attr("height", 0)
            .attr("width", width)
            .transition()
            .duration(500)
            .attr("y", (d) => self.ctrlr.scales.y.scale(d[1]))
            .attr("height", (d, i) => {
                let h = self.ctrlr.scales.y.scale(d[0]) - self.ctrlr.scales.y.scale(d[1]);
                return h > 0 ? h : 0;
            })
        ;

        this.bars
            .on("mouseover", function (event:  any, d: any) {

            window.d3.select('.tooltip')
                .html(() => {

                    let html =  '<div>' + d.data.year + '</div>'; 
                    html +=  '<div>' + toDutchMonths(parseFloat(d.data.month)) + '</div>'; 

                    for (let map of mapping[0]) {

                        html +=  '<div>' + map.label + ' : ' + d.data[map.column] + '</div>'; 

                    }

                    if (data.line != undefined) {

                        let period = data.line.find( dd => dd.time == d.data.date);

                        if(period != undefined) {

                            for (let map of mapping[1]) {

                                html +=  '<div>' + map.label + ' : ' + Math.round(period.value) + '%</div>'; 

                            }
                        }

                    }

                    // for (let p of self.ctrlr.mapping.parameters[0]) {
                    //         html += p.short + ': ' + d.data[p.column] + '<br/>';
                    // }

                    // html += 'cummulatief' + ': ' + Math.round(d.data['percentage'] * 10) / 10 + '%<br/>';

                    return html;

                })
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY) + "px")
                .transition()
                .duration(250)
                .style("opacity", 1);
        })
        .on("mouseout", function (event: any, d: any, i: number) {

            window.d3.select(event.target)
                .attr("fill", "inherit")

            window.d3.select('.tooltip')
                .transition()
                .duration(250)
                .style("opacity", 0);
        });
    ;

    }
}


