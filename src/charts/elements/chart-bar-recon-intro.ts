import { convertToCurrency } from '@local/d3-services';
import { bePositive, slugify, thousands } from '@local/d3-services/_helpers';
import { DataPart, GraphData } from '@local/d3_types';
import { Bars } from '@local/d3_types/data';
import { breakpoints, colours} from "@local/styleguide";
import { join } from 'lodash';

interface ChartElement {
    draw: (data: Bars) => void,
    redraw: (data: Bars) => void
}

export class ChartBarReconIntroV1 implements ChartElement {

    diffGroup;
    barGroup;
    outcome;
    bar;
    arrow;
    circle;
    company;
    diffLabel;
    label;
    line;
    barExtensions;
    circleExtensions;

    constructor(
        public ctrlr,
    ){}

    draw(data: any) {

        if (this.barGroup) {
            this.barGroup.remove()
        }

        this.barGroup = this.ctrlr.svg.layers.data.selectAll(".bar_group")
            .data(data, (d) => slugify(d.label))
            .join("g")
            .attr("class","bar_group")
            
        this.bar = this.barGroup
            .append("rect")
            .attr("fill", (d,i) => colours[d.colour][1]);

        this.label = this.barGroup
            .append('text')
            .attr('dx', (d) => d.value > 0 ? 20 : -10)
            .attr('dy',  '28px')
            .style("text-anchor", (d) => d.value > 0 ? "start" : "end")
            .style("font-size", window.innerWidth < breakpoints.xsm ? '.85rem' : '1rem')
            ;

        this.diffGroup = this.ctrlr.svg.layers.data.selectAll(".diff_group")
            .data(["company","government","outcome"], (d) => d)
                .join("g")
                .attr("class","diff_group")
               

        this.circle = this.diffGroup
                .append("circle")
                .attr("fill", (d,i) => {

                    switch(d) {

                        case "company":
                            return colours["orange"][1];
                        case "government":
                            return colours["blue"][1];
                        case "outcome": 
                        return window.innerWidth < breakpoints.xsm ? "#fff" : "white";
                    }
                })

        this.circleExtensions = this.diffGroup
                .append("line")
                .attr("fill", "none")
                .style("stroke-width", 3)
                .attr("stroke", d => {

                    switch(d) {

                        case "company":
                            return colours["orange"][1];
                        case "government":
                            return colours["blue"][1];
                        case "outcome": 
                            return window.innerWidth < breakpoints.xsm ? "#fff" : "white";
                    }
                })

     
                
        this.diffLabel = this.diffGroup.append("text")
                .html( (d,i) => {

                    let diff: number

                    switch(d) {

                        case "government":
                            diff = Math.round((data[2].value - data[0].value) * 1000) / 1000;
                            return diff < 0 ? '+&euro;' + bePositive(diff).toString().replace(".",",")  + 'M' : '-&euro;' + bePositive(diff).toString().replace(".",",")  + 'M'
                        case "company":
                            diff = Math.round((data[3].value - data[1].value) * 1000) / 1000;
                            return diff < 0 ? '+&euro;' + bePositive(diff).toString().replace(".",",")  + 'M' : '-&euro;' + bePositive(diff).toString().replace(".",",")  + 'M'
                        case "outcome": 
                            diff = Math.round((data[0].value - data[1].value) * 1000) / 1000;

                            if (diff < 0) {
                                return '+&euro;' + bePositive(diff).toString().replace(".",",")  + 'M' 

                            } else if (diff == 0) {
                                return '0%';
                            } else {
                                return '-&euro;' + bePositive(diff).toString().replace(".",",")  + 'M'
                            }
                    }
                })
                .style("text-anchor", "middle")
                .attr('dy',  '5px')   
                .style("font-size", window.innerWidth < breakpoints.xsm ? '.85rem' : '1rem');
    }

    redraw(data: any) {

        let self = this;

        const barHeight = self.ctrlr.scales.y.scale.bandwidth();

        this.barGroup 
            .attr("transform", (d) => {
                const x = self.ctrlr.scales.x.fn(0);
                const y = self.ctrlr.scales.y.fn(slugify(d.label));
                return "translate(" + x + "," + y + ")"
            });
            
        this.bar
            .attr("height", (d) => barHeight) 
            .attr("x", (d)  => {
                if (d.value < 0) {
                    return (self.ctrlr.scales.x.fn(d.value) - self.ctrlr.scales.x.fn(0)) 
                } else { 
                    return 0; 
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
            .html( (d,i) => {

                const label = window.innerWidth < breakpoints.sm ? d.label.split(" ")[0] : d.label;
                return  label + " - &euro;" + thousands(Math.round(10 * d.value) / 10) + "M";
            })
            .attr('fill-opacity', 1);

        this.circle
            .attr("r", barHeight / 2)

        this.diffGroup
            .attr("transform", (d,i) => {

                let x: number;
                let y: number;

                if (d  == "outcome") {
                    x =  window.innerWidth < breakpoints.xsm ? self.ctrlr.scales.x.fn((data[0].value)) + 3 : self.ctrlr.scales.x.fn((data[0].value)) - barHeight + 20;
                    y = self.ctrlr.scales.y.fn(slugify(data[0].label))
                } else {
                    x = d == "company" ? this.ctrlr.dimensions.width + 40 : this.ctrlr.dimensions.width + 100;
                    y = -16 + (2 * barHeight * 1.125) + i * (barHeight * 1.125)
                }

                return "translate("+ x + "," + y + ")"
            });  

        this.circleExtensions
            .attr("x1", -1)
            .attr("x2", -1) 
            .attr("y1" , - barHeight - 8)
            .attr("y2",  barHeight + 5 )
            .filter(d => d == "outcome")
            .attr("y1" , -(barHeight / 1.25))
            .attr("y2",  (barHeight / 1.25 ) )
    }

}


