
import { tableToCSV } from "../download.factory";
import { breakpoints } from "@local/styleguide";
import { IGroupCtrlr } from "../interfaces";
import { last } from "lodash";


export class HtmlTabs {

    listElement;
    selector;
    companySelector;
    tableButton
    downloadButton;
    definitionsButton;
    hasListener = false;
    constructor(
        private ctrlr: IGroupCtrlr,
        private element,
        private mapping,
        private segment,
        private groupIndex
    ){
        this.init();
    }

    init() {

        this.listElement = this.ctrlr.page.main.window.document.createElement('div');
        this.listElement.classList.add('tab_list');

        const ul = this.ctrlr.page.main.window.document.createElement('ul');
        ul.role = "tablist"

        this.listElement.appendChild(ul);

        this.element.appendChild(this.listElement);

        return true;

    }

     draw() {

        const self = this;

        const ul = this.listElement.querySelector('ul');

        this.mapping.functionality = (window.innerWidth < breakpoints.sm) ? this.mapping.functionality.filter( f => f != "download") : this.mapping.functionality;
    
        for (const func of ["graph"].concat(this.mapping.functionality)) {

            if(["graph","table","definitions","download","description"].indexOf(func) < 0) continue;

            const li = this.ctrlr.page.main.window.document.createElement('li');
            li.role = "presentation";
            let selectEl;

            const a = this.ctrlr.page.main.window.document.createElement('a');
            a.classList.add("tab");
            a.setAttribute("aria-describedby", this.ctrlr.slug);
            a.setAttribute("aria-selected",false);
            a.role = "tab" 
            const id = this.ctrlr.slug + "__" + func
            a.href= "#panel_" + id;
            a.id = "tab_" + id;
            
            li.appendChild(a);

            switch (func) {

                case 'graph' : 

                    a.innerText = this.ctrlr.page.main.params.language == 'nl' ? 'grafiek': 'graph';
                    a.setAttribute("aria-selected",true);

                    const launchGraqph = () => {
                        setTimeout(() => {
                      
                            for ( let graph of self.ctrlr.page.chartArray[this.groupIndex].graphs) {
                                graph.ctrlr.redraw(graph.ctrlr.group.data);
                            }
                            removeEventListener('click', launchGraqph);
                        }, 50);
                    };
                    
                    a.addEventListener('click', launchGraqph, false);
                  
                    break;

                case 'table':

                    a.innerText = this.ctrlr.page.main.params.language == 'nl' ? 'tabel': 'table';

                    break;

                case 'definitions' : 

                    a.innerText = this.ctrlr.page.main.params.language == 'nl' ? 'definities': 'definitions';

                    break;

                case 'download':
                  
                    a.innerText = 'download';
                    a.title = this.ctrlr.page.main.params.language == 'nl' ? 'download csv bestand' : 'download csv file';

                    break;

                case 'description':
                  
                    a.innerText = this.ctrlr.page.main.params.language == 'nl' ? 'omschrijving' : 'description';

                    break;
                    
            }

            ul.appendChild(li);
        }
    }

    armDownload() {

      if(this.mapping.functionality.indexOf("download") > -1) {

        const a = this.listElement.querySelector("li:last-of-type a");

        const blob = new Blob(
          [tableToCSV(this.element)],
          { type: 'text/csv' }
        );

        const url = URL.createObjectURL(blob);

        a.download =  'EITI-NL_' + this.mapping.slug + '.csv' || 'download';
        a.href = url;
        
        const clickHandler = () => {
            setTimeout(() => {
              URL.revokeObjectURL(url);
              removeEventListener('click', clickHandler);
            }, 150);
        };
      
        a.addEventListener('click', clickHandler, false);
      }
    }

    redraw(func: string) {
        let self = this;
    }

    els() {

        const tabEls = [...this.listElement.querySelectorAll(".tab_list a")];
        const panelEls = [...this.listElement.parentElement.querySelectorAll("section.tabpanel")];
        let otherTabGroups = [...document.querySelectorAll(".group-wrapper")];

        otherTabGroups = otherTabGroups.filter( el => !el.contains(this.listElement));

        return { tabEls, panelEls, otherTabGroups }
    }

    arm() {

        const self = this;

        const { tabEls } = this.els();

        tabEls.forEach((element) => {
            element.addEventListener("click", function () {
              self.setSelectedTab(element);
            });
        });
                
        tabEls.forEach((element) => {
            element.addEventListener("keydown", function (e) {
              if ((e.keyCode || e.which) === 32) {
                self.setSelectedTab(element);
                element.click();
              }
            });
        });

        this.createArrowNavigation();
    }

    handleInitialState () {

        const { tabEls, panelEls } = this.els();

        tabEls.forEach((e) => {
          e.setAttribute("tabindex", "-1");
          e.setAttribute("aria-selected", "false");
        });
      
        window.location.href.indexOf("#panel") === -1 || (this.listElement.parentElement.querySelector(window.location.hash) == null) 
          ? this.activateFirstPanel()
          : this.checkInitialSelectedTab();
      
        this.determineTabindex();
    };

    activateFirstPanel() {

        const { tabEls, panelEls } = this.els();

        if(tabEls.length > 0 && panelEls.length > 0) {

            tabEls[0].setAttribute("tabindex", "0");
            tabEls[0].setAttribute("aria-selected", "true");
            panelEls[0].classList.add("visible");
        }
    }

    checkInitialSelectedTab()  {

        const targetedTabPanel = document.querySelector(".tabpanel:target,.tabpanel.visible")
    
        if(targetedTabPanel!= null) {
            const label = targetedTabPanel.getAttribute("aria-labelledby");
            const selectedTab = document.querySelector(`#${label}`);
            selectedTab.setAttribute("aria-selected", "true");
            selectedTab.removeAttribute("tabindex");
        }

        // andere panels 
      };

    setSelectedTab(element: HTMLElement) {

        const { tabEls, panelEls, otherTabGroups } = this.els();

        const selectedId = element.id;
        
        tabEls.forEach((e) => {
            
            const id = e.getAttribute("id");

            if (id === selectedId) {
                e.removeAttribute("tabindex");
                e.setAttribute("aria-selected", "true");
            } else {
                e.setAttribute("tabindex", "-1");
                e.setAttribute("aria-selected", "false");
            }
        });

        // ther can be only one :target on page 

        panelEls.forEach( (p) => {

            p.classList.remove('visible');
        }) 

        this.maintainOtherTabs(otherTabGroups)
    }

    maintainOtherTabs(groups) {

      // : target is not enough when having multiple tabgroups on a page.. we can use aria-selected 

      for (let group of groups) {

        let selectedTab = group.querySelector("li a[aria-selected=true]");

        if(selectedTab) {

            let activePanelId = selectedTab.href.split("#")[1];
            document.getElementById(activePanelId).classList.add('visible');
        }
      }
    }

    determineTabindex()  {

        const { panelEls } = this.els();

        panelEls.forEach((element) => {

          const focusableElements = element.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details:not([disabled]), summary:not(:disabled)'
          ).length;
      
          focusableElements
            ? element.setAttribute("tabindex", "-1")
            : element.setAttribute("tabindex", "0");

        });
    };

    createArrowNavigation()  {

        const { tabEls } = this.els();

        const firstTab = tabEls[0];
        const lastTab = tabEls[tabEls.length - 1];
      
        tabEls.forEach((element) => {
          element.addEventListener("keydown", function (e) {
            if ((e.keyCode || e.which) === 38 || (e.keyCode || e.which) === 37) {
              if (element == firstTab) {
                e.preventDefault();
                lastTab.focus();
              } else {
                e.preventDefault();
                const focusableElement = tabEls.indexOf(element) - 1;
                tabEls[focusableElement].focus();
              }
            } else if (
              (e.keyCode || e.which) === 40 ||
              (e.keyCode || e.which) === 39
            ) {
              if (element == lastTab) {
                e.preventDefault();
                firstTab.focus();
              } else {
                e.preventDefault();
                const focusableElement = tabEls.indexOf(element) + 1;
                tabEls[focusableElement].focus();
              }
            }
          });
        });
      };

    hide() {
        this.listElement.style.opacity = '0';
    }

    show() {
        this.listElement.style.opacity = '1';
    }
}
