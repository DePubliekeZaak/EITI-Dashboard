import '../../styling/main.scss'

import 'babel-polyfill';
import 'isomorphic-fetch';

import { DashboardController } from '@local/dashboard'

const init = () => {

    // @ts-ignore
    if (ENV == "prod") {
        addStylesheets();
    }

    const attribute = 'eiti-graph-preset';
    const graphElements = [].slice.call(document.querySelectorAll("[" + attribute + "]"));

    for (let el of graphElements) {

        const graph = el.getAttribute(attribute);       

        switch (graph) {

            case 'dashboard' :

                new DashboardController();

                break;
        }
    }
}


const addStylesheets = () => {

    const head  = document.getElementsByTagName('head')[0];
    const link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    // @ts-ignore
    link.href = DOMAIN + '/graphs/styles/main.css';
    link.media = 'all';
    head.appendChild(link);
}

window.addEventListener('load', function (e) {
    init();
}, false);

