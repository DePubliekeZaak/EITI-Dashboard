import {colours} from "@local/styleguide";

export class HtmlCustomSelector {

    constructor(
        private element,
        private id: string
    ){
       
    }

    draw(segment: string, options: string[]) {

        let selectEl = document.getElementById(this.id);

        if(selectEl) { selectEl.parentNode.removeChild(selectEl) }

        let dropdown = document.createElement('select');
        dropdown.id = this.id;
        dropdown.style.alignSelf = 'flex-start';


        for ( let o of options) {

            let option = document.createElement('option');
            option.label = o.toString();
            option.value = o.toString();
            option.innerText = o.toString();
            if (o === segment) { option.selected = true }
            dropdown.appendChild(option);            
        }

        this.element.appendChild(dropdown)   // insertBefore(dropdown,headerElement.nextSibling);

        return dropdown;

    }

    redraw() {
    }
}
