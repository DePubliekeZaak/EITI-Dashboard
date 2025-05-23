import { convertToCurrency } from '@local/d3-services';
import { bePositive, convertToMillions } from '@local/d3-services/_helpers';
import { colours } from '@local/styleguide';
// import * as _ from "lodash";

export class ChartCircleGroupsV1 {

    start = {};

    headerGroup;
    headerGroupEnter;
    headerLabels;

    group;
    groupEnter;

    headers_lines;

    balanceGroups
    circleGroups;
    circleGroupsEnter;
    circles;
    circlesText;
    nettoText;

    center;
    tooltip;

    constructor(
        private ctrlr
    ) {
    }

    draw(groupedData) {



        let self = this;

        const direction = this.ctrlr.scales.x.config.direction;

        this.headerGroup = this.ctrlr.svg.layers.data.selectAll('.headerGroup')
            .data(groupedData)
            .join("g")
            .attr("class","headerGroup");

        this.group = this.ctrlr.svg.layers.data.selectAll('.group')
            .data(groupedData)
            .join("g")
            .attr("class","group");

        this.headerLabels = this.headerGroup
            .append('text')
            .attr("text-anchor", (direction === 'horizontal') ? "middle" : "middle")
            .style("font-family", "NotoSans Regular")
            .style("font-size",".8rem")
            .attr('dy', (d,i) => {

                if (direction === 'horizontal') {
                    return (i % 2 == 0) ? 0 : 0
                } else {
                    return 0;
                }
                
            })

            .text( (d) => d.label)

        this.headers_lines = this.headerGroup
            .append("rect")
            .attr('width',1)
            .attr("fill","transparent")
            .attr("stroke-width", 1)
            .style("stroke-dasharray", "2 4")
            .style('stroke', '#ccc');

        this.circleGroups = this.group
            .selectAll(".circleGroup")
            .data( d => d.group)
            .join("g")
            .attr("class","circleGroup");


        this.circleGroups.selectAll('circle,text')
            .remove();

        this.circles = this.circleGroups
            .filter( d => d.label !== "netto")
            .filter( d => d.value !== 0)
            .append("circle")
            .attr("class","circle")
            .style("stroke", (d) => {
                
                return d.value >= 0 ? d.colour[0] : colours.gray[0]
            })
            .style("fill", (d) => {
                
                return d.value >= 0 ? d.colour[1] : colours.gray[1]
            });

        this.circlesText = this.circleGroups
            .filter( d => d.label !== "netto")
            .filter( d => d.value !== 0)
            .append("text")
            .attr("class","small-label")
            .attr("text-anchor","middle")
            .style("font-family", "NotoSans Regular")
            .style("fill","black")
            .style("font-size",".8rem");

        this.nettoText = this.circleGroups
            .filter( d => d.label == "netto")
            .append("text")
            .attr("class","small-label")
            .attr("text-anchor","middle")
            .style("font-family", "NotoSans Regular")
            .style("fill","black")
            .style("font-size",".8rem");

        let groupWidth = this.ctrlr.dimensions.width / groupedData.length;
        this.center = {x: (groupWidth / 2) , y: ((this.ctrlr.dimensions.height * .85) + 48) };

    }

    redraw(groupedData) {

        let self = this;

        const direction = this.ctrlr.scales.x.config.direction;

        let groupWidth = this.ctrlr.dimensions.width / groupedData.length;
        this.center = {x: (groupWidth / 2) , y: ((this.ctrlr.dimensions.height / 2) + 48) };
        this.tooltip = window.d3.select('.tooltip');

        let popup = function popup(d) {
            return d.label == 'sales' ?  'Ontvangsten' + '<br/>' +  convertToCurrency(d.value) : 'Betalingen' + '<br/>' +  convertToCurrency(d.value);
        } 

        this.headerGroup
            .attr("transform", (d) => {

                if(direction === 'horizontal') {

                    return "translate(" + self.ctrlr.scales.x.scale(d.label.toString()) + "," + self.ctrlr.config.padding.top + ")"
                } else {
                    return "translate(" + (this.ctrlr.dimensions.width / 2) + "," + (self.ctrlr.scales.x.scale(d.label) - 100) + ")"
                }
            });

        this.group 
            .attr("transform", (d) => {

                if(direction === 'horizontal') {

                    return "translate(" + self.ctrlr.scales.x.scale(d.label.toString()) + "," + 0 + ")"
                } else {
                    return "translate(" + (this.ctrlr.dimensions.width / 2) + "," + (self.ctrlr.scales.x.scale(d.label) - 100) + ")"
                }
            });
            

        this.headers_lines
            .attr('height', (d,i) => {

                if(direction === 'horizontal') {
                    return (i % 2 == 0) ? self.ctrlr.dimensions.height - 154 : self.ctrlr.dimensions.height - 154;
                } else {
                    return 0;
                }
            })
            .attr('y', (d,i) => {
                return (i % 2 == 0) ? 10 : 10;  // - (rScale(d.value) + 50);
            });

            this.circles
                .attr("r", (d) => {
                    
                    return  d.value >= 0 ? this.ctrlr.scales.r.fn(d.value) : this.ctrlr.scales.r.fn(-d.value)
                })       
                .on("mouseover", function(event: any, d: any) {

                    self.tooltip
                        .html(popup(d))
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY) + "px")
                        .transition()
                        .duration(250)
                        .style("opacity", 1);
                })
                .on("mouseout", function(d) {

                    self.tooltip
                        .transition()
                        .duration(250)
                        .style("opacity", 0);
                })
            ;

        this.circlesText
            .text( d => convertToMillions(d.value));

        this.nettoText
            .text( d => {

                const v = Math.round(d.value * 10) / 10
               
               return v > 0 ? "+" + convertToCurrency(v) : "-" + convertToCurrency(bePositive(v));
            })
            .style("font-size","1rem")
            .style("font-family","RO Sans Bold")
            .style("letter-spacing","1px")
            .attr("transform","translate(0,260)")
    }

    forceDirect() {

        let self = this;

        const direction = this.ctrlr.scales.x.config.direction;

        self.center 
  
        this.circleGroups
            .attr("transform", (d,i) => {
                if(!isNaN(d.x)) { 
                    if (direction === 'horizontal') {

                        const offset = 0; // (d.label == 'sales') ? -100 : 100 
                        return "translate("  + (offset + (self.ctrlr.dimensions.width / 2 ) - d.x) + "," + (d.y ) + ")" 
                    } 
                }
            })
        ;
    }
}
