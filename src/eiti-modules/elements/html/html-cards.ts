import { EitiEntity } from "@local/d3_types/data";

export class HtmlCardsV1 {

    container: HTMLDivElement;

    constructor(
        private ctrlr,
        private wrapper,
    ){
       
    }


    insert(tagName: string, parent: HTMLElement, classes?: string[]) {
        const el = document.createElement(tagName);
        parent.appendChild(el);
        if (classes != undefined) {
            for (const c of classes) {
                el.classList.add(c);
            }
        }
        return el;
    }

    draw(members: EitiEntity[]) {

        const wrapper = this.insert('section',this.wrapper,["graph-container-12","graph-wrapper"])
        wrapper.style.marginBottom = "3rem";
        wrapper.style.alignItems = "stretch";
        

        for (let m of members) {

            const card = this.insert("article",wrapper,["graph-container-6","card"]);
            const container = this.insert("div", card);

            if (m.trade_name !== null) {

                const trade_name = this.insert('h4', container);
                trade_name.innerText = m.trade_name || m.name;

            } else {
                const placeholder = this.insert('span', container);
                placeholder.innerText = m.name;
            }

            if (m.parent_company !== null) {
                const parent_company = this.insert('span', container);
                parent_company.innerText = 'moederbedrijf: ' + m.parent_company;
            }

            if(m.registration_ref !== null) {

                const registration_ref = this.insert('div', container); // object.insert.style.inner
                registration_ref.innerText = 'KvK nummer: ' + m.registration_ref;

            }

            if (m.registry_link !== null) {

                const link = this.insert('a', container) as HTMLLinkElement;
                link.href = m.registry_link;
                link.target = "_blank";
                link.innerText = m.registry_place;

            }
    
        }

        // this.container = document.createElement('div');
        // this.container.classList.add('sector_info')
     
        // let d = document.createElement('div');

        // let h = document.createElement('h4');
        // h.innerText = this.data + ":";
        // d.appendChild(h);

        // this.container.appendChild(d);
        // this.wrapper.insertBefore(this.container,this.wrapper.childNodes[0]);
        
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
