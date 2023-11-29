
import { Dimensions, IGraphConfig, IParameterMapping } from './types';
import { IChartDimensions } from './chart-dimensions'
import { ChartObject } from './chart-init-objects';
import { ISvgService } from './svg-service';
import { ScaleService } from './scale.service';
import { AxesService } from './axes.service';
import { SvgService } from './svg-service';
import { ChartDimensions } from './chart-dimensions';


// what about these? 
import { DataObject, EitiData, EitiReport } from "../../pages/shared/types";
import { IPageController } from '../../pages/shared/page.controller';
import { GroupObject, IGraphMappingV2 } from '../../pages/shared/interfaces';
import { HtmlPopup } from '../../pages/shared/html/html-popup';

export type IGraphControllerV3 = {

    page: IPageController, 
    group: GroupObject,
    svgWrapper?: HTMLElement,
    mapping: IGraphMappingV2,
    config: IGraphConfig,
    segment: string,
    dimensions: Dimensions,
    svg;
    chartDimensions : IChartDimensions

    init: () => void,
    _html: (groupEl : HTMLElement) => HTMLElement
    prepareData: (data: any) => void,
    draw: (data: any) => Promise<void>,
    redraw: (data?: any, range?: number[]) => Promise<void>
    update: (data: EitiData, segment: string, update: boolean, range?: number[]) => Promise<void>,

}

export class GraphControllerV3 implements IGraphControllerV3  {

    config : IGraphConfig;
    graphEl : HTMLElement | null;
    dimensions: Dimensions;
    svg: any;
    yScale;
    xScale;
    chartDimensions: IChartDimensions;
    svgService: ISvgService;
    scales: any;
    axes: any;
    htmlHeader;
    htmlSegment;
    element: HTMLElement | null;
    popup;
    preparedData: DataObject;

    constructor(
        public slug,
        public page,
        public group,
        public mapping,
        public segment
    ) {
     
        this.scales = {};
        this.axes = {};
        this.config = { margin: { top: 0, bottom: 0, left: 0, right: 0 }, padding: { top: 0, bottom: 0, left: 0, right: 0 }, scales: [], axes: [], extra: {} }
    }

    init() {

    }

    _init() {

        let self = this;
       
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

    _html (altWrapper?: HTMLElement) {

        this.element = (altWrapper == undefined )? window.d3.select(this.group.element).node() : window.d3.select(altWrapper).node()

        const graphEl = document.createElement('section');
        graphEl.classList.add("graph-container-12")
        graphEl.classList.add("graph-view")
        
        this.element.appendChild(graphEl);

        if (this.element != null && this.mapping.description && this.mapping.description !== '' ) {
            this.popup = new HtmlPopup(this.element,this.mapping.description);
        }

        return graphEl
    }

    async _svg(svgWrapper?: HTMLElement) {

        // with elementID we can create a child element as svg container with a fixed height. 
        this.element = window.d3.select(svgWrapper ? svgWrapper : this.element).node();

        if (this.element == null) return;
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

    async draw(data: DataObject) : Promise<void> {
        return;
    }


    prepareData(data: DataObject) : DataObject{
        return data;
    }

    async update(data: DataObject, segment: string, update: boolean) {
        return;
    }

    async _update(newData: DataObject, segment: string, update: boolean, range?: number[]) {

        let self = this;

        if (update && this.config.extra.noUpdate) { return; }

        if (this.popup && this.mapping.description) {
            this.popup.attachData(newData);
        }

        this.segment = segment;
                
        const data = self.prepareData(newData);
        // //  needed within multiples .. why ??? 
        this.preparedData = Object.assign({}, data);

        await self.draw(this.preparedData);
        await self.redraw(this.preparedData,range);
        window.addEventListener("resize", () => self.redraw(this.preparedData), false);

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