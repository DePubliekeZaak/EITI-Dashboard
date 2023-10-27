import { navItems } from './nav.factory';
import { switchTopic } from "./interaction.factory";    
import { IDashboardController } from './dashboard.controller';
import { IGraphMapping } from '@local/d3_types/mapping';
import members from './members'

export const styleParentElement = (): Element | null => {

    const htmlContainer =  document.querySelector("[eiti-graph-preset='dashboard']");

    if(htmlContainer != undefined) {
        const parentEl = htmlContainer.parentElement;
        if(parentEl != undefined) {
            parentEl.classList.add('container');
            parentEl.style.display = 'flex';
            parentEl.style.flexDirection = 'row-reverse';
            parentEl.style.justifyContent = 'flex-start';
            parentEl.style.alignItems = 'flex-start';   
        }
    }

    return htmlContainer;
}

export const createSideBar = (container: HTMLElement): HTMLElement => {

    container.classList.add('has_sidebar');
    let aside = document.createElement('aside');
    aside.classList.add('selectors');
    if (container.parentElement != null) container.parentElement.appendChild(aside);
    return aside;
}

export const createNav = (ctrlr: IDashboardController): HTMLElement => {

    const nav = document.createElement('nav');

    let ul = document.createElement('ul');
    ul.style.flexDirection = 'column';
    ul.classList.add('dashboard_nav');

    for (let i of navItems) {

        let li = document.createElement('li');
        li.innerText = ctrlr.params.language == 'en' ? i.label_en : i.label;
        li.style.cursor = 'pointer';
        li.setAttribute('data-slug', i.slug);

        if(i.slug != 'company' && i.slug != 'opendata') {
            li.onclick = () => ctrlr.switch('topic',i.slug);
        }

        if(ctrlr.params.topic == i.slug && i.slug != 'company') {
            li.classList.add('active');
        }

        if (i.slug == 'opendata') {
            li.onclick = () =>  window.open(window.location.protocol + "//" + window.location.host + '/opendata','_blank')
        }
        

        if( i.slug == 'company') {

            li.onclick = () => ctrlr._toggleSubMenu() 

            let ul_bedrijven = document.createElement('ul');
            ul_bedrijven.style.flexDirection = 'column';
            ul_bedrijven.classList.add('dashboard_nav_companies');

            if (members) {
                for (let m of members) {
                    let li = document.createElement('li');
                    li.innerText = m.name;

                    li.style.cursor = 'pointer';
                    li.setAttribute('data-slug', m.slug);
                    li.onclick = () => ctrlr.switch("company",m.slug)
                    ul_bedrijven.append(li);
                }
            
                li.appendChild(ul_bedrijven);
            
            }


        }
        ul.appendChild(li);
    }

    nav.appendChild(ul);

    return nav;
}

export const createMobileNav = (): HTMLElement => {

    const nav = document.createElement('nav');

    return nav;
}

export const createPopupElement = (): void => {

    const id = 'eiti-dashboard_popup';

    if (!document.getElementById(id)) {

        let popup = document.createElement('div');
        popup.id = id;
        document.getElementsByTagName('body')[0].appendChild(popup);
    }
}

export const pageHeader = (topic: string, container: HTMLElement): void => {

    let prevBC = document.querySelector('.eiti-dashboard-breadcrumbs');
        if (prevBC) {
            prevBC.remove()
        }

        let breadcrumbContainer = document.createElement('ul');
        breadcrumbContainer.classList.add('eiti-dashboard-breadcrumbs');

        // const crumbs = _crumbs(topic);

        // for (let crumb of crumbs.slice(0, crumbs.length - 1)) {

        //     let c = document.createElement('span');
        //     c.innerText = crumb.label;
        //     c.setAttribute('dashboard-topic', crumb.topic)
        //     if (topic !== crumb.topic) {
        //         c.addEventListener( 'click', (event) => { switchTopic((<HTMLElement>event.target).getAttribute('dashboard-topic'),'all') });
        //         c.classList.add('is-link');
        //     }
        //     breadcrumbContainer.appendChild(c); 
            
        //     let d = document.createElement('span');
        //     breadcrumbContainer.appendChild(d); 
        // }

        let h2 = document.createElement('h2');
        let br = document.createElement('br');
      
        h2.innerText = topic; /// crumbs[crumbs.length - 1].label;
        breadcrumbContainer.appendChild(br);
        breadcrumbContainer.appendChild(h2);

        breadcrumbContainer.style.marginBottom = '3rem';
        container.appendChild(breadcrumbContainer);
}

export const createGraphGroupElement = (graphObject : IGraphMapping, htmlContainer: HTMLElement) => {

    let element = document.createElement('article');

    // if (graphObject.config && graphObject.config.extra.largeHeader) {

    //     let header = document.createElement('h2');
    //     header.innerText = graphObject.label;
    //     header.style.fontFamily = 'NotoSans Regular';
    //     header.style.fontSize = '1.6rem';
    //     header.style.width = '100%';
    //     header.style.margin = '3rem 0 3rem 0';

    //     htmlContainer.appendChild(header);
    // }

    if (graphObject.elementClasslist) {

        for (let className of graphObject.elementClasslist) {
            element.classList.add(className);
        }
    }

    htmlContainer.appendChild(element);

    return element;

}

export const companyTitle = (ctrlr: IDashboardController) => {

    if (ctrlr.params.isCompanyPage()) {
        if(members) {
            let t = members.find( r => r.slug == ctrlr.params.company);
            const el = (document.querySelector(".eiti-dashboard-breadcrumbs h2") as HTMLHeadingElement)
           if(el != null)  el.innerText = t["name"];
        }
    } 
}