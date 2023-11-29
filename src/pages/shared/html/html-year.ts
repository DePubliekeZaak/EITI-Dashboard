export class HTMLYear {

    container: HTMLDivElement;

    constructor(
        private ctrlr,
        private wrapper,
        private orientation?:  string
    ){
       
    }

    draw(data) {

        this.container = document.createElement('div');
        this.container.classList.add('year_info');


        this.container.style.alignItems = this.orientation  == 'center' ? 'center' : 'flex-start';
     
        let d = document.createElement('div');

        let h = document.createElement('h3');
        h.innerText = data;
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
