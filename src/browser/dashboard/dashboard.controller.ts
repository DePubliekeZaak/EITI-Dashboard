import { IGraphMapping, KeyValue } from '@local/d3_types';
import { breakpoints} from '@local/styleguide';
import { IParamService, ParamService } from './param.service';
import { screenSize } from './screen.factory';
import { styleParentElement, createSideBar, createNav, createMobileNav, createPopupElement, pageHeader, companyTitle} from './html.factory';
import { DataService, IDataService } from '@local/eiti-services';
import { switchTopic, toggleSubMenu, openMenu, closeMenu } from './interaction.factory';
import { navItems } from './nav.factory';

export interface IDashboardController {

    window: Window;
    params: IParamService;
    data: IDataService,
    htmlContainer: HTMLScriptElement,
    close_btn: HTMLElement,
    open_btn: HTMLElement,
    _reloadHtml: () => void;
    call(pageConfig: IGraphMapping[], segment: string, update: boolean);
    switch: (topic: string, segment: string) => void;
    _toggleSubMenu: () => void
    _screenListener: () => void

}

export class DashboardController implements IDashboardController {

    params;
    data;
    htmlContainer;
    window;
    close_btn;
    open_btn;
    loader;

    constructor() {

        this.params = new ParamService();
        this.data = new DataService(this)
        this.init();
    }

    async init() {

        this.window = window;
        let pageConfig = null;
        let selector = null;
        let segment = '2022';
        
        this.params.renew();

        pageConfig = this.params.matchConfig();

        this._reloadHtml();

        this._showLoader()
 
        await this.call(pageConfig, segment, false);

        this._hideLoader()

        this._reloadHtml();

        if (this.params.topic == 'bedrijf') {
            
            this._toggleSubMenu();
        }
        this._armMenuButton();
        this._screenListener();

    }

    _showLoader() {

        this.loader = document.createElement("div");

        this.loader.innerText = "data wordt geladen";

        document.querySelector("div[eiti-graph-preset='dashboard']").appendChild(this.loader);

   
    }

    _hideLoader() {

        this.loader.remove();


    }

    async call(pageConfig: IGraphMapping[], segment: string, update: boolean ): Promise<void> {

        this.htmlContainer = document.querySelector("[eiti-graph-preset='dashboard']");

        // bij bedrijf pagina .. vervang na laden data 
        let  pageTitle = navItems.find( i => i.slug == this.params.topic) != undefined ? navItems.find( i => i.slug == this.params.topic).title : segment

        pageHeader(pageTitle, this.htmlContainer);

        await this.data.call(pageConfig, segment, update, this.htmlContainer);

        return;
    }

    switch(paramKey: string, paramValue: string) : void {

        closeMenu();
        switchTopic(this,paramKey,paramValue);
        companyTitle(this);


        if (this.params.topic === 'bedrijf') {
            this._toggleSubMenu();
        }

        this._closeMenu();
    }

    _toggleSubMenu() : void {
        toggleSubMenu();
    }



    _reloadHtml(): void {

        this.htmlContainer = styleParentElement();
    
        [].slice.call(document.getElementsByTagName("aside")).forEach( (a) => a.remove());
        [].slice.call(document.getElementsByTagName("nav")).forEach( (a) => a.remove());
    
        let aside = createSideBar(this.htmlContainer);
        aside.insertBefore(createNav(this), aside.childNodes[0]);

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
        this.close_btn.style.display = 'none';
        this.open_btn.style.display = 'block';
    }

    _openMenu() {

        openMenu();
        this.close_btn.style.display = 'block';
        this.open_btn.style.display = 'none';
    }

}
