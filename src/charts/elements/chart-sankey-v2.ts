import { sankey, sankeyLinkHorizontal, sankeyNodeWidth } from 'd3-sankey';
import { colours } from '@local/styleguide';
import { Dimensions, Sankey} from "@local/d3_types";
import { slugify } from '@local/d3-services/_helpers';

export class ChartSankeyV2 {

    nodeGroup;
    linkGroup;
    node;
    nodeEnter;
    link;
    linkEnter;
    rects;
    title;
    label;
    labelEnter;
    linkLabel;
    linkLabelEnter;

    constructor(
        public ctrlr : any,
        public yParameter: string,
        public colour: string
    ){

        this.init();
    }

    init() {

        this.linkGroup = this.ctrlr.svg.layers.data.append('g');
        this.nodeGroup = this.ctrlr.svg.layers.data.append('g')
    }

    draw(data: Sankey) {}

    sankeyMaker(dimensions: Dimensions) : any {

            return sankey()
            .nodeWidth(this.ctrlr.config.nodeWidth)
            .nodePadding(this.ctrlr.config.nodePadding)
            .size([dimensions.width, dimensions.height]);
    }

    redraw(data: Sankey, dimensions: Dimensions) {

        const self = this;

        const graph = this.sankeyMaker(this.ctrlr.dimensions)(data);

        this.link = this.linkGroup
            .selectAll('.link')
            .data(graph.links, (d) => d);

        this.linkEnter = this.link
            .enter()
            .append("path")
            .attr("class", (d) => {
                const or = d.source.node.toString();
                const l = d.label != null ? slugify(d.label) : ""
                return "link " + l + " " + or
            })
            .style("fill", "transparent")
            .attr("d", sankeyLinkHorizontal())
            .attr("stroke-width", (d) => d.width)
            .style("stroke", (d) => {

                return colours["blue"][1]             
            });
        

        this.link
            .transition(250)
            .attr("d", sankeyLinkHorizontal())
            .attr("stroke-width", (d) => d.width); 

        this.link.exit().remove();

        this.node = this.nodeGroup.selectAll('.node')
            .data(graph.nodes, (d) => slugify(d.name));

        this.nodeEnter = this.node
            .enter()
            .append("g")
            .attr("class", (d) => "node " + d.name);

        this.nodeEnter
            .append("rect")
            .attr("x", (d) => { return d.x0; })
            .attr("y", (d) => { return d.y0; })
            .attr("height", (d) => { 
                return d.y1 - d.y0; 
            })
            .attr("width", this.ctrlr.config.nodeWidth)
            .style("fill", (d) => { 

                switch(d.type) {

                    case 'origin':

                        return colours['lightBlue'][0]

                    case 'stream': 

                        return colours['lightBlue'][1]

                    case 'recipient':

                        return colours["gray"][1]
                }            
            })

        this.node
            .select('rect')
            .transition(0)
            .attr("x", (d) => { return d.x0; })
            .attr("y", (d) => { 
                return d.y0; 
            })
            .attr("height", (d) => { 

                if(d.y1 - d.y0 < 0) {
                    // console.log(d);
                }
                return d.y1 - d.y0; 
            })
       
        this.labelEnter = this.nodeEnter 
            .filter( (d) => d.value > 0)
            .append("text")
            .attr("x", (d) => { return d.x0 + this.ctrlr.config.nodeWidth + 60; })
            .attr("y", (d) => { return (d.y1 + d.y0) / 2; })
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text( (d) => d.label);

        this.label = this.node
            .select("text")
            .transition(250)
            .attr("x", (d) => { return d.x0 + this.ctrlr.config.nodeWidth + 60; })
            .attr("y", (d) => { return (d.y1 + d.y0) / 2; })
            .filter((d) => { return d.x0 < dimensions.width / 2; })
            .attr("x", (d) => { return d.x1 - this.ctrlr.config.nodeWidth - 60; })  
            
        this.node.exit().remove();
           
        this.labelEnter
            .merge(this.label)
            .attr("x", (d) => { return d.x0 + this.ctrlr.config.nodeWidth + 60; })
            .filter((d) => { return d.x0 < dimensions.width / 2; })
            .attr("x", (d) => { return d.x1 - this.ctrlr.config.nodeWidth - 60; })
            .attr("text-anchor", "start");
    }

}
