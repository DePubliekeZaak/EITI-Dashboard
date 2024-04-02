import { convertToCurrency } from "@local/d3-services";
import { TableData } from "@local/d3_types/data";
import { Definitions } from "../types_graphs";

export class HTMLDefinitions {

    container;
    table;
    thead;
    tbody;
    button;

    constructor(
        private ctrlr,
        private parentElement
    ){

        this.init()
    }

    init() {

        const self = this;

        this.container = this.ctrlr.page.main.window.document.createElement('section');
        this.container.classList.add("graph-container-12");
        this.container.classList.add("definitions-view");
        this.container.classList.add("tabpanel");
        this.container.role = "tabpanel";
        this.container.id = "panel_" + this.ctrlr.slug + "__definitions";
        this.container.setAttribute("aria-labelledby","tab_" + this.ctrlr.slug + "__definitions");

        this.parentElement.appendChild(this.container);
    }

    draw(defs: Definitions) {

        for (let def of defs) {

            let a = document.createElement('article');
            a.classList.add("definition");

            let s = document.createElement('span');
            s.innerText = 'GFS: ' + def.code;
            a.append(s);

            let h = document.createElement('h4');
            h.innerText = this.ctrlr.page.main.params._language == 'en' ? def.name_en : def.name;
            a.append(h);

            let p = document.createElement('p');
            p.innerText  = this.ctrlr.page.main.params._language == 'en' ? def.description_en : def.description;
            a.append(p);
            
            this.container.appendChild(a)

        }

       return true;
    }

    hide() {
        this.container.style.display = 'none';
    }

    show() {
        this.container.style.display = 'flex';
    }
}
