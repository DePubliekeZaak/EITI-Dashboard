export class HtmlSegment {

    constructor(
        private element
    ){}

    draw(segment) {

        let segmentEl = this.element.querySelector('.article_category');

        if (segmentEl) { segmentEl.parentNode.removeChild(segmentEl)}

        if (segment !== 'all') {

            let span = document.createElement('span');
            span.classList.add('article_category');
            span.innerText = segment;
            span.style.fontFamily = 'NotoSans Regular';
            span.style.textAlign = 'center';
            span.style.fontSize = '1rem';
            span.style.margin = '-1rem 0 0 .5rem';
            span.style.fontSize = '.71rem';
            span.style.padding = '0.125rem 0rem';
            span.style.color = 'black';
            span.style.alignSelf = 'flex-start';
            span.style.textTransform = 'capitalize';
            span.style.borderBottom = '1px solid black';

            let headerElement = this.element.querySelector('.article_header');
            this.element.insertBefore(span, headerElement.nextSibling);

        }
    }

    redraw() {
    }
}
