
export interface IDataService {
    collection: () => { [key:string]: any },
    gather: (string) => void,
    fetch: (string) => Promise<any>
}


export class DataService implements IDataService{

    _collection = {};

    constructor () {

    }

    collection() {
        return this._collection;
    }

    async gather(endpoint: string) {

        if(this._collection[endpoint] == undefined) {

            this._collection[endpoint] = await this.fetch(endpoint);
        }
    }

    async fetch(endpoint: string) : Promise<any> {

        return new Promise ( async (resolve, reject) => {

                // @ts-ignore
                const url = (["netherlands","licences2023"].indexOf(endpoint) > -1) ? './' + endpoint + '.geojson' : DOMAIN + APIBASE + endpoint;
  
                const response = await fetch(url);

                if(response.ok) {
                    resolve(response.json())
                } else {
                    reject()
                }
            
        });
        
    }
}