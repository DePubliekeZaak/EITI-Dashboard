import * as d3 from 'd3';
import { colours } from '@local/styleguide';
import { Dimensions, DataPart, GraphData, Lines} from "@local/d3_types";
import { slugify } from '@local/d3-services/_helpers';



export class ChartLines {

    lines;
    lineEnter;
    lineLabels;

    constructor(
        public ctrlr : any,
        public yParameter: string,
        public colour: string
    ){
    }

    draw(data: Lines) {

        const yParameter = this.ctrlr.parameters[this.yParameter] != undefined ? this.ctrlr.parameters[this.yParameter] : this.yParameter;

        this.lines = this.ctrlr.svg.layers.data.selectAll('.line-' + yParameter)
            .data(data)
            .join("path")
            .attr("class", "line-" + yParameter);

        this.lineLabels = this.ctrlr.svg.layers.data.selectAll(".lineLabel")
            .data(data)
            .join('text')
            .attr('class', (d,i) => {    
                // console.log(d[0])            
                return 'lineLabel ' + slugify(d[0].label)
            })
            .attr('dx', '10px')
            .attr('dy', '0px')
            .style("text-anchor", "start")
            .style("fill", (d,i) => {

                switch(i) {

                    case 0: 
                        return colours["lightBlue"][0] 
                    case 1: 
                        return colours["blue"][0] 
                    case 2: 
                        return colours["orange"][0] 
                    default:
                        return colours["gray"][1] 
                }
                
            })
    }

    lineMaker() : d3.Line<[number, number]> {

     //   const yParameter = this.ctrlr.parameters[this.yParameter] != undefined ? this.ctrlr.parameters[this.yParameter] : this.yParameter;

        return d3.line()
            .x(d => this.ctrlr.scales.x.scale(d['time']  ))
            .y((d, i) => { 
                return this.ctrlr.scales.y.scale(d['value'])
            }) 
            .curve(d3.curveLinear);
    }

    redraw(dimensions: Dimensions) {

        let self = this;

        this.lines
            .transition()
            .duration(500)
            .attr("d", this.lineMaker())
            .attr("fill", 'transparent')
            .attr("stroke", (d,i) => {  

                switch(i) {

                    case 0: 
                        return colours["lightBlue"][0] 
                    case 1: 
                        return colours["blue"][0] 
                    case 2: 
                        return colours["orange"][0] 
                    default:
                        return colours["gray"][1] 
                }
                
                
            })
            .attr("stroke-width", 2)

            // .attr("stroke-dasharray","2 4")
        ;

        this.lines
            .on("mouseover", function (event: any, d: any) {

                const sel = d3.select(event.target);
                sel.raise();

                sel
                    .style("stroke", d => { return colours.orange[0] })
                    // .attr("stroke-width", 3);

                const l = d3.select('.lineLabel.' + slugify(d[0].label))
                
                l.raise();
                l.style("stroke",colours["orange"][0]);

                


            })
            .on("mouseout", function (event: any, d: any) {

                self.lines    
                    .style("stroke", d => colours[self.colour][1])
                    .attr("stroke-width", 2);

                self.lineLabels
                    .style("stroke", d => colours["gray"][1])
                // d3.select('.tooltip')
                //     // .transition()
                //     // .duration(250)
                //     .style("opacity", 0);


            })

        this.lineLabels
            .text( (d) => d[0].label)
            .attr('transform', (d,i) => {

                const y = d[0].value > 0 ? self.ctrlr.scales.y.fn(d[d.length - 1].value) : self.ctrlr.scales.y.fn(0)
                
                return 'translate(' + dimensions.width +  ',' + y + ')';
            })
            .attr('fill-opacity', (d,i) => {

                    return 1; // ( i === 0 ) ? 1 : 0
            
            });
        }


}
