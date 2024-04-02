import { IGraphMapping, KeyValue } from '@local/d3_types';
import { breakpoints} from '@local/styleguide';
import { IParamService, ParamService } from './param.service';
import { screenSize } from './screen.factory';
import { styleParentElement, createSideBar, createPopupElement, pageHeader, companyTitle} from './html.factory';
import { DataService, IDataService } from './data.service';
import { switchTopic, toggleSubMenu, openMenu, closeMenu, } from './menu.factory';
import { armLanguageSelector, setLanguageTag, switchLanguage } from './language.factory'
import { INavService, NavService, navItems } from './nav.service';

export interface IDashboardController {

    window: Window;
    params: IParamService;
    data: IDataService,
    nav: INavService;
    htmlContainer: HTMLScriptElement,
    close_btn: HTMLElement,
    open_btn: HTMLElement,
    _reloadHtml: () => void;
    call(segment: string, update: boolean);
    switch: (topic: string, segment: string) => boolean;
    switchLanguage: (lan: string) => void;
    _toggleSubMenu: () => void
    _screenListener: () => void

}

export class DashboardController implements IDashboardController {

    params;
    data;
    nav;
    htmlContainer;
    window;
    close_btn;
    open_btn;
    loader;

    constructor() {

        this.params = new ParamService();
        this.data = new DataService();
        this.nav = new NavService(this);
        this.init();
    }

    async init() {

        this.window = window;
        let selector = null;
        let segment = '2022';
        
        this.params.renew();

        this._reloadHtml();

        await this.call(segment, false);

        const c = this.data.collection();

        this._reloadHtml();

        if (this.params.topic == 'company') { 
            this._toggleSubMenu();
        }

        this._armMenuButton();
        armLanguageSelector(this);
        this._screenListener();

    }

    async call(segment: string, update: boolean ): Promise<void> {

        this.htmlContainer.innerHTML = "";

        let navItem = navItems.find( i => i.slug == this.params.topic);
        navItem = (navItem == undefined) ? navItems[0] : navItem;
        const  pageTitle = this.params.language == 'en' ? navItem.title_en : navItem.title;
       
        pageHeader(pageTitle, this.htmlContainer);

        await import(/*webpackIgnore: true*/ `./${this.params.topic}.bundle.js`);
        // @ts-ignore
        const ctrlr = new window[this.params.topic](this);
        ctrlr.init();
        return;
    }

    switch(paramKey: string, paramValue: string) : boolean {

        closeMenu();
        switchTopic(this,paramKey,paramValue);
        companyTitle(this);

        if (this.params.topic === 'bedrijf') {
            this._toggleSubMenu();
        }

        this._closeMenu();

        return false;
    }

    switchLanguage(lan: string) : void {

        this.params.language = lan;
        switchLanguage(this)
        this.init();
    }

    _toggleSubMenu() : void {
        toggleSubMenu();
    }

    _reloadHtml(): void {

        setLanguageTag(this.params.language);
        
        this.htmlContainer = styleParentElement();
    
        [].slice.call(document.getElementsByTagName("aside")).forEach( (a) => a.remove());
        [].slice.call(document.getElementsByTagName("nav")).forEach( (a) => a.remove());
    
        let aside = createSideBar(this.htmlContainer);
        aside.insertBefore(this.nav.create(), aside.childNodes[0]);
        this.nav.update();

        companyTitle(this);
    
        createPopupElement();

    }

    _screenListener(): void {

        const self = this;
        const screen = screenSize(window.innerWidth);
    
        window.addEventListener("resize", () =>  {
    
            let newScreen = screenSize(window.innerWidth);
    
            if ( screen != newScreen) {
                setTimeout(() => {
                    self._reloadHtml();
                }, 100);
            }
    
        }, false);
    }

    _armMenuButton() {

        this.close_btn = document.getElementById('mobile-menu-item-close')
        this.open_btn = document.getElementById('mobile-menu-item-open')

        this.open_btn.addEventListener( ("click"), () =>  {
            this._openMenu();
        })

        this.close_btn.addEventListener( ("click"), () =>  {
            this._closeMenu();
        })
    }

    _closeMenu() {

        closeMenu();
        if (window.innerWidth < breakpoints.lg) {
            this.close_btn.style.display = 'none'; 
            this.open_btn.style.display = 'block';
        }
    }

    _openMenu() {

        openMenu();
        if (window.innerWidth < breakpoints.lg) {
            this.close_btn.style.display = 'block';
            this.open_btn.style.display = 'none';
        }
    }
}
