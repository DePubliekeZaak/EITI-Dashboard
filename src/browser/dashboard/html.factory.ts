
import { switchTopic } from "./interaction.factory";    
import { IDashboardController } from './dashboard.controller';
import { IGraphMapping } from '../../charts/core/types';
import members from './members'

export const styleParentElement = (): Element | null => {

    const htmlContainer =  document.querySelector("[img-graph-preset='dashboard']");

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
    if (container.parentElement != null) container.parentElement.insertBefore(aside, document.querySelector("[img-graph-preset='dashboard']"));
    return aside;
}


export const createMobileNav = (): HTMLElement => {

    const nav = document.createElement('nav');

    return nav;
}

export const createPopupElement = (): void => {

    const id = 'img-dashboard_popup';

    if (!document.getElementById(id)) {

        let popup = document.createElement('div');
        popup.id = id;
        document.getElementsByTagName('body')[0].appendChild(popup);
    }
}

export const pageHeader = (topic: string, container: HTMLElement): void => {

        let prevBC = document.querySelector('h2.page_header');
        if (prevBC) {
            prevBC.remove()
        }

        let h1 = document.createElement('h2');
        h1.classList.add('page_header');
        h1.innerText = topic; 

        h1.style.marginTop = '2.5rem';
        h1.style.marginBottom = '0rem';
        container.appendChild(h1);
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

// export const companyTitle = (ctrlr: IDashboardController) => {

//     if (ctrlr.params.isCompanyPage()) {
//         if(members) {
//             let t = members.find( r => r.slug == ctrlr.params.company);
//             const el = (document.querySelector(".eiti-dashboard-breadcrumbs h2") as HTMLHeadingElement)
//            if(el != null)  el.innerText = t["name"];
//         }
//     } 
// }