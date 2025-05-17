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
                const label = this.ctrlr.page.main.params.language == 'en' ? 'Parent company: ' : 'moederbedrijf: ';
                const text = this.ctrlr.page.main.params.language == 'en' ? m.parent_company_en : m.parent_company
                parent_company.innerText =  label + text;
            }

            if(m.registration_ref !== null) {

                const registration_ref = this.insert('div', container); // object.insert.style.inner
                const label = this.ctrlr.page.main.params.language == 'en' ? 'Registration ref: ' : 'KvK nummer: ';
                registration_ref.innerText = label + m.registration_ref;

            }

            if (m.registry_link !== undefined && m.registry_place !== undefined && m.registry_place_en !== undefined) {

                const link = this.insert('a', container) as HTMLLinkElement;
        
                link.href = m.registry_link;
                link.target = "_blank";
                link.innerText = this.ctrlr.page.main.params.language == 'en' ? m.registry_place_en : m.registry_place

                if (m.slug == 'nam') {

                    let span = document.createElement('span');
                    span.innerHTML = " / ";
                    container.appendChild(span);
                    const link = this.insert('a', container) as HTMLLinkElement;
                    link.href = "https://www.nasdaq.com/market-activity/stocks/xom/institutional-holdings"
                    link.target = "_blank";
                    link.innerText = this.ctrlr.page.main.params.language == 'en' ? "Nasdaq" : "Nasdaq"

                }
                
            }
        }
        
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
