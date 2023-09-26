// import * as d3 from "d3";
import { ChartObject, ISvgService, SvgService, ChartDimensions, ScaleService, AxesService, IChartDimensions } from './index';
import { Dimensions, DataPart, IGraphMapping, IMappingOption, IGraphConfig, IParameterMapping } from '@local/d3_types';
import { getParameter } from '@local/d3-services';
import { HtmlHeader, HtmlPopup, HtmlSegment } from '@local/elements';
import { EitiData, EitiReport, GraphData } from "@local/d3_types";
import { Lines } from "@local/d3_types";
import { Bars } from "@local/d3_types";

export type IGraphControllerV2 = {

    main: any, // main controller 
    data: EitiData,
    element: HTMLElement,
    svgWrapper?: HTMLElement,
    mapping: IGraphMapping,
    config: IGraphConfig,
    segment: string,
    dimensions: Dimensions,
    firstMapping: IMappingOption;
    svg;
    chartDimensions : IChartDimensions

    init: () => void,
    prepareData: (data: any) => void,
    draw: (data: any) => Promise<void>,
    redraw: (data?: GraphData, range?: number[]) => Promise<void>
    update: (data: EitiData, segment: string, update: boolean, range?: number[]) => Promise<void>,

}

export class GraphControllerV2 implements IGraphControllerV2  {

    config : IGraphConfig;
    dimensions: Dimensions;
    firstMapping: IMappingOption;
    svg: any;
    yScale;
    xScale;

    chartDimensions: IChartDimensions;
    svgService: ISvgService;

    scales: any;
    axes: any;
    parameters: any;

    htmlHeader;
    htmlSegment;

    popup;

    constructor(
        public main: any,
        public data : any,
        public element : HTMLElement,
        public mapping: IGraphMapping,
        public segment: string
    ) {
        this.element = window.d3.select(element).node();
        this.firstMapping = this.mapping.parameters[0] && this.mapping.parameters[0][0] ? getParameter(this.mapping,0) : false;
        this.parameters = {};
        this.scales = {};
        this.axes = {};
        this.config = { margin: { top: 0, bottom: 0, left: 0, right: 0 }, padding: { top: 0, bottom: 0, left: 0, right: 0 }, scales: [], axes: [], extra: {} }
    }

    init() {

    }

    async _init() {

        let self = this;

        // get parameters from mapping
        for (let p of this.mapping.parameters) {
            for (let m of p.filter( (p: IParameterMapping) => p.scale !== null) ) {
                this.parameters[m.scale] = m.column;
            }
        }
        // add .. overrule from config.scales
        for (let s of this.config.scales.filter( (s) => s.parameter && s.parameter != null)) {
            this.parameters[s.slug] = s.parameter;
        }

        if (this.mapping.description && this.mapping.description !== '' ) {
            this.popup = new HtmlPopup(this.element,this.mapping.description);
        }

        this.htmlSegment = new HtmlSegment(this.element);
       
        // if (this.mapping.header) {
        //     this.htmlHeader = new HtmlHeader(this.element, this.mapping.header != undefined ? this.mapping.header : this.firstMapping['label'],this.mapping.description);
        //     this.htmlHeader.draw(); 
        // }

        let chartObject = ChartObject();
        this.config = Object.assign(chartObject.config(),this.config);
        this.dimensions = chartObject.dimensions();
        this.svg = chartObject.svg();

        return;
 
    }

    async _svg(svgWrapper?: HTMLElement) {
        // with elementID we can create a child element as svg container with a fixed height. 
        this.element = window.d3.select(svgWrapper ? svgWrapper : this.element).node();
        this.chartDimensions = new ChartDimensions(this.element, this.config);
        this.dimensions = this.chartDimensions.measure(this.dimensions);

        this.svgService = new SvgService(this.element, this.config, this.dimensions, this.svg);

        for (let c of this.config.scales) {
            this.scales[c.slug] = new ScaleService(this,c);
        }

        for (let c of this.config.axes) {
            this.axes[c.slug] = new AxesService(this, c);
        }

        return;
    }

    async redraw(data?: any, range?: number[]) {

        if (this.svg && this.svg.body == undefined) return;

        this.dimensions = this.chartDimensions.measure(this.dimensions); 
        this.svgService.redraw(this.dimensions);

        if (this.config.scales) {
            for (let c of this.config.scales) {    
                this.scales[c.slug].reset()
            }
        }

        for (let a of this.config.axes) {
            this.axes[a.slug].redraw(this.dimensions,this.scales[a.scale].scale, data.slice)
        }

        return;
    }

    async draw(data: any) : Promise<void> {

        return;
    }


    prepareData(data: any) {

    }

    async update(data: EitiData, segment: string, update: boolean) {
        return;
    }

    async _update(newData: EitiData, segment: string, update: boolean, range?: number[]) {

        let self = this;

        if (update && this.config.extra.noUpdate) { return; }

        if (this.popup && this.mapping.description) {
            this.popup.attachData(newData);
        }

        this.segment = segment;

        let data = self.prepareData(newData);

        await self.draw(data);
        await self.redraw(data,range);
        window.addEventListener("resize", () => self.redraw(data), false);

        if(this.mapping.segmentIndicator) {
            this.htmlSegment.draw(segment);
        }

        return;
    }

    _addScale(slug: string, type: string, direction: string, parameter?: string) {

        this.config.scales.push({
            slug,
            type,
            direction,
            parameter
        })
    }

    _addAxis(slug: string, scale: string, position: string, format?: string, extra?: string, label?: string) {

        this.config.axes.push({
            slug,
            scale,
            position,
            format,
            extra,
            label
        })
    }

    _addMargin(top: number,bottom: number,left: number,right: number) {

        this.config.margin = {
            top,
            bottom,
            left,
            right
        }
    }

    _addPadding(top: number,bottom: number,left: number,right: number) {

        this.config.padding = {
            top,
            bottom,
            left,
            right
        }
    }
}