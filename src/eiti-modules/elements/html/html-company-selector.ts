import { EitiEntity } from "@local/d3_types/data";
import {colours} from "@local/styleguide";

export class HtmlCompanySelector {

    constructor(
        private element,
        private id: string
    ){
       
    }

    draw(segment: string, companies: EitiEntity[]) {

        let selectEl = document.getElementById(this.id);

        if(selectEl) { selectEl.parentNode.removeChild(selectEl) }

        let dropdown = document.createElement('select');
        dropdown.id = this.id;
        dropdown.style.alignSelf = 'flex-start';


        for ( let c of companies) {

            let option = document.createElement('option');
            option.label = c.name.toString();
            option.value = c.slug.toString();
            option.innerText = c.toString();
            if (c.slug === segment) { option.selected = true }
            dropdown.appendChild(option);            
        }

        this.element.appendChild(dropdown)   // insertBefore(dropdown,headerElement.nextSibling);

        return dropdown;

    }

    redraw() {
    }
}
