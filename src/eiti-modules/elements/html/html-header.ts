export class HtmlHeader {

    headerElement;

    constructor(
        private element,
        private label,
        private description
    ){}

    draw() {

        const prevHeaderElement = this.element.querySelector('.article_header')

        if (prevHeaderElement) {
            prevHeaderElement.parentNode.removeChild(this.headerElement)
        }

        this.headerElement = document.createElement('div');
        this.headerElement.classList.add('article_header');
        this.headerElement.style.position = 'relative';


        if(!this.element.classList.contains("graph-view")) {

            this.headerElement.style.borderTop = '2px solid rgb(230, 230, 230)';
            this.headerElement.style.paddingBottom = '2rem';
            this.headerElement.style.paddingTop = '2rem';

        }


        this.headerElement.style.width = 'calc(100% - 0px)';
        
        // this.headerElement.style.marginBottom = '2.5rem';

        if(this.label) {

            let h = document.createElement('h3');
            h.innerText = this.label;
            this.headerElement.appendChild(h);
        }

        if(this.description) {

            let d = document.createElement('div');
            d.style.maxWidth = '640px';
            let p = document.createElement('p');
            p.innerHTML = this.description;

            d.appendChild(p);
            this.headerElement.appendChild(d);
        }

        this.element.appendChild(this.headerElement);
       return true;
    }

    redraw() {
    }

    hide() {
        this.headerElement.style.opacity = '0';
    }

    show() {
        this.headerElement.style.opacity = '1';
    }
}
