import { IParameterMapping } from "@local/d3_types";
import { breakpoints, colours } from "@local/styleguide";
import { entities } from "@local/styleguide/colours";

export class HtmlLegendCustom {

    constructor(
        private element: any
    ) {
       
    }

    draw(entities) {


        let legend = document.createElement('div');
        legend.classList.add('legend');
        legend.style.display = 'flex';
        legend.style.flexDirection = window.innerWidth < breakpoints.md ? 'column' : 'row';
        // legend.style.paddingLeft = window.innerWidth < breakpoints.md ? this.ctrlr.config.padding.left + 'px' : '0';
        legend.style.justifyContent = 'flex-start';
        legend.style.alignItems = 'flex-start';

        entities.forEach( (entity: any,i:  number) => {

            let item = this.createDiv();
            item.appendChild(this.createCircle(entity));
            item.appendChild(this.createLabel(entity));
            legend.appendChild(item);
        });

     

        this.element.insertBefore(legend,this.element.querySelector('.graph-view'))

    
    }

    createDiv() : HTMLDivElement {

        let item = document.createElement('div');
        item.style.display = 'flex';
        item.style.flexDirection = 'row';
        item.style.alignItems = 'center';
        item.style.marginRight = (window.innerWidth > 700) ? '2rem' : '.5rem';

        return item;
    }

    createCircle(entity: any) : HTMLSpanElement {

        const c =  colours[entity.colour];

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

    createLabel(entity: any) : HTMLSpanElement {

        let label = document.createElement('span');
        label.style.fontFamily = "RO Sans Regular";
        label.style.fontSize = (window.innerWidth > 700) ? '.8rem' : '.71em';
        label.innerText = entity.label;
        return label;
    }



}