import { IParameterMapping } from "@local/d3_types";
import { breakpoints, colours } from "@local/styleguide";
import { entities } from "@local/styleguide/colours";

type LegendItem = {
    colour: string,
    label: string

}

export class HtmlLegendCustom {

    constructor(
        private element: any
    ) {
       
    }

    draw(entities: LegendItem[]) {

        if (this.element.querySelector('.legend') ) {
            this.element.querySelector('.legend').remove();
        }


        let legend = document.createElement('div');
        legend.classList.add('legend');
        legend.style.display = 'flex';
        legend.style.flexDirection = window.innerWidth < breakpoints.md ? 'column' : 'row';
        legend.style.justifyContent = 'flex-start';
        legend.style.alignItems = 'flex-start';

        entities.forEach( (entity: any,i:  number) => {

            let item = this.createDiv();
            item.appendChild(this.createCircle(entity));
            item.appendChild(this.createLabel(entity));
            legend.appendChild(item);
        });

        if (this.element.querySelector('.graph-view') != null) {

            this.element.insertBefore(legend,this.element.querySelector('.graph-view'));
        
        } else {

            this.element.insertBefore(legend,this.element.querySelector('svg'));
        }
    }

    createDiv() : HTMLDivElement {

        let item = document.createElement('div');
        item.style.display = 'flex';
        item.style.flexDirection = 'row';
        item.style.alignItems = 'flex-start';
        item.style.marginRight = (window.innerWidth > breakpoints.md) ? '2rem' : '.5rem';

        return item;
    }

    createCircle(entity: LegendItem) : HTMLSpanElement {

        const c =  colours[entity.colour];

        let circle = document.createElement('span');
        circle.style.width = (window.innerWidth > breakpoints.md) ? '1rem' : '.5rem';
        circle.style.height = (window.innerWidth > breakpoints.md) ? '1rem' : '.5rem';
        circle.style.borderRadius = '50%';
        circle.style.marginRight = (window.innerWidth > breakpoints.md) ? '.5rem' : '.25rem';
        circle.style.display = 'inline-block';
        circle.style.background = c[1];
        circle.style.borderWidth = '1px';
        circle.style.borderColor = c[0];
        circle.style.borderStyle = 'solid';
        return circle;   
    }

    createLabel(entity: LegendItem) : HTMLSpanElement {

        let label = document.createElement('span');
        label.style.fontFamily = "RO Sans Regular";
        label.style.fontSize = (window.innerWidth > 700) ? '.8rem' : '.71em';
        label.style.lineHeight = "1.33";
        label.innerText = entity.label;
        return label;
    }



}