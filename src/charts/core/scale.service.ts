// import * as d3 from 'd3';
import { IScale } from './types';
import { IGraphControllerV3 } from './graph-v3';

export interface IScaleService {

    set: (data:any, minValue?: number) => any,
    reset: () => any,
}

export class ScaleService implements IScaleService{

    dataLength;
    scale;

    constructor(

        private ctrlr: IGraphControllerV3,
        private config : IScale,

    ) {
        this.dataLength = 0;
    }

    set(data, minValue) {

        if(!this.config.type) return;

        const self = this;

        this.dataLength = data.length;

        const min = window.d3.min(data.filter( v => !isNaN(v)));
        const max = window.d3.max(data.filter( v => !isNaN(v)));

        switch(this.config.type) {

            case 'linear':
                if (min == undefined || max == undefined) return;
                this.scale = window.d3.scaleLinear().domain([parseFloat(min),parseFloat(max)]);
                break;

            case 'log':

                if (min == undefined || max == undefined) return;
                this.scale = window.d3.scaleLog().domain([1,parseFloat(max)]);
                break;

            case 'log1000':

                if (min == undefined || max == undefined) return;
                this.scale = window.d3.scaleLog().domain([100000,parseFloat(max)]);
                break;

            case 'radius':

                if (min == undefined || max == undefined) return;
                this.scale = window.d3.scalePow().domain([parseFloat(min),parseFloat(max)]).nice();
                break;

            case 'time':

                // if (min == undefined || max == undefined) return;
                this.scale = window.d3.scaleTime().domain([new Date(data[data.length - 1]),new Date(data[0])]);
                break;

            case 'band':

                if(self.ctrlr.config.paddingInner == undefined || self.ctrlr.config.paddingOuter == undefined) return;

                this.scale = window.d3.scaleBand()
                    .domain(data)
                    .paddingInner(self.ctrlr.config.paddingInner)
                    .paddingOuter(self.ctrlr.config.paddingOuter)
                    .align(.5);

                break;


            case 'bandTime':

                this.scale = window.d3.scaleBand()
                    .domain(data)
                    .paddingInner(.2)
                    .paddingOuter(.5)
                    .align(.5)

                break;

            

            case 'normalised':

                this.scale = window.d3.scaleLinear();

                break;
        }

        return this.scale;
    }


    reset() {

        if (!this.config.type) return;

        if(this.scale.domain().length < 2) {
            // console.log(this.config + this.scale.domain())
        }

        switch(this.config.direction) {

            case 'horizontal':

                this.scale
                    .range([0, this.ctrlr.dimensions.graphWidth]);

                break;

            case 'horizontal-reverse':

                    this.scale
                        .range([this.ctrlr.dimensions.graphWidth,0]);
    
                    break;

            case 'vertical-reverse':

                this.scale
                    .range([0,this.ctrlr.dimensions.graphHeight]);

                break;

            case 'vertical':
                this.scale
                    .range([this.ctrlr.dimensions.graphHeight, 0]);

                break;


            case 'radius':

                if (this.ctrlr.config.radiusFactor == undefined) {
                    console.log('config.radiusFactor is undefined')
                    return
                }

                let langsteZijde = this.ctrlr.dimensions.graphWidth > this.ctrlr.dimensions.graphHeight ? this.ctrlr.dimensions.graphWidth : this.ctrlr.dimensions.graphHeight;

                this.scale
                    .range([this.ctrlr.config.minRadius, (langsteZijde / this.dataLength) * this.ctrlr.config.radiusFactor]);

                break;

            case 'radial':

                    // let langsteZijde = this.ctrlr.dimensions.width > this.ctrlr.dimensions.height ? this.ctrlr.dimensions.width : this.ctrlr.dimensions.height;
    
                    this.scale
                        .range([0, this.ctrlr.dimensions.graphWidth / 2]);
    
                    break;

            case 'opacity':

                this.scale
                    .range([0.2,1]);

                break;

            case 'flow':

                this.scale
                    .range([70,-70]);

                break;

            case 'log':

                this.scale
                    .range([10,100]);

                break;


        }

        return this.scale;
    }

    fn(x: any) {


        for(let p of this.scale.range()) {

            if(isNaN(p) || p == undefined) {

                // console.log(this.config.slug)
                // console.log(this.scale.range())
                throw new RangeError();
            }
        }

        let r = this.scale(x);

        if(isNaN(r)) {

            // console.log(this.config.slug + " : " + this.config.type)
            // console.log(x) 
            // console.log(this.scale.domain())
            // console.log(this.scale.range())

        } else {
            return r;
        }

       
    }

    domain() {

        return this.scale.domain();
    }

    range() {

        return this.scale.range();
    }

    bandwidth() {

        return this.scale.bandwidth();
    }
}
