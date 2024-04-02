import { IDashboardController } from "./dashboard.controller";
import members from "./members"
 
export const navItems = [

    {
        slug: 'payments',
        label: 'Betalingen',
        label_en: "Payments",
        title: 'Betalingen gas, olie en zout aan overheid',
        title_en: "Gas, oil and salt payments to government"
    },  
    {
        slug: 'reconciliation',
        label: 'Reconciliatie',
        label_en: "Reconciliation",
        title: 'Reconciliatie',
        title_en: "Reconciliation"
    },
    {
        slug: 'ebn',
        label: 'Overheidsdeelneming EBN',
        label_en: "State share in EBN",
        title: 'Overheidsdeelneming EBN',
        title_en: 'State share in EBN',
    },
    {
        slug: 'economy',
        label: 'Mijnbouwsector Nederland',
        label_en: "Dutch mining sector",
        title: 'Mijnbouwsector Nederland',
        title_en: 'Size mining sector in the Netherlands'
    },
    {
        slug: 'ubo',
        label: 'UBO-informatie',
        label_en: 'UBO-information',
        title: 'UBO-informatie',
        title_en: 'UBO information'
    },
    {
        slug: 'company',
        label: 'Bedrijven',
        label_en: 'Companies',
        title: 'Bedrijven',
        title_en: "Companies"
    },
    {
        slug: 'opendata',
        label: 'Open data',
        label_en: 'Open data',
        title: 'Open data',
        title_en: 'Open data'
    },
    {
        slug: 'copyright',
        label: 'Copyright',
        label_en: 'Copyright',
        title: 'Copyright',
        title_en: 'Copyright'
    },
    {
        slug: 'contact',
        label: 'Contact',
        label_en: 'Contact',
        title: 'Contact',
        title_en: 'Contact'
    }

];

export interface INavService {

    items: any[],
    el: HTMLElement,
    ctrlr: IDashboardController,
    create: () => HTMLElement,
    update: () => void
}

export class NavService implements INavService {

    items: any[];
    el: HTMLElement;

    constructor(
        public ctrlr: IDashboardController
    ) {
        this.items = navItems;
    }

    create() {

        this.el = document.createElement('nav');

        let ul = document.createElement('ul');
        ul.style.flexDirection = 'column';
        ul.classList.add('dashboard_nav');

        for (let i of navItems) {

            let li = document.createElement('li');
            li.style.cursor = 'pointer';
            li.setAttribute('data-slug', i.slug);
            let a = document.createElement('a');
            a.href = "#";
            a.innerText = this.ctrlr.params.language == 'en' ? i.label_en : i.label;
            li.appendChild(a);

            if(i.slug != 'company' && i.slug != 'opendata') {
                a.onclick = () => this.ctrlr.switch('topic',i.slug);
            }

            if (i.slug == 'opendata') {
                a.onclick = () =>  window.open(window.location.protocol + "//" + window.location.host + '/open-data','_blank')
            }

            if (i.slug == 'contact') {
                a.onclick = () =>  window.open('https://www.eiti.nl/contact','_blank')
            }

            if (i.slug == 'copyright') {
                a.onclick = () =>  window.open('https://www.eiti.nl/copyright','_blank')
            }

            if( i.slug == 'company') {

                a.onclick = () => this.ctrlr._toggleSubMenu();

                let ul_bedrijven = document.createElement('ul');
                ul_bedrijven.style.display = 'flex';
                ul_bedrijven.style.flexDirection = 'column';
                ul_bedrijven.classList.add('dashboard_nav_companies');

                if (members) {
                    for (let m of members.filter( m => m.member)) {
                        let li = document.createElement('li');
                        li.style.cursor = 'pointer';
                        li.setAttribute('data-slug', m.slug);

                        let a = document.createElement('a');
                        a.innerText = m.name;

                      
                        a.onclick = () => this.ctrlr.switch("company",m.slug)
                        li.append(a);
                        ul_bedrijven.append(li);
                    }
                
                    li.appendChild(ul_bedrijven);
                }
            }
            
            ul.appendChild(li);
        }

        this.el.appendChild(ul);

        return this.el;
    }

    update() {

        const items = [].slice.call(this.el.querySelectorAll('li'));

        for (let item of items) {

            item.classList.remove('active');
            item.removeAttribute('aria-current');

            if (item.getAttribute('data-slug') == this.ctrlr.params.topic && this.ctrlr.params.topic !== 'company') {
                item.classList.add('active');
                item.setAttribute('aria-current', 'page');
            }
        }
   
    }
}