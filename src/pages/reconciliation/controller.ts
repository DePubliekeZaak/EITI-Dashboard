import { IDashboardController } from '@local/dashboard';
import PageController from '../shared/page.controller';
import config from './config';
import groups from './groups';
import graphs from './graphs';


export default class ReconciliationController extends PageController {


    constructor(main: IDashboardController) {

        super(main);
    }

    async init()  {


        await super.init(config, groups, graphs)
    }
}


