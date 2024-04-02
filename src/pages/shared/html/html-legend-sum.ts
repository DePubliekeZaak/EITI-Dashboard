import { IParameterMapping } from "../../../charts/core/types";
import { breakpoints, colours } from "../../../img-modules/styleguide";
import { convertToCurrencyInTable } from "../_helpers";
import { PiePart } from "../types_graphs";


export default class HtmlLegendAsSum {

    rowHeight = 22;
    legend;

    constructor(
        private ctrlr
    ){}

    draw(data: PiePart[]) {

        let legend = document.createElement('div');
        legend.classList.add('legend');
        legend.style.display = 'flex';
        legend.style.flexDirection = window.innerWidth < breakpoints.xsm ? 'column' : 'column';
        legend.style.paddingBottom = window.innerWidth < breakpoints.xsm ? this.ctrlr.config.padding.left + 'px' : '0';
        legend.style.justifyContent = 'center';
        legend.style.width = '340px';

        let table = document.createElement('table');
        let tbody = document.createElement('tbody');

        // table.style.border = "none";
       


        data.forEach( (map: PiePart, i: number, data: PiePart[]) => {
            tbody.appendChild(this.createRow(map, i, data));
        });

        table.appendChild(tbody);
        legend.appendChild(table);
        
        this.ctrlr.element.appendChild(legend);    // insertBefore(legend,this.ctrlr.element.querySelector('svg'))
    }

    createRow(map: PiePart, index: number, data: PiePart[]) : HTMLDivElement {

        let row = document.createElement('tr');
        if (index == data.length -1) {
            row.classList.add("top_border");
        } else {
            row.classList.add("no_border");
        }

         let colour = document.createElement('td');
         colour.appendChild(this.createCircle(map));
         row.appendChild(colour);

         let label = document.createElement('td');
         label.innerText = map.label;
         row.appendChild(label);

         let value = document.createElement('td');
         value.innerText = map.format == 'currency' ? convertToCurrencyInTable(map.value) : map.value.toString();
         row.appendChild(value);

        return row;
    }

    createDiv() : HTMLDivElement {

        let item = document.createElement('div');
        item.style.display = 'flex';
        item.style.flexDirection = 'row';
        item.style.alignItems = 'center';
        item.style.marginBottom = (window.innerWidth > 700) ? '.5rem' : '.5rem';

        return item;
    }

    createCircle(map: PiePart) : HTMLSpanElement {

        let circle = document.createElement('span');
        circle.style.width = (window.innerWidth > 700) ? '1rem' : '.5rem';
        circle.style.height = (window.innerWidth > 700) ? '1rem' : '.5rem';
        circle.style.borderRadius = '50%';
        circle.style.marginRight = (window.innerWidth > 700) ? '.5rem' : '.25rem';
        circle.style.display = 'flex';
        circle.style.background = map['colour'] != undefined ? colours[map['colour']][1] : "#eee";
        circle.style.borderWidth = '1px';
        circle.style.borderColor = map['colour'] != undefined ? colours[map['colour']][0] : "#ccc";
        circle.style.borderStyle = 'solid';
        return circle;   
    }

    createLabel(map: PiePart) : HTMLSpanElement {

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