
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { colours } from '@local/styleguide';
import { slugify, thousands } from '../../pages/shared/_helpers';
import { Sankey } from '../../pages/shared/types_graphs';
import { Dimensions } from '../../../../regenton/svelte/src/lib/datavis/core/types';


export class ChartSankeyV1 {

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

                return colours['lightBlue'][0];

                // switch (d.type) {

                //     case 'start':
                //         return  "url(#gradient_1)"
                //     case 'end':
                //         return "url(#gradient_2)"
                //     case 'start-reverse':
                //         return "url(#gradient_4)"
                //     case 'end-reverse':
                //         return "url(#gradient_3)"
                // }
               
                
            })
            // .filter( (d) => d.y1 - d.y0 === 0) 
            // .style("stroke", colours["lightBlue"][0])
            .on("mouseover", function (event: any, d: any) {


                // const sel = d3.select(event.target);
                // sel.raise();

                // sel
                //     .style("stroke", d => { return colours.orange[0] })
                //     // .attr("stroke-width", 3);

                // const l = d3.select('.lineLabel.' + slugify(d[0].label))
                
                // l.raise();
                // l.style("stroke",colours["orange"][0]);

                


            })
             

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
            // .style("opacity", .4)
     
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
            .append("text")
            // .filter( (d) => d.type !== "stream")
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


            window.d3.selectAll(".link")
                .on("mouseover", function (event: any, d: any) {

                const def = self.ctrlr.page.main.params.language == 'en' ? d.meta.def_en : d.meta.def_nl;
                
                let html = `

                    <div>` + d.label +  `</div>
                    <div>` + def +  `</div>
                    <div>GFS code:` + d.meta.code +  `</div>
                    <div>&euro;` + thousands(d.amount) + `</div>
                `;

            window.d3.select('.tooltip') 
                .html(html)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 5) + "px")
                .style("opacity", 1);
            })
            .on("mouseout", function (event: any, d: any) {
                window.d3.select('.tooltip')
                .transition()
                .duration(250)
                .style("opacity", 0);
            })
    }

}
