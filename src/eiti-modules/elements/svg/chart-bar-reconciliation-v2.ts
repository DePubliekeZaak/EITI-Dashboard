import { convertToCurrency } from '@local/d3-services';
import { slugify } from '@local/d3-services/_helpers';
import { DataPart, GraphData } from '@local/d3_types';
import { Bars } from '@local/d3_types/data';
import { colours} from "@local/styleguide";
import { join } from 'lodash';

// const groupHeight = 160;
// const barHeight = 40;

interface ChartElement {

    draw: (data: Bars) => void,
    redraw: (data: Bars) => void
}

export class ChartBarReconciliationV2 implements ChartElement {

    background;
    barGroup;
    outcome;
    bar;
    arrow;

    label;

    constructor(
        public ctrlr,
    ){}

    draw(data: Bars) {

        this.background = this.ctrlr.svg.layers.data
            .append("rect")
            .attr("fill","#eee")
            .attr("x",0)
            .attr("y",0);
            

        this.outcome = this.ctrlr.svg.layers.data.selectAll(".diff")
            .data(data)
            .join("rect")
            .attr("class", (d) => "diff " + slugify(d.label))
            .attr("fill", "#fff")

        this.barGroup = this.ctrlr.svg.layers.data.selectAll(".bar_group")
            .data(data)
            .join("g")
            .attr("class","bar_group")

        
         //   .style("stroke-width", 1)
            

        this.bar = this.barGroup
            .append("rect")
            .attr("fill", (d,i) => colours[d.colour][1])
        //    .attr("stroke", (d,i) => colours[d.colour][0])
        ;

        this.arrow = this.barGroup
            .append("path")
            .attr("d", (d) => {

                if(d.value > 0) {

                    return "M0 16 L-32 0 L-32 32 Z"

                } else if(d.value < 0) {

                    return "M0 16 L32 0 L32 32 Z";
                }
            })
            .attr("fill", (d,i) => colours[d.colour][1])
         //   .attr("stroke", (d,i) => colours[d.colour][0])
           

        ;

        this.label = this.barGroup
            .append('text')
            .attr('class','barLabel')
            // .attr('x', 0)
            .attr('dx', (d) => d.value > 0 ? -40 : 40)
            .attr('dy',  '21px')
            .style("text-anchor", (d) => d.value > 0 ? "end" : "start")
            ;
    }

    redraw(data: Bars) {

        let self = this;

        const barHeight = self.ctrlr.scales.y.scale.bandwidth() / 2;

        this.background
            .attr('height', this.ctrlr.dimensions.height)
            .attr('width', this.ctrlr.dimensions.width)

        this.barGroup 
            .attr("transform", (d) => {
                const x = self.ctrlr.scales.x.fn(d.value2);
                const y = d.type == "bedrijf" ? self.ctrlr.scales.y.fn(d.label) : self.ctrlr.scales.y.fn(d.label) +  barHeight;
                return "translate(" + x + "," + y + ")"
            });

        this.outcome
            .attr("height", (d) => barHeight * 2)
            .attr("width", (d) => {

                const p = self.ctrlr.scales.x.fn(d.value2);
                const z = self.ctrlr.scales.x.fn(0);

                return p > z ? p - z : z - p

              //  self.ctrlr.scales.x.fn(d.value2) - self.ctrlr.scales.x.fn(0)
                
            })
            .attr("x", (d) => {

                const p = self.ctrlr.scales.x.fn(d.value2);
                const z = self.ctrlr.scales.x.fn(0);

                return p > z ? z : p
                
            })
            .attr("y", (d,i) => self.ctrlr.scales.y.fn(d.label))
            // .attr("x2", (d) => self.ctrlr.scales.x.fn(d.value2))
            // .attr("y1",(d) => self.ctrlr.scales.y.fn(d.label))
            // .attr("y2",(d) => self.ctrlr.scales.y.fn(d.label) + self.ctrlr.scales.y.scale.bandwidth())

        ;
            
        this.bar
            .attr("height", (d) => barHeight) // (this.ctrlr.config.extra.privacySensitive && d[self.ctrlr.parameters.y] < 25) ? 0 : self.ctrlr.dimensions.height - self.ctrlr.scales.y.fn(d[self.ctrlr.parameters.y]))
            // .transition()
            // .duration(500)
            .attr("x", (d)  => {
                if (d.value >= 0) {
                    return -(self.ctrlr.scales.x.fn(d.value) - self.ctrlr.scales.x.fn(0)) 
                } else { 
                    return 31; // (self.ctrlr.scales.x.fn(-(d.value)) - self.ctrlr.scales.x.fn(0))
                }
            })
            .attr("width", (d,i) =>  {

                if(d.value >= 0) {

                    const w = self.ctrlr.scales.x.fn(d.value) - self.ctrlr.scales.x.fn(0) - 32

                    return w > 0 ? w : 0;
                
                
                } else {

                    const w = self.ctrlr.scales.x.fn(-(d.value)) - self.ctrlr.scales.x.fn(0) - 32;

                    return w > 0 ? w : 0;
                }
            })
        ;

        this.label
            .html( (d,i) => {

               

                if (d.value) {
                    
                    return (Math.round(10000 * d.value) / 10000) + '%';
                } else {
                    // return 'geen verschil';
                }
            })
            .attr('fill-opacity', 1)

        // if (this.ctrlr.index % 3 !== 0) {
        //     this.ctrlr.svg.body.selectAll("g.y-axis")
        //     .style("display","none")
        // } else  {

        // this.ctrlr.svg.body.selectAll("g.y-axis")
        //     .attr('transform', (d,i) => "translate(42,0)");

        // this.ctrlr.svg.body.selectAll("g.y-axis path")
        //     .style("display","none")

        // this.ctrlr.svg.body.selectAll("g.y-axis line")
        //     .style("display","none")

        // this.ctrlr.svg.body.selectAll("g.y-axis text")
        // .style("fill", colours["gray"][0])

        
    }
}


