export class HTMLCompany {

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
        this.container.classList.add('company_info')
     //   this.container.classList.add('graph-container-3');
     //   this.container.classList.add('graph-grid-column-end-3');
     
        
        let d = document.createElement('div');
     //   d.style.paddingRight = '4rem';
        // this.headerElement.style.marginBottom = '2.5rem';

        // console.log(this.data);

        let h = document.createElement('h4');
        h.innerText = this.data[this.data.length - 1]['entity_name'];
        d.appendChild(h);

        let s = document.createElement('span');
        s.innerText = this.data[this.data.length - 1]['sector'];
        d.appendChild(s);


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
