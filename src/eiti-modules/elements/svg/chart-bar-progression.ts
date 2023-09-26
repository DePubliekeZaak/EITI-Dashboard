import { convertToCurrency, convertToMillions, slugify, thousands } from '@local/d3-services';
import { Dimensions } from '@local/d3_types';
import { Bars } from '@local/d3_types';
import { breakpoints, colourArray, colours} from "@local/styleguide";
// import * as d3 from 'd3';


const groupHeight = 320;

interface ChartElement {

    draw: (data: Bars) => void,
    redraw: (data: Bars) => void
}

export class ChartBarProgression   {

    data;
    bars;
    barLabels;
    tooltipArray: string[] = [];

    constructor(
        private ctrlr
    ){
      
    }

    draw(data: Bars) {

        this.data = data;


        this.bars = this.ctrlr.svg.layers.data.selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", d => "bar " + slugify(d.label))
            .attr("fill", (d,i) => d.colour[1])
            .attr("stroke", (d,i) => d.colour[0])
        ;


        this.barLabels = this.ctrlr.svg.layers.data.selectAll(".barLabel")
            .data(data)
            .join('text')
            .attr('class','barLabel')
            .attr('dx', '0px')
            .attr('dy', '-10px')
            .style("text-anchor", "middle")
            ;
    
    }

    redraw(dimensions: Dimensions) {

        let self = this;

        // console.log(this.ctrlr.scales.y.range());
        // console.log(this.ctrlr.scales.y.domain());

        this.bars
            .attr("x", (d)  => self.ctrlr.scales.x.fn(d.year))
            .attr("width", (d,i) =>  self.ctrlr.scales.x.scale.bandwidth())
            .attr("y", (d,i) => self.ctrlr.scales.y.fn(d.dy + d.y)) 
            .attr("height", (d) => dimensions.height - self.ctrlr.scales.y.fn(d.dy))
        ;

        this.bars
            .on("mouseover", function (event: any, d: any) {
                    
                let html = '<b>' + d.label +  '</b>';

                if(d.meta.def_nl !== null) {
                    html = html.concat('<div>' + d.meta.def_nl +  '</div>');
                }
                if(d.meta.code !== null) {
                    html = html.concat('<div>GFS code:' + d.meta.code +  '</div>');
                }
                    
                html = html.concat('<div>Bedrag: &euro;' + thousands(d.dy) + '</div>');
                
                window.d3.select('.tooltip') 
                    .html(html)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 5) + "px")
                    .style("opacity", 1);

                self.tooltipArray.push(d.label);

            })
            .on("mouseout", function (event: any, d: any) {
               
                // only if has not immerdiately entered a new one 

                const index = self.tooltipArray.indexOf(d.label);
                
               if (index > -1) {
                   self.tooltipArray.splice(index,1)
               }

               setTimeout( () => {

                    if(self.tooltipArray.length == 0) {
                        window.d3.select('.tooltip')
                            .transition()
                            .duration(250)
                            .style("opacity", 0);
                    }

                },250);
        })

        this.barLabels
            .filter( (d,i) => {

                    if (i  == this.data.length - 1) {
                        return d;
                    }

                    if(this.data[i].year !=this.data[i + 1].year ) {
                        return d;
                    }

                // return || 
            })
            .html( (d,i,o) => {
                return window.innerWidth > breakpoints.sm ? convertToCurrency(d.dy + d.y) : convertToMillions(d.dy + d.y);
            })
            .attr('opacity', 0)
            .attr('transform', (d,i) => {

                const x = self.ctrlr.scales.x.fn(d.year) + self.ctrlr.scales.x.bandwidth()  / 2;
                const y = self.ctrlr.scales.y.fn(d.dy + d.y);
                
                return 'translate(' + (0 + x) + ',' +
                    (0 + y)
                    + ')';
            })
            .transition()
            .delay(500)
            
            .attr('opacity', 1)

    }
}


