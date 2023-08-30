import { IGraphMapping, KeyValue } from '@local/d3_types';
import { breakpoints} from '@local/styleguide';
import { IParamService, ParamService } from './param.service';
import { screenSize } from './screen.factory';
import { styleParentElement, createSideBar, createNav, createMobileNav, createPopupElement, pageHeader, companyTitle} from './html.factory';
import { DataService, IDataService } from '@local/eiti-services';
import { switchTopic, toggleSubMenu } from './interaction.factory';
import { navItems } from './nav.factory';

export interface IDashboardController {

    window: Window;
    params: IParamService;
    data: IDataService,
    htmlContainer: HTMLScriptElement,
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
 
        await this.call(pageConfig, segment, false);

        this._reloadHtml();

        console.log('opnieuw');

        if (this.params.topic == 'bedrijf') {
            this._toggleSubMenu();
        }

        this._screenListener();
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

        console.log('switch');

        switchTopic(this,paramKey,paramValue);
        companyTitle(this);

        if (this.params.topic === 'bedrijf') {
            this._toggleSubMenu();
        }
    }

    _toggleSubMenu() : void {
        toggleSubMenu();
    }



    _reloadHtml(): void {

        this.htmlContainer = styleParentElement();
    
        [].slice.call(document.getElementsByTagName("aside")).forEach( (a) => a.remove());
        [].slice.call(document.getElementsByTagName("nav")).forEach( (a) => a.remove());
    
        if (window.innerWidth >= breakpoints.bax) {
    
            let aside = createSideBar(this.htmlContainer);
            aside.insertBefore(createNav(this), aside.childNodes[0]);
      
        } else {
            let mobileNavTop = createMobileNav();
        }

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

}
