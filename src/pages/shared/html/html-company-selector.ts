import { EitiEntity } from "@local/d3_types/data";
import {colours} from "@local/styleguide";

export class HtmlCompanySelector {

    dropdown;

    constructor(
        private element,
        private id: string
    ){
       
    }

    draw() {

        let selectEl = document.getElementById(this.id);

        if(selectEl && selectEl.parentNode != null) { selectEl.parentNode.removeChild(selectEl) }

        this.dropdown = document.createElement('select');
        this.dropdown.id = this.id;
        this.dropdown.style.alignSelf = 'flex-start';

        this.element.appendChild(this.dropdown)   // insertBefore(dropdown,headerElement.nextSibling);

        return this.dropdown;

    }

    redraw(segment: string, companies: EitiEntity[]) {

        this.dropdown.innerHTML = "";

        for ( let c of companies) {

            let option = document.createElement('option');
            option.label = c.name.toString();
            option.value = c.slug.toString();
            option.innerText = c.toString();
            if (c.slug === segment) { option.selected = true }
            this.dropdown.appendChild(option);            
        }

        return this.dropdown;
    }
}
