import * as d3 from "d3";

import * as topojson from "topojson-client";

import { ChartMapV2, HtmlFunctionality, HtmlHeader, HTMLSector, MapLegend } from "@local/elements";
import { slugify } from "@local/d3-services";
import { EitiData, GraphData, IGraphMapping } from "@local/d3_types";
import { GraphControllerV2 } from "@local/d3_graphs";
import { filterUnique } from "@local/eiti-services";
// import { flattenColumn } from "@local/img-services"


export class ProjectMapV1 extends GraphControllerV2 {

    funcList;

    scale;
    xScale: any;
    chartScale; 
    features;
    chartMap;
    legend;
    chartHeader;

    header: HTMLElement;
    description: HTMLElement;

    constructor(
        public main: any,
        public data : EitiData,
        public element : HTMLElement,
        public mapping: IGraphMapping,
        public segment: string,
    ) {
        super(main,data,element,mapping,segment);
        this.pre();
    }

    pre() {
        this._addMargin(0,0,0,0);
        this._addPadding(0,40,40,0);

        this._addScale('y','log','opacity','value');
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

        const wrapper = document.createElement('section');
        wrapper.classList.add("graph-container-4");
        wrapper.style.position = "relative"
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.justifyContent = 'flex-start';
        wrapper.style.alignSelf = 'flex-start';
        wrapper.style.alignItems = 'flex-start';

        this.element.appendChild(wrapper);

        this.header = document.createElement('span');
        wrapper.append(this.header);


        const svgId = "svg-wrapper-" + this.segment   // container.style.width = "600px";
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column-reverse';
        container.style.justifyContent = 'flex-start';
        container.style.alignSelf = 'flex-start';
        container.style.alignItems = 'flex-start';
        container.style.width = "100%";
        container.style.height = "400px";
        container.style.marginLeft= "-20%";
        container.style.marginTop= "30%";
        container.style.marginBottom= "-25%";
        container.id = svgId;
        wrapper.appendChild(container);

        super._svg(container);

        this.description = document.createElement("div");
        wrapper.appendChild(this.description);
     
        this.chartMap = new ChartMapV2(this);
        this.chartMap.init();

     //   this.legend = new MapLegend(this);

        this.update(this.data,this.segment,false);
    }

    prepareData(data: any) : GraphData  {

        const nl_features = data.geodata.netherlands.features;

        const dataGroup = "payments";
        const property = this.segment;
        const features = data.geodata.licences2023.features.slice();

        // console.log(property);


        let found = 0;
        let not_found = 0;


        for (const feature of features) {

            const item = this.data[dataGroup].find( 
                d => d.project != null 
                && (
                    d.project.toString().toLowerCase() === feature.properties.licenced_a.toString().toLowerCase() 
                || d.project.toString().toLowerCase() === feature.properties.licenced_1.t   // container.style.width = "600px";oString().toLowerCase() 
                )
            );

            if (item != undefined) {

                feature.properties.value = item.payments_companies;
                feature.properties.meta = item;
                found++;
            } else {
                feature.properties.value = 0;
              //  console.log("niet gevonden: " + feature.properties.licenced_a)
                not_found++
            }
        }

        // console.log(found + "/" + not_found)

        let j = 0;
        let k = 0;
        let n = []

        for (const item of this.data[dataGroup]) {


            let f = features.find( 
                f => item.project != null && 
                (
                    f.properties.licenced_a.toString().toLowerCase() == item.project.toString().toLowerCase()  
                    ||
                    f.properties.licenced_1.toString().toLowerCase() == item.project.toString().toLowerCase()  
                ) 
            );

            if(f == undefined) {
                if(n.indexOf(item.project) < 0) {
                    n.push(item.project);
                }

                // j++;
            } else {
               // console.log(f);
               k++;
            }

         
        }

        // console.log(k)
        // console.log(n);

        return [
            nl_features,
            features
        ]
    }

    async draw(data: any[][]) {


        const c = this.data.payments.find( p => p.payment_stream === this.segment);

        this.header.innerText = c.name_nl;

        this.description.innerHTML = c.def_nl;

        const values = data[1].filter(f => f.properties.value > 0).map( f => f.properties.value);
        // console.log(values);
        this.scales.y.set(values);

        this.chartMap.draw(data);    //   if (window.innerWidth < breakpoints.sm) {
        // this.element.appendChild(this.legend.draw(data));


        let colour;

        switch(this.segment) {

            case 'royalties':
                colour = "blue";
                break;
            case 'surface_rental':
                colour = "orange";
                break;
            case 'retributions':
                colour = "green";
                break;
            default: 
                colour = "purple"

        }

        this.chartMap.redraw("value", colour);

    }

    async redraw(data: any[][]) {
        
         super.redraw(data);
    }

    async update(data: EitiData, segment: string, update: boolean) {
    
        super._update(data,segment,update);
    }
}



