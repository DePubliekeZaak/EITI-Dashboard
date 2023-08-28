import { ChartMapV3, HtmlFunctionality, HtmlHeader, HTMLSector, HtmlLegendEntities } from "@local/elements";
import { EitiData, GraphData, IGraphMapping } from "@local/d3_types";
import { GraphControllerV2 } from "@local/d3_graphs";
import { GeoJsonCollection, GeoJsonFeature, GeoJsonGeometry } from "@local/d3_types/data";
import { convertEntity, degreestoDecimals, filterUnique, filterUniqueGeoFeatures, uniques, uniquesWithCount } from "@local/eiti-services";

export class LicencesMapV1 extends GraphControllerV2 {

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
          //  this.funcList = new HtmlFunctionality(this,this.element,this.mapping,this.segment);
        }

        const wrapper = document.createElement('section');
        wrapper.classList.add("graph-container-12");
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
        // container.style.maxWidth = "600px"
        container.style.height = "1400px";
        // container.style.paddingLeft= "20%";
        container.style.marginTop= "-30%";
        // container.style.marginBottom= "-25%";
        container.id = svgId;
        wrapper.appendChild(container);

        super._svg(container);

        this.description = document.createElement("div");
        wrapper.appendChild(this.description);
     
        this.chartMap = new ChartMapV3(this);
        this.chartMap.init();

        this.legend = new HtmlLegendEntities(this);

        this.update(this.data,this.segment,false);
    }

    prepareData(data: any) : GraphData  {

        const nl_features = data.geodata.netherlands.features;

        const dataGroup = "licences";
        const property = this.segment;
    
        const geojson: GeoJsonCollection = {
            name: 'licences',
            type: 'FeatureCollection',
            features: []
        }

        const participating_projects = filterUnique(data["payments"],"project")

        // console.log(participating_projects);
        // console.log(participating_projects.length);
        // data.geodata.licences2023.features.slice();

        const ps = data["payments"]
            .filter( p => p.origin === "vermilion_energy")
            .filter( p => p.payment_stream === "surface_rental")
            .filter( p => p.year === 2022)

        const projects = 
            filterUnique(ps, "project")
            .filter( p => p != null);


            // console.log(uniquesWithCount(nam,"payment_stream"))



        projects.sort( (a: string, b: string) => a.toString().localeCompare(b.toString()))

        console.log(projects);


        let found = 0;
        let not_found = 0;




        // console.log(found + "/" + not_found)

        let j = 0;
        let k = 0;
        let n = []

        const operators = filterUnique(this.data[dataGroup],"location_operator");
        // console.log(operators);

        const items = data[dataGroup]
            .filter( i => i.location_operator != null)
            .filter( i => i.resource == 'Koolwaterstoffen')
            .filter( i => i.licence_type == 'Winningsvergunning')
            .filter( i => i.location_operator == 'VERM')
            

        console.log(uniques(items.map( i => i.licence_name)));

        for (const item of items) {

            // console.log(item);

            const geometry: GeoJsonGeometry = {
                type: "Point",
                coordinates: []
            }
            
            geometry.coordinates.push(
                degreestoDecimals(item.long),
                degreestoDecimals(item.lat)
            )

            const feature: GeoJsonFeature = {
                type: "Feature",
                properties: {},
                geometry
            };

            feature.properties = item;
            feature.properties.location_operator = convertEntity(item.location_operator.toString())
            feature.properties.value = 7; //  item[this.segment]

            // let matches  = nam_projects.find( p => p == item.location_code);

            // console.log(matches);

            // let f = features.find( 
            //     f => item.project != null && 
            //     (
            //         f.properties.licenced_a.toString().toLowerCase() == item.project.toString().toLowerCase()  
            //         ||
            //         f.properties.licenced_1.toString().toLowerCase() == item.project.toString().toLowerCase()  
            //     ) 
            // );

            geojson.features.push(feature);
        }

        // console.log(k)
        // console.log(n);

        return [
            nl_features,
            geojson.features
        ]
    }

    async draw(data: any[][]) {

        const values = data[1].filter(f => f.properties.value > 0).map( f => f.properties.value);
        // console.log(values);
        this.scales.y.set(values);

        this.chartMap.draw(data);    //   if (window.innerWidth < breakpoints.sm) {
        


        this.legend.draw(filterUniqueGeoFeatures(data[1],"location_operator"));


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



