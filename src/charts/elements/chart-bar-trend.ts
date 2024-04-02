
import { colours } from '../../img-modules/styleguide';
import { Bar, Bars } from '../../pages/shared/types_graphs';

export default class ChartBarTrend {

    constructor(
        private ctrlr
    ){
    }

    draw(data) {

        const group = this.ctrlr.svg.layers.data.selectAll("g." + data[0].type)
            .data([data[0].type])
            .join('g')
            .attr('class', d => d)

        const bars = group.selectAll(".bar")
            .data(data, d => d.label)
            .join("rect")
            .attr("class", "bar")
            .attr("fill", (d) => colours[d.colour][1])
        ;

    }

    redraw(data: Bars) {

        const group = this.ctrlr.svg.layers.data.selectAll("g." + data[0].type)
        const bars = group.selectAll(".bar")

        let self = this;

        let tooltip = function popup(d) {

              return `
                <div>maand ${d.meta._month}</div>
                <div>${d.meta._startdatum} t/m ${d.meta._einddatum}</div>
                <div>${d.value}</div>
              `;
          }

        let barWidth = this.ctrlr.dimensions.graphWidth / data.length - 1;

        bars
            .attr("x", (d: Bar, i: number)  => {
                const x =  self.ctrlr.scales.x.fn(d.label) // + (barWidth / 2)

                // if(isNaN(x)) {
                //     console.log(d);
                // }

                return x;
            })
            .attr("y", self.ctrlr.dimensions.graphHeight)
            .attr("height", 0)
            .attr("width", barWidth)
            .transition()
            .duration(500)
            .attr("y", (d) => self.ctrlr.scales.y.fn(d.value))
            .attr("height", (d) => { 
               
                const h = self.ctrlr.dimensions.graphHeight - self.ctrlr.scales.y.fn(d.value);
                return (h > 0) ? h : 0;
                
            })

        bars
            .on("mouseover", function(event: any, d: any) {

                self.ctrlr.svg.layers.data.selectAll(".bar")
                    .style("fill", b => (b !== d) ? colours[b.colour][1] : colours[b.colour][0]);

                window.d3.select('.tooltip')
                    .html(tooltip(d))
                    .style("left", (event.pageX - 20) + "px")
                    .style("top", (event.pageY - 0) + "px")
                    .transition()
                    .duration(250)
                    .style("opacity", 1);
            })
            .on("mouseout", (d) => {

                self.ctrlr.svg.layers.data.selectAll(".bar")
                    .style("fill", b => colours[b.colour][1]);

                window.d3.select('.tooltip')
                    .transition()
                    .duration(250)
                    .style("opacity", 0);
            })// add


        ;

    }
}


