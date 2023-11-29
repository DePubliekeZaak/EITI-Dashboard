// import * as d3 from 'd3';
import { breakpoints, colours } from '@local/styleguide';
import { Dimensions, DataPart, GraphData} from "@local/d3_types";


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


        const direction = this.ctrlr.scales[this.axis].config.direction;
        const arrowLength = 100;
        let path = ""; 
        let x = 0;
        let y = 0;

        
        if (direction === 'horizontal' ) {

            x = this.ctrlr.dimensions.width;
            y = this.ctrlr.dimensions.height + 36;

            path = 'M ' + (x - arrowLength) + ' ' + y + ' H ' + x;


        
        } else if (direction === 'vertical' ){

            x = 0;
            y = 0;

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
            .attr("x", direction === 'horizontal' ? x - 8 : x + 12)  
            .attr("y", direction == 'horizontal' ? y + 16 : y + 4)              
            .attr("fill", 'black')
            .attr("text-anchor", d => direction === 'horizontal' ? "end" : "start" )
        ;
    }
}
