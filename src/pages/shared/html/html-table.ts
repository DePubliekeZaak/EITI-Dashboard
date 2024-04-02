import { TableData } from "../types";

export class HTMLTable {


    container;
    scrolltainer;
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
        this.container.classList.add("table-view");
        this.container.classList.add("tabpanel");
        this.container.role = "tabpanel";
        this.container.id = "panel_" + this.ctrlr.slug + "__table";
        this.container.setAttribute("aria-labelledby","tab_" + this.ctrlr.slug + "__table");

        this.scrolltainer = this.ctrlr.page.main.window.document.createElement('div');
        this.scrolltainer.classList.add("scrolltainer");

        this.table = this.ctrlr.page.main.window.document.createElement('table');
        this.thead = this.ctrlr.page.main.window.document.createElement('thead');
        this.tbody = this.ctrlr.page.main.window.document.createElement('tbody');

        this.table.appendChild(this.thead)
        this.table.appendChild(this.tbody);

        this.scrolltainer.appendChild(this.table);

        this.container.appendChild(this.scrolltainer);

        this.parentElement.appendChild(this.container);

    }

    draw(data: TableData) {

        // is exists .. re-use 
        this.thead.innerHTML = "";
        this.tbody.innerHTML = "";
    
        const tr = this.ctrlr.page.main.window.document.createElement('tr');
        const th0 = this.ctrlr.page.main.window.document.createElement('th');
        
        for (const column of data.headers) {

            const th = this.ctrlr.page.main.window.document.createElement('th');

            th.innerHTML = column
            tr.appendChild(th)
        }

        const thead = this.container.querySelector("thead");
        
        thead.appendChild(tr);

        for (const row of data.rows) {
            
            const tr = this.ctrlr.page.main.window.document.createElement('tr');

            for (const value of row) {
                const td = this.ctrlr.page.main.window.document.createElement('td');
                td.innerHTML = value;
                tr.appendChild(td);
            }
        
            this.tbody.appendChild(tr);
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
