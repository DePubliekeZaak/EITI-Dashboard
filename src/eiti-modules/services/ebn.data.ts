const makeMillion = (n: number) => {
    return 1000 * 1000 * Math.round(10 * n) / 10;
}

export const parseEBN = (mapping, data) => {

    const dataGroup = "payments";

    const o = {}

    for (const cat of mapping.parameters[0]) {

        let payment: any;
        let payments;
        let sales: number;
        let costs:  number

        

        switch (cat.label) {

            case 'Gasterra':
                payment = data.find( p => p.origin == "gasterra" && p.payment_stream == 'sales');
                sales = makeMillion(payment.payments_companies) ;
                payment = data.find( p => p.recipient == "gasterra" && p.payment_stream == 'costs');
                costs = makeMillion(payment.payments_companies);
            break;

            case 'Groningen':
                payment = data.find( p => p.origin == "nam" && p.project === 'groningen' && p.payment_stream == 'sales');
                sales = makeMillion(payment.payments_companies);
                payment = data.find( p => p.recipient == "nam" && p.project === 'groningen' && p.payment_stream == 'costs');
                costs = makeMillion(payment.payments_companies);
            break;

            case 'Olie & Gas Exploratie & Productie':
                payments = data.filter( p => !(p.origin == "nam" && ['groningen','aggregated'].indexOf(p.project) > -1) && p.origin !== "gasterra" && p.origin !== 'others' && p.payment_stream == 'sales');
                sales = makeMillion(payments.map( p => p.payments_companies).reduce( (sum,p) => sum + p,0));
                payments = data.filter( p => !(p.recipient == "nam" && ['groningen','aggregated'].indexOf(p.project) > -1) && p.recipient !== "gasterra" && p.recipient !== 'others' && p.payment_stream == 'costs');
                costs = makeMillion(payments.map( p => p.payments_companies).reduce( (sum,p) => sum + p,0));
            break;

            case 'Overige':
                payments = data.filter( p => p.origin === 'others' && p.payment_stream == 'sales');
                sales = makeMillion(payments.map( p => p.payments_companies).reduce( (sum,p) => sum + p,0));
                payments = data.filter( p => p.recipient === 'others' && p.payment_stream == 'costs');
                costs = makeMillion(payments.map( p => p.payments_companies).reduce( (sum,p) => sum + p,0));
        }

        o[cat.column] = [
            sales, costs

        ]
    }

    return o;
}