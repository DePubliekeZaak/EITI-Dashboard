import { IParameterMapping } from "../interfaces"
import { breakpoints, colours } from "../../../img-modules/styleguide";

export class HtmlLegendRow {

    constructor(
        private ctrlr: any
    ) {
        this.draw();
    }

    draw() {

        let legend = document.createElement('div');
        legend.classList.add('legend');
        legend.style.display = 'flex';
        legend.style.flexDirection = window.innerWidth < breakpoints.xsm ? 'column' : 'row';
        // legend.style.paddingBottom = window.innerWidth < breakpoints.xsm ? this.ctrlr.config.padding.left + 'px' : '0';
        legend.style.justifyContent = 'center';
        legend.style.width = '100%';

        this.ctrlr.group.graphs[0].mapping[0].forEach( (map: any,i:  number) => {
            let item = this.createDiv();
            item.appendChild(this.createCircle(map));
            item.appendChild(this.createLabel(map));
            legend.appendChild(item);
        });

        this.ctrlr.element.appendChild(legend);
    }
    

    createDiv() : HTMLDivElement {

        let item = document.createElement('div');
        item.style.display = 'flex';
        item.style.flexDirection = 'row';
        item.style.alignItems = 'center';
        item.style.marginRight = (window.innerWidth > 700) ? '.5rem' : '.5rem';

        return item;
    }

    createCircle(map: IParameterMapping) : HTMLSpanElement {

        let circle = document.createElement('span');
        circle.style.width = (window.innerWidth > 700) ? '1rem' : '.5rem';
        circle.style.height = (window.innerWidth > 700) ? '1rem' : '.5rem';
        circle.style.borderRadius = '50%';
        circle.style.marginRight = (window.innerWidth > 700) ? '.5rem' : '.25rem';
        circle.style.display = 'inline-block';
        circle.style.background = colours[map['colour']][1];
        circle.style.borderWidth = '1px';
        circle.style.borderColor = colours[map['colour']][0];
        circle.style.borderStyle = 'solid';
        return circle;   
    }

    createLabel(map: IParameterMapping) : HTMLSpanElement {

        let label = document.createElement('span');
        const labelText = this.ctrlr.page.main.params.language == 'en' ? map['label_en'] : map['label'];

        if (labelText != undefined) {
            label.style.fontFamily = "RO Sans Regular";
            label.style.fontSize = (window.innerWidth > 700) ? '.8rem' : '.71em';
            label.style.lineHeight = "1.33";
            label.innerText = labelText;
        }

        return label;
    }



}