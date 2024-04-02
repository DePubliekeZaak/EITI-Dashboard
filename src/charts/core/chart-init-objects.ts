// import * as d3 from 'd3';
import { colours } from "../../img-modules/styleguide/colours";

export const ChartObject = () =>  {

    let config = function config() {

        return {
            margin: { // space around chart
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            },
            padding: { // room for axis
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }
        };
    }

    let dimensions = function dimensions() {

        return {
            svgWidth: 0, // width of element minus config.margin
            graphWidth : 0, // svgWidth minus config.padding
            svgHeight: this.config.graphHeight != undefined ? this.config.graphHeight : 0, // height of element minus config.margin
            graphHeight : 0, // svgHeight minus config.padding
        }

    }

    let svg = function svg(){

        let tooltip = document.createElement('span');
        tooltip.role = "tooltip";
        tooltip.classList.add('tooltip');

        return {
            body : null,
            layers : {},
            tooltip : (document.querySelector('.tooltip')) ? window.d3.select(".tooltip") : document.querySelector('body')?.appendChild(tooltip),
            yAxis : null,
            xAxis : null
        }
    }

    return {
        config : config,
        dimensions : dimensions,
        svg : svg,
    }
}



