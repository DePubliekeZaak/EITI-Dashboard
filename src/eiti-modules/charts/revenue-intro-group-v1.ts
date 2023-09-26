import { IGraphMapping } from '@local/d3_types';
import {  HtmlFunctionality, HtmlHeader, HTMLTable } from '@local/elements';
import { EitiData } from '@local/d3_types';
import { IDashboardController } from '@local/dashboard';

import { RevenueCirclesV1 } from './revenue-circles-v1';
import { RevenueBarsV1 } from './revenue-bars-v1';


export type IGraphGroupControllerV2 = {
    main: IDashboardController
    data: EitiData;
    segment: string;
    init: () => void;
    prepareData: (data: EitiData) => EitiData[];
    update: (data: EitiData, segment: string, update: boolean) => void
}

// can this be a wrapper for multiple graphcontrollers?
export class RevenueIntroGroupV1 implements IGraphGroupControllerV2 { 

    circleGroup: any;
    barProgression: any;

    funcList: any;
    table;

    htmlHeader;
    yearSelector;

    constructor(
        public main: any,
        public data : EitiData,
        public element : HTMLElement,
        public mapping: IGraphMapping,
        public segment: string  
    ){}

    async init() {

        const self = this;

        if (this.mapping.header) {
            this.htmlHeader = new HtmlHeader(this.element, this.mapping.header,this.mapping.description);
            this.htmlHeader.draw(); 
        }

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList = new HtmlFunctionality(this,this.element,this.mapping,this.segment);
        }

        const wrapper = document.createElement('section');
        wrapper.classList.add('graph-container-12');
        wrapper.classList.add('graph-wrapper');
      //  wrapper.style.marginBottom = "2rem";
        this.element.appendChild(wrapper);

        
        // this.barProgression.init();

        const data = this.prepareData(this.data);

     //   this.circleGroup = new RevenueCirclesV1(this.main,data[0],wrapper,this.mapping,this.segment);
        this.barProgression = new RevenueBarsV1(this,data[0],wrapper,this.mapping,this.segment);
        // this.circleGroup.init();
        this.barProgression.init();

        await this.update(this.data,this.segment, false);

        if (this.mapping.functionality && this.mapping.functionality.length > 0) {
            this.funcList.draw();
        }

       // this.table.draw(data);
    }

    prepareData(data: EitiData) : EitiData[] {

        const dataGroup = "payments";

   
        return [data];
    }

    
    async update(data: EitiData, segment: string, update: boolean) {

        this.segment = segment;
        

        if(update) {
            const formattedData = this.prepareData(data);
        //    await this.circleGroup.update(formattedData[0]);
            await this.barProgression.update(formattedData[0]);
        }
    } 
}
