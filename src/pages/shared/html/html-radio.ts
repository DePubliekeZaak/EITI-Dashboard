import { IGraphControllerV3 } from "../../../charts/core/graph-v3";
import { IParameterMapping } from "../../../charts/core/types";
import { IGroupCtrlr } from "../interfaces";


export class HtmlRadio {



    constructor(public ctrlr: any, public params: IParameterMapping[], public el: HTMLElement) {

        this.init();
    }

    init() {

        const self = this;

        const list = document.createElement('ul');
        list.style.display = "flex";
        list.style.flexDirection = "row";
        // list.style.margin = "-20px 0 50px 40px";

        for (let p of this.params) {

            const li = document.createElement('li');
            li.classList.add("radio_button");
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = p.column;
            input.value = p.column;
            input.name = 'influence';

            input.addEventListener("change", () => {
                if (input.checked) {
                    console.log("Checkbox is checked..");
                  } else {
                    console.log("Checkbox is not checked..");
                  }

                  const all = [].slice.call(list.querySelectorAll('input'));
                  const rest = all.filter( i =>  i.id != p.column);

                  for (let other of rest) {
                    other.checked = false;
                  }

                  self.ctrlr.update(this.ctrlr.group.data, this.ctrlr.segment, true);
            });
            

            const label = document.createElement('label');
            label.htmlFor = p.column;
            label.innerText = p.label;
            label.style.margin = "0 .5rem";

            li.appendChild(input);
            li.appendChild(label);

            list.appendChild(li)
        }

        let li = document.createElement('li');
        li.appendChild(list);


     //   this.el.insertBefore(list, this.el.getElementsByTagName("section")[0]);
        this.el.querySelector(".filter_list ul")?.appendChild(li);
        
    }



}