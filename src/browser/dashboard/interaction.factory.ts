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

const openMenu = (): void => {
    document.querySelector('.mobile_nav_v2').classList.add('is-open');
}

const closeMenu = (): void => {
    document.querySelector('.mobile_nav_v2').classList.remove('is-open');
}

const _updateMenuList = (topic: string): void => {

}