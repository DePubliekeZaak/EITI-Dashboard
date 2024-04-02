import { localTime } from './_formats';
import { convertToCurrency, convertToMillions } from '../../pages/shared/_helpers';
import { Dimensions } from './types';
import { DataPart } from '../../pages/shared/types';
import { breakpoints } from '../../img-modules/styleguide';
import { Bars } from '../../pages/shared/types_graphs';
export class AxesService {

    axis;
    axisGroup;

    constructor(
        private ctrlr,
        private config
    ) {
        this.draw();
    }

    draw () {

        this.axisGroup = this.ctrlr.svg.layers.axes.append("g");

        switch (this.config.position) {

            case 'bottom' :
            case 'belowBottom':

                this.axisGroup
                    .attr('class', 'x-axis');

                this.axis = window.d3.axisBottom(this.ctrlr.scales[this.config.scale]);

                break;

            case 'center' :

                this.axisGroup  
                    .attr('class', 'x-axis');

                this.axis = window.d3.axisBottom(this.ctrlr.scales[this.config.scale]);

                break;

            case 'top' :

                this.axisGroup
                    .attr('class', 'x-axis');

                this.axis =  window.d3.axisTop(this.ctrlr.scales[this.config.scale]);

                break;

            case 'left' :

                this.axisGroup
                    .attr('class', 'y-axis');

                this.axis = window.d3.axisLeft(this.ctrlr.scales[this.config.scale]);

                break;

            case 'right' :

                this.axisGroup
                    .attr('class', 'y-axis');

                this.axis = window.d3.axisRight(this.ctrlr.scales[this.config.scale]);

                break;

            default :

                return false;
        }
    }

    redraw(dimensions: Dimensions, scale: any, data: any[]) {

           switch (this.ctrlr.scales[this.config.scale].config.type) {

               case 'band' :

                    if(this.config.format == 'quarters') {

                        this.axis
                        .tickFormat( d => {
                            return d.slice(-2) == '01' ? d.slice(0,4) : ""
                        })

                    // } else if(this.config.format == 'short') {

                    //     this.axis
                    //     .tickFormat( (d,i) => {        
                    //         return data.find( a => a.label == d).meta.short
                    //     })

                    } else {

                        this.axis
                        .tickFormat( (d,i) => {        
                            return d
                        })
                    }
                   break;

               case 'linear' :

                    if (this.config.format === "percentage") {

                        this.axis
                        .ticks(5)
                        .tickFormat( d => d + "%")

                    } else if (this.config.format === "currency") {

                        this.axis
                        .ticks(4)
                        .tickFormat( d => convertToCurrency(d))

                    } else if (this.config.format === "millions") {

                            this.axis
                            .ticks(4)
                            .tickFormat( d => convertToMillions(d))

                    } else {

                        this.axis
                            .ticks(4)
                            .tickFormat( d => d.toString());
                    }

                   break;

                case 'log' :

                    this.axis
                        .ticks(4);

                   break;


               case 'time' :

                   let tickOrder, tickSpread;

                //    if(this.ctrlr.config.extra.xScaleTicks === 'quarterly') {

                       tickOrder = 'timeMonth';
                       tickSpread = (window.innerWidth < breakpoints.sm) ? 12 : 3;

                //    } else {

                //        tickOrder = this.ctrlr.config.extra.xScaleTicks;
                //        
                //    }

                   this.axis
                       .ticks(window.d3[tickOrder].every(tickSpread))
                       .tickFormat( date => (window.d3.timeYear(date) < date) ? localTime.format('%b')(date) : localTime.format('%Y')(date));

                   break;

               case 'bandTime' :

                   this.axis
                       .ticks(window.d3[this.ctrlr.config.extra.xScaleTicks].every(1))
                       .tickFormat( date => localTime.format('%d %b')(new Date(date)));
                   break;

               case 'stacked' :

                   this.axis
                       .ticks(10, "%");
                   break;

               case 'stackedNormalized' :

                   this.axis
                       .ticks(10, "%");
                   break;

               default :
           }

            switch (this.config.position) {

                case 'bottom' :

                    this.axisGroup
                        .attr("transform", "translate(" + 0 + "," + (dimensions.graphHeight) + ")")
                    break;

                case 'belowBottom' :

                    this.axisGroup
                        .attr("transform", "translate(" + 0 + "," + (dimensions.graphHeight + 0) + ")")
                    break;

                case 'top' :

                    this.axisGroup
                        .attr("transform", "translate(" + 0 + "," + 0 + ")");
                    break;

                case 'left' :

                    this.axisGroup
                        .attr("transform", "translate(" + 0 + "," + 0 + ")");
                    break;

                case 'right' :

                    this.axisGroup
                        .attr("transform", "translate(" + (dimensions.graphWidth + this.ctrlr.config.padding.right) + "," + 0 + ")");
                    break;

                default :
            }

            this.axisGroup
                .transition()
                .duration(1000)
                .call(this.axis.scale(scale));

            if(this.ctrlr.mapping.args && this.ctrlr.mapping.args[0] === "alternateTicks") {

                if (window.innerWidth < breakpoints.sm) {

                    this.ctrlr.svg.layers.axes.selectAll("g.x-axis g.tick text")
                    .attr("text-anchor","end")
                    .attr("transform","translate(-10,0) rotate(-45)")
                    // .attr("dy", (d,i) => {
                    //     return (i % 2 == 0 ) ? 16 : 32
                    // } );


                } else {

                    this.ctrlr.svg.layers.axes.selectAll("g.x-axis g.tick text")
                    .attr("dy", (d,i) => {
                        return (i % 2 == 0 ) ? 16 : 32
                    } );
                }

                
            }

            if(['weekly','monthly','quarterly','yearly'].indexOf(this.config.format) > -1) {

                const offset = (this.ctrlr.dimensions.width / data.length) / 2;

                this.ctrlr.svg.layers.axes.selectAll("g.x-axis g.tick text")
                    .attr("dx", offset);

                this.ctrlr.svg.layers.axes.selectAll("g.x-axis g.tick line")
                    .attr("x1", offset)
                    .attr("x2", offset)
                ;
            }
    }
}

