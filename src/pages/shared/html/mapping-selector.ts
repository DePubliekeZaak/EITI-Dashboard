import {colours} from "@local/styleguide";
import { drop } from "lodash";

export class HtmlMappingSelector {

    constructor(
        private ctrlr,
        private element,
        private id: string,
        private config
    ){
       
    }

    draw(segment, index = 0) {

        let selectEl = document.getElementById(this.id);

        if(selectEl) { selectEl.parentNode.removeChild(selectEl) }

        let dropdown = document.createElement('select');
        dropdown.id = this.id;
        dropdown.style.alignSelf = 'flex-start';
        dropdown.style.maxWidth = '90vw';

        for ( let map of this.config.graphs[0].parameters[index]) {

            let option = document.createElement('option');
            option.label = this.ctrlr.page.main.params.language == 'en' ? map.label_en : map.label;
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
