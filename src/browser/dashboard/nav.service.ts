import { IDashboardController } from "./dashboard.controller";
import members from "./members"
 
export const navItems = [

    {
        slug: 'historie',
        label: 'Historie',
        label_en: "",
        title: 'Historie',
        title_en: "",
    
    },  
    {
        slug: 'fysieke-schade',
        label: 'Fysieke schade',
        label_en: "",
        title: 'Fysieke schade',
        title_en: "",
        sub: [
            {
                slug: 'aos-en-meldingen',
                label: 'FS: AOS en schademeldingen',
                label_en: "",
                title: 'Acuut onveilige situaties (AOS) en andere meldingen',
                title_en: ""
            }, 
            {
                slug: 'vergoedingen',
                label: 'FS: Vergoedingen',
                label_en: "",
                title: 'Fysieke schade: vergoedingen',
                title_en: ""
            },  
            {
                slug: 'besluiten',
                label: 'FS: Besluiten',
                label_en: "",
                title: 'Fysieke schade: besluiten',
                title_en: ""
            },
            {
                slug: 'duur',
                label: 'FS: Duur',
                label_en: "",
                title: 'Fysieke schade: duur',
                title_en: ""
            }, 
        ]
    },  
    {
        slug: 'historie-bezwaren',
        label: 'Bezwaren',
        label_en: "",
        title: 'Historie - bezwaren',
        title_en: ""
    },
    {
        slug: 'opendata',
        label: 'Open data',
        label_en: 'Open data',
        title: 'Open data',
        title_en: 'Open data'
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
            a.innerText =  i.label;
            li.appendChild(a);


            if (i.slug == 'opendata') {
                a.onclick = () =>  window.open(window.location.protocol + "//" + window.location.host + '/open-data','_blank')
            }

            else  {
                a.onclick = () => this.ctrlr.switch('topic',i.slug);
            }

            // nest? 

            // if( i.slug == 'company') {

            //     a.onclick = () => this.ctrlr._toggleSubMenu();

            //     let ul_bedrijven = document.createElement('ul');
            //     ul_bedrijven.style.display = 'flex';
            //     ul_bedrijven.style.flexDirection = 'column';
            //     ul_bedrijven.classList.add('dashboard_nav_companies');

            //     if (members) {
            //         for (let m of members.filter( m => m.member)) {
            //             let li = document.createElement('li');
            //             li.style.cursor = 'pointer';
            //             li.setAttribute('data-slug', m.slug);

            //             let a = document.createElement('a');
            //             a.innerText = m.name;

                      
            //             a.onclick = () => this.ctrlr.switch("company",m.slug)
            //             li.append(a);
            //             ul_bedrijven.append(li);
            //         }
                
            //         li.appendChild(ul_bedrijven);
            //     }
            // }
            
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