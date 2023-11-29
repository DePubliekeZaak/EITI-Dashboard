import { IDashboardController } from "@local/dashboard";
import { GroupObject, IGroupMappingV2, IGraphMappingV2 } from "./interfaces";


export interface IPageController {
    main: IDashboardController,
    slug: string,
    chartArray: any[],
    init: (config, groups, graphs) => void,
    initHtml: () => void,
    gatherData: () => void,
    prepareData: () => void,
    tables: () => void,
    initGraphs: () => void
    
}

export default class PageController implements IPageController {

    main: IDashboardController;
    slug: string;
    chartArray: any[] = [];

    constructor(main: IDashboardController) {

        this.main = main;
        this.slug = main.params.topic;
     
    }

    async init(config, groups, graphs) {

        for (const c of config) {

            let g : GroupObject = { 
                slug: c.slug,
                splice: c.splice,
                ctrlr: new groups[c.ctrlr](this, c),
                graphs: [],
                config: c,
                element: null,
                data: {}
            }

            g.element = g.ctrlr.html();

            let i = 0;

            for (const graph of c.graphs) {

                g.graphs.push({
                    slug : graph.slug,
                    multiples: graph.multiples == undefined || !graph.multiples ? false : graph.multiples,
                    ctrlrName: graph.ctrlr,
                    mapping: graph.parameters,
                    ctrlr : new graphs[this, graph.ctrlr](graph.slug,this,g,graph.parameters,g.config.segment,i)
                })
                
                i++;
            }

            this.chartArray.push(g) 
        }

        this.initHtml();
        await this.gatherData();
        this.prepareData();
        this.tables();
        await this.prepareMultiples();
        this.initGraphs();

    }

    initHtml() {
        for (const group of this.chartArray) {
            
        }
    }

    async gatherData() {

        for (const group of this.chartArray) {
            for (const endpoint of group.config.endpoints.concat("entities")) {
                await this.main.data.gather(endpoint);
            }
        }
        return;
    }

    prepareData() {

        for (const group of this.chartArray) {
            group.data = group.ctrlr.prepareData(this.main.data.collection());
        }
    }

    tables() {

        for (const group of this.chartArray) {
            if(group.data.table != undefined) {
                group.ctrlr.populateTable(group.data.table);
            }
        }
    }

    initGraphs() {
       
        for (const group of this.chartArray) {
            for (const graph of group.graphs) {
                if (graph.ctrlr == null ) return;
                graph.ctrlr.html();
                graph.ctrlr.init();
            }
        }
    }

    async prepareMultiples() {

        const { default: graphs }  = await import('../' + this.slug + '/graphs/');

        for (const group of this.chartArray) {

            const newGraphs = [];

            for (const graph of group.graphs) {

                if (graph.multiples && group.data[graph.multiples] != undefined) {

                    let i = 0;

                    for (const m of group.data[graph.multiples]) {
        
                        const slug = graph.slug + '_' + i;
                        
                        newGraphs.push({
                            slug,
                            ctrlr : new graphs[this, graph.ctrlrName](slug,this,group,graph.mapping,group.config.segment,i)
                        });
    
                        i++;
                    }
                } else {

              
                    newGraphs.push(graph);
                }
            }

            if (group.splice) {

                const half  = newGraphs.length / 2;
                const odd = newGraphs.slice(0, half);
                const even = newGraphs.slice(half, newGraphs.length);

                group.graphs = [];

                for (let i = 0; i < half; i++) {
                    group.graphs.push(odd[i]);
                    group.graphs.push(even[i]);
                }
            } else {
               
                group.graphs = newGraphs;
            }
        }
    }
}