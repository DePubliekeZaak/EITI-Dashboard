export class HTMLYear {

    container: HTMLDivElement;

    constructor(
        private ctrlr,
        private wrapper,
        private data: any,
    ){
        this.draw();
    }

    draw() {

        this.container = document.createElement('div');
        this.container.classList.add('year_info')
     
        let d = document.createElement('div');

        let h = document.createElement('h3');
        h.innerText = this.data;
        d.appendChild(h);

        this.container.appendChild(d);
        this.wrapper.insertBefore(this.container,this.wrapper.childNodes[0]);
        
        return true;
    }

    redraw() {
    }

    hide() {
        this.container.style.opacity = '0';
    }

    show() {
        this.container.style.opacity = '1';
    }
}
