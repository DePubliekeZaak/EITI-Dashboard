// import * as d3 from 'd3';

import { breakpoints } from "../../img-modules/styleguide";


export class AxisArrow {

    line;
    lineEnter;

    constructor(
        public ctrlr : any,
        public axis: string,
        public description: string
    ){

        this.draw();    
    }

    

    draw() {

        const markerSize = 10;
        const arrowPoints : [number, number][] = [[0, 0], [0, markerSize], [markerSize, markerSize / 2]];

        this.ctrlr.svg.body.append("defs")
            .append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', [0, 0, markerSize, markerSize])
            .attr('refX', markerSize / 2)
            .attr('refY', markerSize / 2)
            .attr('markerWidth', markerSize)
            .attr('markerHeight', markerSize)
            .attr('orient', 'auto-start-reverse')
            .append('path')
            .attr('d', window.d3.line()(arrowPoints))
            .attr('stroke', 'black');

        this.ctrlr.svg.layers.axes
            .append("path")
            .attr("class", "arrow_" + this.axis)
            .attr('marker-end', 'url(#arrow)')
            ;
        
        this.ctrlr.svg.layers.axes
            .append("text")
            .attr("class", "label_" + this.axis)
            .style("font-size", window.innerWidth < breakpoints.xsm ? '.66rem' : '.85rem' )
            .text(this.description);
    }

    
    redraw() {

        let self = this;

        const position = this.ctrlr.axes[this.axis].config.position;
        const direction = this.ctrlr.scales[this.axis].config.direction;
        const arrowLength = 100;
        let path = ""; 
        let x = 0;
        let y = 0;

        
        if (direction === 'horizontal' ) {

            x = this.ctrlr.dimensions.graphWidth;
            y = this.ctrlr.dimensions.graphHeight + 36;

            path = 'M ' + (x - arrowLength) + ' ' + y + ' H ' + x;


        
        } else if (direction === 'vertical' && position === 'left' ){

            x = -45;
            y = 10;

            path = 'M ' + x + ' ' + arrowLength + ' V 0';

        } else if (direction === 'vertical' && position === 'right' ){

            x = this.ctrlr.dimensions.graphWidth + 45;
            y = 10;

            path = 'M ' + x + ' ' + arrowLength + ' V 0';
        } 

        
        this.ctrlr.svg.layers.axes.selectAll('path.arrow_' + this.axis)
            .attr("d", path)        
            .attr("fill", 'transparent')
            .attr("stroke", d => "black" )
            .attr("stroke-width", 1)
            // .attr("stroke-dasharray","2 4")
        ;

        this.ctrlr.svg.layers.axes.selectAll('text.label_' + this.axis)
            .attr("x", direction === 'horizontal' ? x - 8 : x - 2)  
            .attr("y", direction == 'horizontal' ? y + 16 : y - 30)              
            .attr("fill", 'black')
            .attr("text-anchor", d => direction === 'horizontal' || position == 'right' ? "end" : "start" )
        ;
    }
}
