import { EitiReport, EitiPayments } from "@local/d3_types"


export const reconParameterList = ()  => {

    return [
        {
            "label": "Absoluut verschil tussen aangeleverde betaalstromen",
            "column": "difference_in_reported_absolute",
            "colour": "orange",
            "format": ""
        },
        {
            "label": "Percentueel verschil tussen aangeleverde betaalstromen",
            "column": "difference_in_reported_relative",
            "colour": "orange",
            "format": "percentage"
        },
        {
            "label": "Verschil tussen midden aangeleverde betaalstromen en midden van uitkomsten",
            "column": "difference_reported_and_middle_after",
            "colour": "orange",
            "format": "percentage"
        },
        {
            "label": "Absoluut verschil tussen door bedrijf aangeleverde betaalstroom en uitkomst overheid",
            "column": "discrepancy_company_absolute",
            "colour": "orange",
            "format": ""
        },
        {
            "label": "Relatief verschil tussen door bedrijf aangeleverde betaalstroom en uitkomst overheid",
            "column": "discrepancy_company_relative",
            "colour": "orange",
            "format": "percentage"
        },
        {
            "label": "Absoluut verschil tussen door overheid aangeleverde betaalstroom en uitkomst overheid",
            "column": "discrepancy_government_absolute",
            "colour": "orange",
            "format": ""
        },
        {
            "label": "Relatief verschil tussen door overheid aangeleverde betaalstroom en uitkomst overheid",
            "column": "discrepancy_government_relative",
            "colour": "orange",
            "format": "percentage"
        },
    ]

}


export const formatReconData = (data: EitiReport[]) => {


    for (let report of data) {

        const middleBefore = (report["payments_companies_reported"] - report["payments_government_reported"]) / 2;
        const middleAfter = (report["payments_companies"] - report["payments_government"]) / 2;

        const params = reconParameterList().map( (p) => p.column);

        report[params[0]] = report["payments_companies_reported"] - report["payments_government_reported"];
        report[params[1]] = 100 * ((report["payments_companies_reported"] - report["payments_government_reported"]) / report["payments_companies_reported"])
        report[params[2]] = middleAfter - middleBefore;

        report[params[3]] =  report["payments_government"] - report["payments_companies_reported"]
        report[params[4]] =  100 * (( report["payments_government"] - report["payments_companies_reported"]) / report["payments_government"])
        
        report[params[5]] =  report["payments_government"] - report["payments_government_reported"]
        report[params[6]] =  100 * ((report["payments_government"] - report["payments_government_reported"]) / report["payments_government"]);

        report['outcome_absolute'] = report["payments_government"]
        const middle = (report["payments_companies_reported"] + report["payments_government_reported"]) / 2
        report['outcome_relative'] = 100 * (report["payments_government"] - middle) / middle ;

    }

    return data;
}

