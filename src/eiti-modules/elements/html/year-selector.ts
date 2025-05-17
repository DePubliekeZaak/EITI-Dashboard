import {colours} from "@local/styleguide";

export class HtmlYearSelector {

    constructor(
        private element,
        private id: string
    ){
       
    }

    draw(segment,language) {

        console.log('label'); 
        console.log(this.id);

        let selectEl = document.getElementById(this.id + '_el');

        if(selectEl) { selectEl.parentNode.removeChild(selectEl) }

        let label = document.createElement('label');
        label.id = this.id + '_label';
        label.innerText = language = 'en' ? "years" : "jaren";
        label.style.opacity = "0";
        label.setAttribute("for", this.id + "_el")

        let dropdown = document.createElement('select');
        dropdown.id = this.id + "_el";
        dropdown.style.alignSelf = 'flex-start';
        dropdown.setAttribute("aria-described-by",this.id + '_label')

        for ( let year of [2023,2022,2021,2020,2019,2018]) {

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
