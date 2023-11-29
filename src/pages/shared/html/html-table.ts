import { convertToCurrency } from "@local/d3-services";
import { TableData } from "@local/d3_types/data";

export class HTMLTable {


    tableContainer;
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

        this.tableContainer = this.ctrlr.page.main.window.document.createElement('section');
        this.tableContainer.classList.add("graph-container-12");
        this.tableContainer.classList.add("table-view");

        this.table = this.ctrlr.page.main.window.document.createElement('table');
        this.thead = this.ctrlr.page.main.window.document.createElement('thead');
        this.tbody = this.ctrlr.page.main.window.document.createElement('tbody');

        this.table.appendChild(this.thead)
        this.table.appendChild(this.tbody);

        this.tableContainer.appendChild(this.table);

        this.parentElement.appendChild(this.tableContainer);

        this.hide();

        this.armButton();

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

        this.thead.appendChild(tr);

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

    armButton() {

        const self = this;

        const btn = this.parentElement.querySelector('button.toggle_view');

        if (btn != null) {

            const graphElements = this.parentElement.querySelectorAll("section.graph-wrapper");
            const tableElements = this.parentElement.querySelectorAll("section.table-view");

            const possibleLegend = this.parentElement.querySelector(".legend");

            btn.addEventListener("click", function() {

                
                if (['tabelweergave','table view'].indexOf(btn.innerText ) > -1) {

                    btn.innerText = self.ctrlr.page.main.params.language == 'nl' ? 'grafiekweergave' : 'graph view';

                    for (const el of graphElements) {
                        el.style.display = 'none';
                    }
                    for (const el of tableElements) {
                        el.style.display = 'flex';
                    }

                    if(possibleLegend != undefined) {
                        possibleLegend.style.display = 'none';
                    }


                } else {

                    btn.innerText = self.ctrlr.page.main.params.language == 'nl' ? 'tabelweergave' : 'table view';

                    for (const el of graphElements) {
                        el.style.display = 'flex';
                    }
                    for (const el of tableElements) {
                        el.style.display = 'none';
                    }

                    if(possibleLegend != undefined) {
                        possibleLegend.style.display = 'flex';
                    }
                    
                }
            });
        }
    }


    hide() {
        this.tableContainer.style.display = 'none';
    }

    show() {
        this.tableContainer.style.display = 'flex';
    }
}
