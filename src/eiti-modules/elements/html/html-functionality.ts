import { IGraphGroupControllerV2 } from "@local/charts/betalingen-trend-group-v1";
import { sanitizeCurrency } from "@local/d3-services/_helpers";
import { IGraphControllerV2 } from "@local/d3_graphs";
import { IDashboardController } from "@local/dashboard";
import { tableToCSV } from "@local/eiti-services";
import { HtmlMappingSelector } from "./mapping-selector";
import { HtmlYearSelector } from "./year-selector";
import { HtmlCustomSelector } from "./html-custom-selector";
import { breakpoints } from "@local/styleguide";
import { HtmlCompanySelector } from "./html-company-selector";
import { EitiEntity } from "@local/d3_types/data";

export class HtmlFunctionality {

    listElement;
    selector;
    tableButton
    downloadButton;

    constructor(
        private ctrlr: IGraphControllerV2|IGraphGroupControllerV2,
        private element,
        private mapping,
        private segment
    ){
        this.init();
    }

    init() {

        const prevElement = this.element.querySelector('.functionality_list')

        if (prevElement) {
            prevElement.parentNode.removeChild(this.listElement)
        }

        this.listElement = this.ctrlr.main.window.document.createElement('div');
        this.listElement.classList.add('functionality_list');

        const ul = this.ctrlr.main.window.document.createElement('ul');

        this.listElement.appendChild(ul);

        this.element.appendChild(this.listElement);
       // this.element.insertBefore(headerContainer,this.element.childNodes[0]);
       return true;

    }

     draw() {

        const self = this;

        const ul = this.listElement.querySelector('ul');
     
        for (const func of this.mapping.functionality) {

            const li = this.ctrlr.main.window.document.createElement('li');
            let selectEl;

            switch (func) {

                case 'yearSelect':

                        this.selector = new HtmlYearSelector(li,this.mapping.slug);
                        selectEl = this.selector.draw(this.segment);

                        selectEl.addEventListener("change", () => {
                            if( selectEl.value != self.ctrlr.segment) {
                                self.ctrlr.update(self.ctrlr.data, selectEl.value, true);
                            }
                        });

                    break;

                case 'shareTotalSelect': 

                        this.selector = new HtmlCustomSelector(li,this.mapping.slug);
                        selectEl = this.selector.draw(this.segment,['mijnbouwsector','totaal Nederland','aandeel mijnbouwsector']);

                        selectEl.addEventListener("change", () => {
                            if( selectEl.value != self.ctrlr.segment) {
                                self.ctrlr.update(self.ctrlr.data, selectEl.value, true);
                            }
                        });

                    break;

                case 'priceVolumeSelect': 

                    this.selector = new HtmlCustomSelector(li,this.mapping.slug);
                    selectEl = this.selector.draw(this.segment,['prijs (miljoen euro)','volume (miljoen kilo)']);

                    selectEl.addEventListener("change", () => {
                        if( selectEl.value != self.ctrlr.segment) {
                            self.ctrlr.update(self.ctrlr.data, selectEl.value.split(" ")[0], true);
                        }
                    });

                break;

                case 'mappingSelect':

                        this.selector = new HtmlMappingSelector(li,this.mapping.slug,this.mapping);
                        const selectEl2 = this.selector.draw(this.segment);

                        selectEl2.addEventListener("change", () => {
                            if( selectEl2.value != self.ctrlr.segment) {
                                self.ctrlr.update(self.ctrlr.data, selectEl2.value, true);
                            }
                        });

                    break;

                case 'companySelect' :

                        this.selector = new HtmlCompanySelector(li,this.mapping.slug);

                        const companies = self.ctrlr.data.entities
                            .filter( (e) => e.type === 'company' && e.slug != 'ebn')
                            .sort( (a: EitiEntity, b: EitiEntity) =>  a.name.localeCompare(b.name));


                        const selectEl3 = this.selector.draw(this.segment, companies);

                        selectEl3.addEventListener("change", () => {
                            if( selectEl3.value != self.ctrlr.segment) {
                                self.ctrlr.update(self.ctrlr.data, selectEl3.value, true);
                            }
                        });
                
                
                    break;

                case 'tableView':

                    this.tableButton = this.ctrlr.main.window.document.createElement('button');
                    this.tableButton.innerText = 'tabelweergave';
                    li.appendChild(this.tableButton);

                    const graphElements = this.mapping.multiGraph ? this.element.querySelectorAll("section.graph-wrapper") : this.element.querySelectorAll("section.graph-view")
                    const tableElements = this.element.querySelectorAll("section.table-view");

                    const possibleLegend = this.element.querySelector(".legend");

                    this.tableButton.addEventListener("click", function() {

                        self.tableButton.innerText = (self.tableButton.innerText == 'tabelweergave') ? 'grafiekweergave' : 'tabelweergave'
                        
                        if (self.tableButton.innerText == 'tabelweergave') {
                            for (const el of graphElements) {
                                el.style.display = 'flex';
                            }
                            for (const el of tableElements) {
                                el.style.display = 'none';
                            }

                            if(possibleLegend != undefined) {
                                possibleLegend.style.display = 'flex';
                            }


                        } else {
                            for (const el of graphElements) {
                                el.style.display = 'none';
                            }
                            for (const el of tableElements) {
                                el.style.display = 'flex';
                            }

                            if(possibleLegend != undefined) {
                                possibleLegend.style.display = 'none';
                            }
                        }
                    });

                    break;

                case 'download':

                    if (window.innerWidth > breakpoints.sm) {

                        const blob = new Blob(
                            [tableToCSV(this.element)],
                            { type: 'text/csv' }
                        );
            
                        const url = URL.createObjectURL(blob);

                        this.downloadButton = this.ctrlr.main.window.document.createElement('a');
                        this.downloadButton.classList.add("button");
                        this.downloadButton.innerText = 'download';
                        this.downloadButton.title = 'download csv bestand';
                        this.downloadButton.download =  'EITI-NL_' + this.mapping.slug + '.csv' || 'download';
                        this.downloadButton.href = url;
                        li.appendChild(this.downloadButton);

                        const clickHandler = () => {
                            setTimeout(() => {
                            URL.revokeObjectURL(url);
                            removeEventListener('click', clickHandler);
                            }, 150);
                        };
                        

                        this.downloadButton.addEventListener('click', clickHandler, false);

                    }

                    break;



            }

            ul.appendChild(li);
        }

       
    }

    redraw() {
    }

    hide() {
        this.listElement.style.opacity = '0';
    }

    show() {
        this.listElement.style.opacity = '1';
    }
}
