export class HTMLSector {

    container: HTMLDivElement;

    constructor(
        private wrapper,
        private header: any,
    ){
        this.draw();
    }

    draw() {

        this.container = document.createElement('div');
        this.container.classList.add('sector_info')
     
        let d = document.createElement('div');

        let h = document.createElement('h4');
        h.innerText = this.header + ":";
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
