
import { isLabeledStatement } from 'typescript';
import { colours } from '../../img-modules/styleguide';
import { Bar, Bars } from '../../pages/shared/types_graphs';
import { slugify } from '../../pages/shared/_helpers';

export default class ChartTimeline {

    htmlDiv;

    constructor(
        private ctrlr
    ){
        this.html();
        
    }

    html() {

        this.htmlDiv = document.createElement("div");
        this.htmlDiv.classList.add("timeline_html_div");
        this.ctrlr.element.appendChild(this.htmlDiv);
    }

    draw(data: any[], index: number) {

        this.ctrlr.svg.layers.data.selectAll("g.timeline_" + index.toString()).remove()

        const group = this.ctrlr.svg.layers.data
            .append('g')
            .attr("class", "timeline_" + index.toString());

        group
            .append("rect")
            .attr("class", "timeline_bg" + index.toString())
            // .style('stroke','#ccc')
            .style('fill','#eee')

        const groups = group.selectAll("g.timeline_item")
            .data(data)
            .join("g")
            .attr("class", "timeline_item");
        
        groups  
            .append("circle")
            .filter( (d) => d.category !=  "beving")
            .attr('r', 5)
            .attr('cy', 5)
            .attr('stroke','#eee')
            .attr('fill','white')

        groups  
            .append("svg:image")
            .filter( (d) => d.category ==  "beving")
            .attr("xlink:href", "./styles/icons/beving.svg")
            .attr("width", 24)
            .attr("height", 24)
            .attr('x',-10)
            .attr("y",-5)

        groups  
            .append("rect")
            .attr("class", "arrow")
            .attr('width', 1)
            .attr('fill','#eee')
            .attr('x',-.5)
            .attr("y", 10)

        groups  
            .append("text")
            .attr("class", "label")
            .attr("x", 0)
            .attr("y", (d, i)  => { 
                
            })
            .style("font-size",".66rem")
            .style("opacity", 0)
            .text((d) => d.label);
    }

    redraw(data: any[], index: number) {

        let self = this;

        const bg = this.ctrlr.svg.layers.data.select("rect.timeline_bg" + index.toString());

        bg
            .attr("x", 0)
            .attr("width", this.ctrlr.dimensions.graphWidth)
            .attr("y", this.ctrlr.dimensions.svgHeight - (30 * (index + 1)))
            .attr("height", 10);



        const groups = this.ctrlr.svg.layers.data.selectAll("g.timeline_" + index.toString() + " g.timeline_item");

        groups 
            .attr("transform", (d, i) => {

                const offset = 0 /// i % 2 == 0 ? 0 : 15;

                const x = this.ctrlr.scales.x1.fn(new Date(d.date));
                const y = this.ctrlr.dimensions.graphHeight + (30 * (index + 1)) + offset;

                return "translate(" + x + "," + y + ")";
                
            })

    
        let tooltip = function popup(d) {

              return `
                    <div>${d.date}</div>
                    <b>${d.label}</b>
                    <div>${d.description}</div>
              
              `;
        }

        groups 
            .on("mouseover", function(event: any, d: any) {

                self.ctrlr.svg.layers.data.selectAll(".bar")
                    .style("fill", b => (b !== d) ? colours[b.colour][1] : colours[b.colour][0]);

                window.d3.select('.tooltip')
                    .html(tooltip(d))
                    .style("left", (event.pageX - 20) + "px")
                    .style("top", (event.pageY - 0) + "px")
                    .transition()
                    .duration(250)
                    .style("opacity", 1);
            })
            .on("mouseout", function(d) {

                self.ctrlr.svg.layers.data.selectAll(".bar")
                    .style("fill", b => colours[b.colour][1]);

                window.d3.select('.tooltip')
                    .transition()
                    .duration(250)
                    .style("opacity", 0);
            })

        const items = self.ctrlr.svg.layers.data.selectAll("g.timeline_" + index.toString() + " text.label");

        self.htmlDiv.innerHTML = "";
        
        items.each( function(d,i) {

            if(d != undefined) {
                
              
                let div = document.createElement("div");
                div.classList.add("html_label");
                div.setAttribute("data_label", slugify(d.html))
                div.innerHTML = d.html;
                div.style.left = self.ctrlr.scales.x1.fn(new Date(d.date)) + self.ctrlr.config.padding.left + "px";
                self.htmlDiv.appendChild(div);
            }

         });

        const divs = [].slice.call(self.ctrlr.element.querySelectorAll("div.html_label"));
        const trim = (s) => parseFloat(s.replace("px",""));
        let staggerTop = 0

        divs.reverse().forEach(function(d,i) {

            if (i < 1) {

                d.style.top  = 0;

            } else {

                const prevEls : HTMLElement[] = [];
                for (let j = 1; j < divs.length - 1; j++) {
                    if (divs[i - j] != undefined) {
                        prevEls.push(divs[i - j])
                    }
                }

                prevEls.forEach( el =>  el.setAttribute("distance", (trim(el.style.left) - trim(d.style.left)).toString()));

                const collusions = prevEls.filter( el => {
                    const distance = el.getAttribute("distance");
                    if(distance != null) {
                        return parseFloat(distance) < d.offsetWidth
                    }
                })
                
                collusions.sort( (a,b) => {                 
                        return trim(b.style.top) - trim(a.style.top)
                });

                if(collusions.length > 0) {

                    const o = collusions.map( el => el.offsetHeight).reduce( (acc, height) => acc + height + 3, 0);
                    d.style.top = o.toString() + "px"; 

                } else {
                    d.style.top = 0;
                    staggerTop = 0;
                }
            }
        });

        const arrows  = self.ctrlr.svg.layers.data.selectAll("rect.arrow");

        let highest = 0;

        arrows
            .attr("height", (d: any,i: number) => {

                const div = self.ctrlr.element.querySelector(`[data_label="${slugify(d.html)}"`)
                highest = (trim(div.style.top) > highest) ? trim(div.style.top) : highest;
                return 16 + trim(div.style.top);

            })

        // height op svg zetten .. niet parent el
        self.ctrlr.element.style.height = (trim(self.ctrlr.element.style.height) + highest + 16).toString() + "px";
        self.htmlDiv.style.height = (highest + 16).toString() + "px";
 

    }
}


