import { Dimensions, IGraphConfig } from './types';
// import * as d3 from 'd3';

export interface ISvgService {

    element: HTMLElement,
    config: IGraphConfig,
    dimensions: Dimensions,
    svg: SVGAElement,
    render: () => void,
    redraw: (dimensions: Dimensions) => void,
    layers: () => void

}

export class SvgService implements ISvgService {

    constructor(
        public element,
        public config,
        public dimensions,
        public svg
    ) {
        this.render();
        this.layers();
    }


    render() {

        this.svg.body = window.d3.select(this.element)
            .append('svg')
            .style('overflow','visible')
            .style('margin-bottom', this.config.padding.bottom)
            .style('margin-top', this.config.padding.top)
            .style('margin-left', this.config.padding.left + "px")
            .style('margin-right', this.config.padding.right + "px")
    }

    redraw(dimensions) {

        // console.log(dimensions)

        this.svg.body
            .attr('height', dimensions.svgHeight)
            .attr('width', dimensions.svgWidth);
          //  .attr('transform', 'translate(' + this.config.margin.left + ',' + this.config.margin.top + ')')

    
    }

    layers() {

        this.svg.layers.underData = this.svg.body.append('g')
            .attr('class', 'under_data')
            .attr('transform', 'translate(' + (this.config.padding.left) + ',' + (this.config.padding.top) + ')');

        this.svg.layers.data = this.svg.body.append('g')
            .attr('class', 'data')
            .attr('transform', 'translate(' + (this.config.padding.left) + ',' + (this.config.padding.top) + ')');

        this.svg.layers.axes = this.svg.body.append('g')
            .attr('class', 'axes')
            .attr('transform', 'translate(' + (this.config.padding.left) + ',' + (this.config.padding.top) + ')');

        // separate svg?
        this.svg.layers.legend = this.svg.body.append('g')
            .attr('class', 'legend');
    }
}



