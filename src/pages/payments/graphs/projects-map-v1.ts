import { core, elements } from "../../../charts";
import { HTMLSource } from "../../shared/html/html-source";
import { DataObject, EitiData } from "../../shared/types";
import { IGraphMapping } from "@local/d3_types/mapping";
import { breakpoints } from "@local/styleguide";

export class ProjectMapV1 extends core.GraphControllerV3 {

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
        public slug,
        public page,
        public group,
        public mapping,
        public segment,
        public index
    ) {
        super(slug,page,group,mapping,segment) 
        this.pre();
    }

    pre() {
        this._addMargin(0,0,0,0);
        this._addPadding(0,40,40,0);
        this._addScale('y','log','opacity','value');
    }

    html() {

        if(this.group.element == null ) return;
        // this.group.element.style.minWidth = "600px";

        const wrapper = document.createElement('section');
        wrapper.classList.add("graph-container-4");
        wrapper.classList.add("graph-view");
        wrapper.style.position = "relative"
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.justifyContent = 'flex-start';
        wrapper.style.alignSelf = 'flex-start';
        wrapper.style.alignItems = 'flex-start';

        this.group.element.appendChild(wrapper);

        this.header = document.createElement('span');
        wrapper.append(this.header);

        this.graphEl = super._html(wrapper);

        let source = HTMLSource(this.graphEl.parentNode as HTMLElement,this.page.main.params.language,"NL-EITI");


        if(this.graphEl != null) {
            
            this.graphEl.classList.remove('graph-view');
            this.graphEl.classList.remove('graph-container-12');

            this.graphEl.style.justifyContent = 'flex-start';
            this.graphEl.style.alignSelf = 'flex-start';
            this.graphEl.style.alignItems = 'flex-start';
            this.graphEl.style.width = "100%";
            this.graphEl.style.height = window.innerWidth < breakpoints.sm ? "400px" : "500px";
            this.graphEl.style.marginLeft= window.innerWidth < breakpoints.sm ?  "-10%" : "-20%";
            this.graphEl.style.marginTop= window.innerWidth < breakpoints.sm ?  "40%" : "25%";
            this.graphEl.style.marginBottom = window.innerWidth < breakpoints.sm ? "0" : "-20%";
        }

        this.description = document.createElement("div");
        this.description.style.marginBottom = "1.5rem";
        wrapper.appendChild(this.description);




    }

    init() {

        this.config.margin.right = 25;
        
        super._init();
        if (this.graphEl != undefined) super._svg(this.graphEl);

     
        this.chartMap = new elements.ChartMapV2(this);
        this.chartMap.init();

        this.legend = new elements.MapLegend(this);

        this.update(this.group.data,this.segment,false);
    }

    prepareData(data: any) : any  {

        const myData = data.graphs[this.index];

        if (myData == undefined || data['netherlands'] == undefined || data['licences2023'] == undefined) return;

        data.nl_features = data['netherlands'].features;
        data.features = data['licences2023'].features.slice();

        let found = 0;
        let not_found = 0;

        for (const feature of data.features) {

            const item = myData.find( 
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

        // console.log({ "found" : found, "not_found" : not_found });

        return data;
    }

    async draw(data: DataObject) {
        
        const c = data.graphs[this.index][0];

        if (c != undefined) {

            this.header.innerText = this.page.main.params.language == 'en' ? c.name_en: c.name_nl 
            this.description.innerHTML = this.page.main.params.language == 'en' ? '': c.def_nl  // c.def_en
        }

        const values = data.features.filter(f => f.properties.value > 0).map( f => f.properties.value);
        this.scales.y.set(values);

        this.chartMap.draw(data);    

        let colour;

        this.chartMap.redraw("value", this.group.graphs[this.index].mapping[0][0].colour);

    }

    async redraw(data: any[][]) {
        
        //super.redraw(data);
    }

    async update(data: EitiData, segment: string, update: boolean) {
    
        super._update(data,segment,update);
    }
}



