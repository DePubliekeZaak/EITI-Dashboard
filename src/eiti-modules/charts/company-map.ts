import * as d3 from "d3";

import * as topojson from "topojson-client";

import { ChartMap, HtmlFunctionality, HtmlHeader, MapLegend } from "@local/elements";
import { slugify } from "@local/d3-services";
import { EitiData, GraphData, IGraphMapping } from "@local/d3_types";
import { GraphControllerV2 } from "@local/d3_graphs";
import { filterUnique } from "@local/eiti-services";
// import { flattenColumn } from "@local/img-services"


export class CompanyMapV1 extends GraphControllerV2 {

    funcList;

    scale;
    xScale: any;
    chartScale; 
    features;
    chartMap;
    legend;

    constructor(
        public main: any,
        public data : EitiData,
        public element : HTMLElement,
        public mapping: IGraphMapping,
        public segment: string  
    ) {
        super(main,data,element,mapping,segment);
        this.pre();
    }

    pre() {
        this._addMargin(0,0,0,0);
        this._addPadding(20,40,40,0);
    }

    init() {

        this.config.margin.right = 25;
        super._init();

        if (!this.mapping.multiGraph && this.mapping.header) {
            this.htmlHeader = new HtmlHeader(this.element, this.mapping.header,this.mapping.description);
            this.htmlHeader.draw(); 
        }

        if (!this.mapping.multiGraph && this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList = new HtmlFunctionality(this,this.element,this.mapping,this.segment);
        }

        const svgId = "svg-wrapper-" + this.mapping.slug
        const container = document.createElement('section');
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.width = "100%";
        // container.style.maxWidth = "600px"
        container.style.height = "600px";
        container.style.marginTop = "-5%";
        container.id = svgId;
        this.element.appendChild(container);

        super._svg(container);
     
        this.chartMap = new ChartMap(this);
        this.chartMap.init();

     //   this.legend = new MapLegend(this);

        // get geodata.js
        // d3.json('https://graphs.publikaan.nl/graphs/geojson/gemeenten2021.topojson').then( (topojsonObject) => {
        //     this.topojsonObject = topojsonObject;
            
        // });

        this.update(this.data,this.segment,false);
    }

    prepareData(data: any) : GraphData  {

        const nl_features = data.geodata.netherlands.features;

        const dataGroup = "payments";
        const property = "surface_rental";
        const features = [];

        console.log(data);

        const uniqueLocations = filterUnique(data[dataGroup].filter( d =>  d.payment_stream === property),"project");

        console.log(uniqueLocations);

        for (const l of uniqueLocations) {

            const feature = data.geodata.licences2023.features.find( f => f.properties.LICENCE_a === l.toString().trim());
            if(feature != undefined) {
                const item = data[dataGroup].find( d => d.payment_stream === property && d.project === l);
                feature.properties.value = item.payments_companies;
                feature.properties.meta = item;
                features.push(feature);
                
            } else {
                console.log("niet gevonden: " + l)
            }
            
        }

        // const uniqueLocations2 = filterUnique(data[dataGroup].filter( d =>  d.payment_stream === "retributions"),"project");

        // console.log(uniqueLocations2);

        // for (const l of uniqueLocations2) {

        //     const feature = data.geodata.fallowAreas2023.features.find( f => f.properties.LICENCE_NM === l.toString().trim());

        //     if(feature == undefined) {
        //         console.log("niet gevonden: " + l)
        //     }
        // }


        // let geojson: any = topojson.feature(this.topojsonObject, this.topojsonObject.objects.gemeenten);
        // let features = geojson.features;

        // for (let feature of features) {

        //     let muni = data[dataGroup].filter( (m) => {
        //         return m.gemeente === slugify(feature.properties.gemeentenaam).toLowerCase();
        //     })[0];

        //     if(muni && Object.entries(muni).length > 0) {
        //         for (let prop of Object.entries(muni)) {
        //             feature.properties[prop[0]] = prop[1];
        //         }
        //     }

        //     feature.properties.colour = this.firstMapping['colour'];
        // }

        console.log(features)

        return [
            nl_features,
            features
        ]
    }

    async draw(data: GraphData) {



        this.chartMap.draw(data);    //   if (window.innerWidth < breakpoints.sm) {
        // this.element.appendChild(this.legend.draw(data));
    }

    async redraw(data: GraphData) {

        // this.scales.y.set(data.features.map( f => (f['properties'][this.parameters.y] !== undefined) ? f['properties'][this.parameters.y] : 0));
        super.redraw(data);
        this.chartMap.redraw("surface_rental","orange");
    }

    async update(data: EitiData, segment: string, update: boolean) {

        super._update(data,segment,update);
    }
}



