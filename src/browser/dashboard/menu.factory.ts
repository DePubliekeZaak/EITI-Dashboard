import { breakpoints } from "@local/styleguide";
import { IDashboardController } from "./dashboard.controller";

export const switchTopic = (ctrlr: IDashboardController, paramKey: string, paramValue: string) : void => {

    let topic: string;
    // if (history.pushState) {
    let newurl: string; 
    if(paramKey == 'company') { 
        newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?company=' + paramValue;
    } else {
        newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?topic=' + paramValue;
    }

    if (ctrlr.params.language == 'en') {
        newurl = newurl + '&language=en';
    }

    window.history.pushState({path:newurl},'',newurl);

    let popupElement = document.getElementById('eiti-dashboard_popup');
    if (popupElement != null) {
        popupElement.style.display = 'none';
    }
    let graphEls = [].slice.call(document.querySelectorAll('.graph-container, h2, .graph-wrapper'));
    for (let el of graphEls) {
        el.parentNode.removeChild(el);
    }

    ctrlr.params.renew();
   
    ctrlr.call("2022", false);

    if (window.innerWidth > breakpoints.md) {
        ctrlr.nav.update();
    }

    let mobileNav = document.querySelector('.mobile_nav_v2');
    if (mobileNav) {
        mobileNav.classList.remove('is-open');
    } 
    
    let mobileNavButton = document.querySelector('.img_dashboard_mobile_nav_button')
    if (mobileNavButton) {
        mobileNavButton.classList.remove('is-active');
    }
}

export const openMenu = (): void => {

    document.getElementsByTagName('nav')[0].classList.add('is_open');
    document.getElementsByTagName("body")[0].style.position = "fixed";
}

export const closeMenu = (): void => {
    document.getElementsByTagName('nav')[0].classList.remove('is_open');
    document.getElementsByTagName("body")[0].style.position = "relative";
}

export const toggleSubMenu = (): void => {
    
    const ul = document.querySelector('ul.dashboard_nav_companies');
    if (ul !=  undefined) ul.classList.toggle('is_open');
}


