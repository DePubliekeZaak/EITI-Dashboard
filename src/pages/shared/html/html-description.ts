import { convertToCurrency } from "@local/d3-services";
import { TableData } from "@local/d3_types/data";
import { Definitions } from "../types_graphs";

export class HTMLDescription {

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
        this.container.classList.add("description-view");
        this.container.classList.add("tabpanel");
        this.container.role = "tabpanel";
        this.container.id = "panel_" + this.ctrlr.slug + "__description";
        this.container.setAttribute("aria-labelledby","tab_" + this.ctrlr.slug + "__description");

        this.parentElement.appendChild(this.container);
    }

    draw(defs: Definitions) {

        let a = document.createElement('article');
        a.classList.add("description");

        const nl = `<p>Voor EBN bestaat de inkomende kasstroom uit ontvangsten uit de verkoop van koolwaterstoffen via Gasterra of via andere klanten. 
        De uitgaande kasstroom bestaat uit:</p>
        <ul>
            <li>betalingen voor kosten en investeringsuitgaven in olie- en gaswinningsprojecten,</li>
            <li>dividenden aan de Nederlandse Staat en</li>
            <li>vennootschapsbelasting aan de Belastingdienst.</li>
        </ul>`;


        const en = `<p>For EBN, the incoming cash flow consists of receipts from the sale of hydrocarbons via Gasterra or via other customers. The outgoing cash flow consists of:</p>
        <ul>
            <li>payments for costs and investment expenses (capex) in oil and gas extraction projects,</li>
            <li>dividends to the Dutch State and</li>
            <li>t corporate taxes to the Tax Authorities.</li>
        </ul>`;

        a.innerHTML = this.ctrlr.page.main.params._language == 'nl' ? nl : en;

        this.container.appendChild(a)

       return true;
    }

    hide() {
        this.container.style.display = 'none';
    }

    show() {
        this.container.style.display = 'flex';
    }
}
