
export const HTMLSource = (wrapper: HTMLElement, lan: string, text: string) => { 


        let container = document.createElement('div');
        container.classList.add('source_attribution');
     
        let span = document.createElement('span');
        let s = lan == 'en' ? 'source: ' : 'bron: ';
        span.innerText = s + text;

        container.appendChild(span);
        wrapper.insertBefore(container,wrapper.querySelector(".graph-wrapper"));
        
        return container;
}
