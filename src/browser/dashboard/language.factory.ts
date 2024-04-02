import { IDashboardController } from "./dashboard.controller"

export const switchLanguage = (ctrlr) => {

    let newurl = location.protocol + "//" + window.location.host + window.location.pathname + window.location.search;
    const combinator = window.location.search === '' ? "?" : "&";

    const index = newurl.indexOf('language=');

    if (index > -1) { 
        newurl = newurl.slice(0, index - 1)
    }

    if(ctrlr.params.language == 'en') {
        newurl = newurl + combinator + 'language=en'
    } else {
        newurl = newurl
    }

    setLanguageTag(ctrlr.params.language);
    
    window.history.pushState({path:newurl},'',newurl);
}

export const setLanguageTag = (language: string) : void => {

    document.querySelector('html').lang = language;
}

export const armLanguageSelector = (ctrlr: IDashboardController) : void => {


    let options: HTMLElement[] = [].slice.call(document.querySelectorAll("#language-selector li button")); 
    options.forEach( o => o.classList.remove('active'));

    const activeIndex = (ctrlr.params.language == 'en') ? 1 : 0;
    options[activeIndex].classList.add('active'); 


    if(options == undefined) return;

    for (const option of options) {

        option.style.cursor = 'pointer';
        option.onclick = () => {

           options.forEach( o => o.classList.remove('active'));
           option.classList.add('active');
           ctrlr.switchLanguage(option.getAttribute('data-language'))
            
        };
    }
}