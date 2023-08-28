import { convertToCurrency } from '@local/d3-services';
import { slugify } from '@local/d3-services';
import { DataPart, GraphData } from '@local/d3_types';
import { Bars } from '@local/d3_types';
import { colours} from "@local/styleguide";
import { join } from 'lodash';

//const groupHeight = 240;
// const barHeight = 40;

interface ChartElement {

    draw: (data: Bars) => void,
    redraw: (data: Bars) => void
}

export class ChartBarReconciliationV3 implements ChartElement {

    barGroup;
    outcome;
    bar;
    arrow;
    company;

    label;

    constructor(
        public ctrlr,
    ){}

    draw(data: Bars) {

        if (this.barGroup) {
            this.barGroup.remove()
        }

        this.barGroup = this.ctrlr.svg.layers.data.selectAll(".bar_group")
            .data(data, (d) => slugify(d.label))
            .join("g")
            .attr("class","bar_group")
            
        this.bar = this.barGroup
            .append("rect")
            .attr("fill", (d,i) => d.value > 0 ? colours['orange'][1] : colours['lightBlue'][1])
  
        this.label = this.barGroup
            .append('text')
            .attr('class','barLabel')
            .attr('dx', (d) => d.value > 0 ? 10 : -10)
            .attr('dy',  '24px')
            .style("text-anchor", (d) => d.value > 0 ? "start" : "end")
            ;

        this.company = this.ctrlr.svg.layers.data.selectAll(".company_label")
            .data(data, (d) => slugify(d.label))
            .join('text')
            .attr('class','company_label')
            .attr('dy',  '24px')
            .style("text-anchor", (d) => d.value > 0 ? "end" : "end")
    }

    redraw(data: Bars) {

        let self = this;

        const barHeight = self.ctrlr.scales.y.scale.bandwidth();

        this.barGroup 
            .attr("transform", (d) => {
                const x = self.ctrlr.scales.x.fn(0);
                const y = self.ctrlr.scales.y.fn(d.label);
                return "translate(" + x + "," + y + ")"
            });

        // this.outcome
        //     .attr("x1", (d) => self.ctrlr.scales.x.fn(d.value2))
        //     .attr("x2", (d) => self.ctrlr.scales.x.fn(d.value2))
        //     .attr("y1",(d) => self.ctrlr.scales.y.fn(d.label))
        //     .attr("y2",(d) => self.ctrlr.scales.y.fn(d.label) + self.ctrlr.scales.y.scale.bandwidth())

        // ;
            
        this.bar
            .attr("height", (d) => barHeight) // (this.ctrlr.config.extra.privacySensitive && d[self.ctrlr.parameters.y] < 25) ? 0 : self.ctrlr.dimensions.height - self.ctrlr.scales.y.fn(d[self.ctrlr.parameters.y]))
            .attr("x", (d)  => {
                if (d.value < 0) {
                    return (self.ctrlr.scales.x.fn(d.value) - self.ctrlr.scales.x.fn(0)) 
                } else { 
                    return 0; // (self.ctrlr.scales.x.fn(-(d.value)) - self.ctrlr.scales.x.fn(0))
                }
            })
            .attr("width", (d,i) =>  {
                if(d.value >= 0) {
                    const w = self.ctrlr.scales.x.fn(d.value) - self.ctrlr.scales.x.fn(0)
                    return w > 0 ? w : 0;
                } else {
                    const w = self.ctrlr.scales.x.fn(-(d.value)) - self.ctrlr.scales.x.fn(0);
                    return w > 0 ? w : 0;
                }
            })
        ;

        this.label
      //      .attr('x',(d) => this.ctrlr.scales.x.fn(0))
            .html( (d,i) => {

                if (d.value && d.format == "percentage") {
                    return (Math.round(10 * d.value) / 10) + '%';
                } else if (d.value) {
                    return '&euro;' + Math.round(d.value *10) / 10 + 'M'
                }
            })
            .attr('fill-opacity', 1)

        this.company
            .text( (d) => {
                return d.label
            })
            .attr("x",-40)
            .attr("y", (d) => this.ctrlr.scales.y.fn(d.label));

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


