import '../../styling/main.scss'

import { DashboardController } from '@local/dashboard/'

const init = () => {

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

window.addEventListener('load', function (e) {
    init();
}, false);

