import { IParameterMapping } from "@local/d3_types";
import { breakpoints, colours } from "@local/styleguide";
import { entities } from "@local/styleguide/colours";

export class HtmlLegendEntities {

    constructor(
        private ctrlr: any
    ) {
       
    }

    draw(entities) {


        let legend = document.createElement('div');
        legend.classList.add('legend');
        legend.style.display = 'flex';
        legend.style.flexDirection = window.innerWidth < breakpoints.md ? 'column' : 'column';
        legend.style.paddingLeft = window.innerWidth < breakpoints.md ? this.ctrlr.config.padding.left + 'px' : '0';
        legend.style.justifyContent = 'center';
        legend.style.alignItems = 'flex-end';
        // legend.style.width = '200px';
        // legend.style.position = 'absolute';
        // legend.style.top = "0";
        // legend.style.right = "0";

        entities.forEach( (entity: string,i:  number) => {

            let item = this.createDiv();
            item.appendChild(this.createCircle(entity));
            item.appendChild(this.createLabel(entity));
            legend.appendChild(item);
        });

        if(this.ctrlr.mapping.multiGraph) {

            console.log(this.ctrlr.element);

            this.ctrlr.element.insertBefore(legend,this.ctrlr.element.querySelector('.graph-wrapper'))

        } else {

            this.ctrlr.element.insertBefore(legend,this.ctrlr.element.querySelector('svg'))

        }
    }

    createDiv() : HTMLDivElement {

        let item = document.createElement('div');
        item.style.display = 'flex';
        item.style.flexDirection = 'row';
        item.style.alignItems = 'center';
        item.style.marginRight = (window.innerWidth > 700) ? '2rem' : '.5rem';

        return item;
    }

    createCircle(entity: string) : HTMLSpanElement {

        console.log(entity);

        const c = entities[entity] != undefined ? entities[entity] : colours["gray"];

        let circle = document.createElement('span');
        circle.style.width = (window.innerWidth > 700) ? '1rem' : '.5rem';
        circle.style.height = (window.innerWidth > 700) ? '1rem' : '.5rem';
        circle.style.borderRadius = '50%';
        circle.style.marginRight = (window.innerWidth > 700) ? '.5rem' : '.25rem';
        circle.style.display = 'inline-block';
        circle.style.background = c[1];
        circle.style.borderWidth = '1px';
        circle.style.borderColor = c[0];
        circle.style.borderStyle = 'solid';
        return circle;   
    }

    createLabel(entity: string) : HTMLSpanElement {

        let label = document.createElement('span');
        label.style.fontFamily = "RO Sans Regular";
        label.style.fontSize = (window.innerWidth > 700) ? '.8rem' : '.71em';
        label.innerText = entity;
        return label;
    }



}