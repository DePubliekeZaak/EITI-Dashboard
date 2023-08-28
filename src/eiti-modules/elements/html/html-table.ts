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

        this.tableContainer = this.ctrlr.main.window.document.createElement('section');
        this.tableContainer.classList.add("graph-container-12");
        this.tableContainer.classList.add("table-view");

        this.table = this.ctrlr.main.window.document.createElement('table');
        this.thead = this.ctrlr.main.window.document.createElement('thead');
        this.tbody = this.ctrlr.main.window.document.createElement('tbody');

        this.table.appendChild(this.thead)
        this.table.appendChild(this.tbody);

        this.tableContainer.appendChild(this.table);

        this.parentElement.appendChild(this.tableContainer);

        this.hide();


       
    }

    draw(data: TableData) {

            this.thead.innerHTML = "";
            this.tbody.innerHTML = "";

        // iets met typing doen? 
            const tr = this.ctrlr.main.window.document.createElement('tr');
            const th0 = this.ctrlr.main.window.document.createElement('th');
            // th0.innerText = "Organisatie"
    
            // tr.appendChild(th0);

            // console.log(data);
            
            for (const column of data.headers) {

                const th = this.ctrlr.main.window.document.createElement('th');

                th.innerHTML = column
                tr.appendChild(th)
            }

            this.thead.appendChild(tr);

        for (const row of data.rows) {
            
            const tr = this.ctrlr.main.window.document.createElement('tr');

            for (const value of row) {
                const td = this.ctrlr.main.window.document.createElement('td');
                td.innerHTML = value;
                tr.appendChild(td);
            }
        
            this.tbody.appendChild(tr);
        }

        

        

  
       return true;
    }

    redraw() {


    }

    hide() {
        this.tableContainer.style.display = 'none';
    }

    show() {
        this.tableContainer.style.display = 'flex';
    }
}
