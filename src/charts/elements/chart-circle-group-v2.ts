import { convertToCurrency } from '@local/d3-services';
import { bePositive, convertToMillions } from '@local/d3-services/_helpers';
import * as _ from "lodash";
import { colours } from '@local/styleguide';

export class ChartCircleGroupsV2 {

    start = {};

    headerGroup;
    headerGroupEnter;
    headerLabels;

    group;
    groupEnter;

    headers_lines;

    balanceGroups
    circleWrapper;
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
            .data([groupedData])
            .join("g")
            .attr("class","headerGroup");

        this.balanceGroups = this.headerGroup
            .selectAll(".balanceGroup")
            .data( d => d)
            .join("g")
            .attr("class","balanceGroup");

        this.headerLabels = this.balanceGroups
            .append('text')
            .attr("text-anchor", (direction === 'horizontal') ? "middle" : "middle")
            .style("font-family", "RO Sans Regular")
            .style("font-size","1rem")
            .attr('dy', 0)
            .text( (d) => {

                let text;

                if (this.ctrlr.page.main.params.language == 'en') {
                    text = d[0].label == 'sales' ? 'Income' : 'Payments'
                } else {
                    text = d[0].label == 'sales' ? 'Ontvangsten' : 'Betalingen'
                }
                
                return text;
                
            })

        this.headers_lines = this.headerGroup
            .append("rect")
            .attr('width',1)
            .attr("fill","transparent")
            .attr("stroke-width", 1)
            .style("stroke-dasharray", "2 4")
            .style('stroke', '#ccc');
        //
      

        this.circleWrapper = this.balanceGroups
            .selectAll(".circleGroup")
            .data( d => d)
            .join("g")
            .attr("class","circleGroup");

        this.circles = this.circleWrapper
            .filter( d => d.label !== "netto")
            .filter( d => d.value !== 0)
            .append("circle")
            .attr("class","circle")
            .style("stroke", (d) =>  (d.value > 0) ? d.colour[0] : colours.gray[0])
            .style("fill", (d) => (d.value > 0) ? d.colour[1] : colours.gray[1])

        this.circlesText = this.circleWrapper
            .filter( d => d.label !== "netto")
            .filter( d => d.value !== 0)
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
            
            let html = '';

            for (const p of d.meta) {

                let line; 

                if (d.type == 'NAM') {
                     line = '<br/>' + p.project + ": " + convertToCurrency(p.payments_companies * 1000 * 1000);
                } else if (d.type == 'Overige deelnemers' && p.payment_stream == 'sales') {
                    line = '<br/>' + p.origin_name + ": " + convertToCurrency(p.payments_companies * 1000 * 1000);
                } else if (d.type == 'Overige deelnemers' && p.payment_stream == 'costs') {
                    line = '<br/>' + p.recipient_name + ": " + convertToCurrency(p.payments_companies * 1000 * 1000);
                }


                html = html.concat(line);
            }

            if (d.type == 'NAM') {


                html = html.concat('<div style="border-top:1px solid #fff;margin:3px 0; padding: 3px 0;">' + d.type + ': ' + convertToCurrency(d.value) + '</div>');

            } else if (d.type == 'Overige deelnemers') {

                const pText = self.ctrlr.page.main.params.language == 'en' ? 'Other members' : 'Overige deelnemers'

                html = html.concat('<div style="border-top:1px solid #fff;margin:3px 0; padding: 3px 0;">' + pText + ': ' + convertToCurrency(d.value) + '</div>');

            } else {


                html = html.concat('<div>' + d.type + ': ' + convertToCurrency(d.value) + '</div>');

            }


            return html;

        }

        this.headerGroup
            .attr("transform", (d) => {

                if(direction === 'horizontal') {
                    return "translate(" + self.ctrlr.dimensions.width / 2 + "," + self.ctrlr.config.padding.top + ")"
                } else {
                    return "translate(" + (this.ctrlr.dimensions.width / 2) + "," + (self.ctrlr.scales.x.scale(d[0].label) - 100) + ")"
                }
            });

        this.balanceGroups
            .attr("transform", (d,i) => {

                const offset = this.ctrlr.dimensions.width / 4

                if(i % 2 == 0) {

                    return "translate(" + -offset + "," + 0 + ")"
                } else {
                    return "translate(" + offset + "," + 0 + ")"
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
                    return this.ctrlr.scales.r.fn(d.value > 0 ? d.value : -d.value);
                })
                
                .on("mouseover", function(event: any, d: any) {

                    self.circles
                        .style("fill", (dd: any) => {

                            return (dd.value > 0) ? dd.colour[2] : colours.gray[1];
                        })
                        .style("stroke", (dd: any) => {
                            return (dd.value > 0) ? dd.colour[2] : colours.gray[2];
                        });

                    window.d3.select(event.target)
                        .style("fill", (dd: any) => dd.colour[1])
                        .style("stroke", (dd: any) => dd.colour[0])
                        ;

                    self.tooltip
                        .html(popup(d))
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY) + "px")
                        .transition()
                        .duration(250)
                        .style("opacity", 1);
                })
                .on("mouseout", function(d) {

                    self.circles
                        .style("fill", (dd: any) => dd.colour[1])
                        .style("stroke", (dd: any) => dd.colour[0])
                        ;

                    self.tooltip
                        .transition()
                        .duration(250)
                        .style("opacity", 0);
                })
            ;

        this.circlesText
            .text( d => convertToMillions(d.value));

        // this.nettoText
        //     .text( d => {

        //         const v = Math.round(d.value * 10) / 10
               
        //        return v > 0 ? "+" + convertToCurrency(v) : "-" + convertToCurrency(bePositive(v));
        //     })
        //     .style("font-size","1rem")
        //     .style("font-family","RO Sans Bold")
        //     .style("letter-spacing","1px")
        //     .attr("transform","translate(-20,100)")
    }

    forceDirect() {

        let self = this;

        const direction = this.ctrlr.scales.x.config.direction;

        // self.center 
  
        this.circleWrapper
            .attr("transform", (d,i) => {
                if(!isNaN(d.x)) { 
                    if (direction === 'horizontal') {


                        const offset = 0; // (d.label == 'sales') ? -100 : 100 

                        // console.log(d.x, d.y)

                        return "translate("  + (offset + (self.ctrlr.dimensions.width / 2 ) - d.x) + "," + (d.y ) + ")" 
                    } 
                }
            })
        ;
    }
}
