import {colours} from "@local/styleguide";

export class HtmlMappingSelector {

    constructor(
        private element,
        private id: string,
        private mapping
    ){
       
    }

    draw(segment) {

        let selectEl = document.getElementById(this.id);

        if(selectEl) { selectEl.parentNode.removeChild(selectEl) }

        let dropdown = document.createElement('select');
        dropdown.id = this.id;
        dropdown.style.alignSelf = 'flex-start';

        for ( let map of this.mapping.parameters[0]) {

            let option = document.createElement('option');
            option.label = map.label;
            option.value = map.column;
            option.innerText = map.label;
            if (map.column === segment) { option.selected = true }
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
