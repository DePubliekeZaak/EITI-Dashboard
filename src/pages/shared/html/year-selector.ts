import {colours} from "@local/styleguide";

export class HtmlYearSelector {

    constructor(
        private element,
        private id: string
    ){
       
    }

    draw(segment, groupSlug: string, language: string) {

        let selectEl = document.getElementById(this.id);

        if(selectEl) { selectEl.parentNode.removeChild(selectEl) }

        let label = document.createElement('label');
        label.id = this.id + '_label';
        label.innerText = language = 'en' ? "years" : "jaren";
        label.style.display = "block";
        label.style.width = "0";
        label.style.overflow = "hidden";
        label.setAttribute("for", this.id + "_select")

        let dropdown = document.createElement('select');
        dropdown.id = this.id + "_select";
        dropdown.name= "jaren";
        dropdown.style.alignSelf = 'flex-start';
        dropdown.setAttribute('aria-describedby', this.id + '_label');

        const years = (this.id == "ubo_register") ? [2023, 2022] : [2023,2022,2021,2020,2019,2018];

        for ( let year of years) {

            let option = document.createElement('option');
            option.label = year.toString();
            option.value = year.toString();
            option.innerText = year.toString();
            if (year === segment) { option.selected = true }
            dropdown.appendChild(option);
            // dropdown.style.border = '1px solid black';
            // dropdown.style.borderRadius = '0';

            
        }

        this.element.appendChild(label)
        this.element.appendChild(dropdown)   // insertBefore(dropdown,headerElement.nextSibling);

        return dropdown;

    }

    redraw() {
    }
}
