import {colours} from "@local/styleguide";

export class HtmlYearSelector {

    constructor(
        private element,
        private id: string
    ){
       
    }

    draw(segment) {

        // console.log(this.id);

        let selectEl = document.getElementById(this.id);

        if(selectEl) { selectEl.parentNode.removeChild(selectEl) }

        let dropdown = document.createElement('select');
        dropdown.id = this.id;
        dropdown.style.alignSelf = 'flex-start';


        for ( let year of [2022,2021,2020,2019,2018]) {

            let option = document.createElement('option');
            option.label = year.toString();
            option.value = year.toString();
            option.innerText = year.toString();
            if (year === segment) { option.selected = true }
            dropdown.appendChild(option);
            // dropdown.style.border = '1px solid black';
            // dropdown.style.borderRadius = '0';

            
        }

        this.element.appendChild(dropdown)   // insertBefore(dropdown,headerElement.nextSibling);

        return dropdown;

    }

    redraw() {
    }
}
