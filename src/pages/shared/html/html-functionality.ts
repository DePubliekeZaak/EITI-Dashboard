
import { tableToCSV } from "../download.factory";

import { breakpoints } from "@local/styleguide";

import { IGroupCtrlr } from "../interfaces";

import { HtmlYearSelector } from "../../shared/html/year-selector";
import { HtmlMappingSelector } from "./mapping-selector";
import { HtmlCompanySelector } from "./html-company-selector";
import { HtmlCustomSelector } from "./html-custom-selector";

import { EitiEntity } from "../types";

export class HtmlFunctionality {

    listElement;
    selector;
    companySelector;
    tableButton
    downloadButton;
    hasListener = false;

    constructor(
        private ctrlr: IGroupCtrlr,
        private element,
        private mapping,
        private segment
    ){
        this.init();
    }

    init() {

        const prevElement = this.element.querySelector('.functionality_list')
        this.listElement = this.ctrlr.page.main.window.document.createElement('div');
        this.listElement.classList.add('functionality_list');

        const ul = this.ctrlr.page.main.window.document.createElement('ul');

        this.listElement.appendChild(ul);

        this.element.appendChild(this.listElement);

        return true;

    }

     draw() {

        const self = this;

        const ul = this.listElement.querySelector('ul');
     
        for (const func of this.mapping.functionality) {

            const li = this.ctrlr.page.main.window.document.createElement('li');
            let selectEl;

            switch (func) {

                case 'yearSelect':

                        this.selector = new HtmlYearSelector(li,this.mapping.slug);
                        selectEl = this.selector.draw(this.segment);

                        selectEl.addEventListener("change", () => {
                            if( selectEl.value != self.ctrlr.segment) {
                                self.ctrlr.update({}, selectEl.value, true);
                            }
                        });

                    break;

                case 'shareTotalSelect': 

                        this.selector = new HtmlCustomSelector(li,this.mapping.slug);

                        const options = [
                            { 
                               slug: 'mijnbouwsector',
                               label: this.ctrlr.page.main.params.language == 'en' ? 'Mining sector' : 'Mijnbouwsector'
                            },
                            { 
                                slug: 'totaal Nederland',
                                label: this.ctrlr.page.main.params.language == 'en' ? 'Total Netherlands' : 'Totaal Nederland'
                            },
                            { 
                                slug: 'aandeel mijnbouwsector',
                                label: this.ctrlr.page.main.params.language == 'en' ? 'Share mining sector' : 'Aandeel mijnbouwsector'
                            },
                        ]
                        
                        selectEl = this.selector.draw(this.segment,options);

                        selectEl.addEventListener("change", () => {
                            if( selectEl.value != self.ctrlr.segment) {
                                self.ctrlr.update({}, selectEl.value, true);
                            }
                        });

                    break;

                case 'priceVolumeSelect': 

                    this.selector = new HtmlCustomSelector(li,this.mapping.slug);

                    const _options = [
                        {
                            slug : 'price',
                            label : this.ctrlr.page.main.params.language == 'en' ? 'Price (in million euro)' : 'Prijs (miljoen euro)',
                            
                        },
                        {
                            slug : 'volume',
                            label : this.ctrlr.page.main.params.language == 'en' ? 'Volume (in million kilo)' : 'Volume (miljoen kilo)',
                            
                        }
                    ]


                    selectEl = this.selector.draw(this.segment, _options);

                    selectEl.addEventListener("change", () => {
                        if( selectEl.value != self.ctrlr.segment) {
                            self.ctrlr.update({}, selectEl.value.split(" ")[0], true);
                        }
                    });

                break;

                case 'mappingSelect':

                        this.selector = new HtmlMappingSelector(this.ctrlr, li,this.mapping.slug,this.mapping);
                        const selectEl2 = this.selector.draw(this.segment);

                        selectEl2.addEventListener("change", () => {
                            if ( selectEl2.value != self.ctrlr.segment) {
                                self.ctrlr.update({}, selectEl2.value, true);
                            }
                        });

                    break;

                case 'combiSelect':

                    li.style.display = "flex";
                    li.style.flexDirection =  window.innerWidth < breakpoints.sm ? "column" : "row"


                    const selectorA = new HtmlMappingSelector(this.ctrlr, li,this.mapping.slug,this.mapping);
                    const selectEl2a = selectorA.draw(this.segment,0);
                    selectEl2a.style.maxWidth =  window.innerWidth < breakpoints.sm ? "70vw" : "30vw";

                    
                    const selectorB = new HtmlMappingSelector(this.ctrlr, li,this.mapping.slug,this.mapping);
                    const selectEl2b = selectorB.draw(this.segment, 1);

                    if (window.innerWidth < breakpoints.sm ) {
                        selectEl2a.style.marginBottom = "1rem";
                        selectEl2b.style.alignSelf = "center";

                    } else {
                        selectEl2a.style.marginRight = "1rem";
                    }  

                    selectEl2a.addEventListener("change", () => {

                        let newValue = selectEl2a.value + "_" + selectEl2b.value;

                        console.log(newValue);

                        if ( newValue != self.ctrlr.segment) {
                            self.ctrlr.update({}, newValue, true);
                        }
                    });

                    selectEl2b.addEventListener("change", () => {

                        let newValue = selectEl2a.value + "_" + selectEl2b.value;

                        if ( newValue != self.ctrlr.segment) {
                            self.ctrlr.update({}, newValue, true);
                        }
                    });

                break;

                case 'companySelect' :


                        this.companySelector = new HtmlCompanySelector(li,this.mapping.slug);
                        const selectEl3 = this.companySelector.draw();
            
                    break;

                case 'tableView':

                    this.tableButton = this.ctrlr.page.main.window.document.createElement('button');
                    this.tableButton.classList.add("toggle_view");
                    this.tableButton.innerText = this.ctrlr.page.main.params.language == 'nl' ? 'tabelweergave': 'table view';
                    li.appendChild(this.tableButton);

                    break;

                case 'download':

                    if (window.innerWidth > breakpoints.sm) {

                        const blob = new Blob(
                            [tableToCSV(this.element)],
                            { type: 'text/csv' }
                        );
            
                        const url = URL.createObjectURL(blob);

                        this.downloadButton = this.ctrlr.page.main.window.document.createElement('a');
                        this.downloadButton.classList.add("button");
                        this.downloadButton.innerText = 'download';
                        this.downloadButton.title = this.ctrlr.page.main.params.language == 'nl' ? 'download csv bestand' : 'download csv file';
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

    // post data retrieval 
    redraw(func: string) {

        let self = this;

        switch (func) {

            case 'companySelect' :

            const collection = self.ctrlr.page.main.data.collection();

            const companies = collection.entities
            .filter( (e) => e.type === 'company' && e.slug != 'ebn')
            .sort( (a: EitiEntity, b: EitiEntity) =>  a.name.localeCompare(b.name));

            const el = this.companySelector.redraw(this.segment, companies);

            el.addEventListener("change", () => {

                if( el.value != self.ctrlr.segment) {
                    self.companySelector.redraw(el.value, companies);
                    self.ctrlr.update({}, el.value, true);
                }
            });

            break;
        }
    }

    hide() {
        this.listElement.style.opacity = '0';
    }

    show() {
        this.listElement.style.opacity = '1';
    }
}
