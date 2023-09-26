import { breakpoints } from "../../eiti-modules/styleguide";
import { IDashboardController } from "./dashboard.controller";

export const switchTopic = (ctrlr: IDashboardController, paramKey: string, paramValue: string) : void => {

    if (history.pushState) {
        let newurl: string; 
        if(paramKey == 'bedrijf') { 
            newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?bedrijf=' + paramValue;
        } else {
            newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?topic=' + paramValue;
        }
        window.history.pushState({path:newurl},'',newurl);
    }

    let popupElement = document.getElementById('eiti-dashboard_popup');
    popupElement.style.display = 'none';
    let graphEls = [].slice.call(document.querySelectorAll('.graph-container, h2, .graph-wrapper'));
    for (let el of graphEls) {
        el.parentNode.removeChild(el);
    }

    ctrlr.params.renew();
    const newConfig = ctrlr.params.matchConfig()
   
    ctrlr.call(newConfig, "2022", false);

    if (window.innerWidth > breakpoints.md) {
        _updateMenuList(paramKey);
    }


    let mobileNav = document.querySelector('.mobile_nav_v2');
    if (mobileNav) {
        mobileNav.classList.remove('is-open');
        
    } 
    
    let mobileNavButton = document.querySelector('.img_dashboard_mobile_nav_button')
    if(mobileNavButton) {
        mobileNavButton.classList.remove('is-active');
        
    }
}

export const openMenu = (): void => {
    document.getElementsByTagName('aside')[0].classList.add('is_open');
    document.getElementsByTagName("body")[0].style.position = "fixed";
}

export const closeMenu = (): void => {
    document.getElementsByTagName('aside')[0].classList.remove('is_open');
    document.getElementsByTagName("body")[0].style.position = "relative";
}

// export const closeMenu = (): void => {
//     document.getElementsByTagName('aside')[0].classList.remove('is_open');
// }

export const toggleSubMenu = (): void => {
    document.querySelector('ul.dashboard_nav_companies').classList.toggle('is_open')
}



const _updateMenuList = (topic: string): void => {

}