import { IGroupMappingV2 } from '../shared/interfaces';

const config : IGroupMappingV2[] = [
    {
        "slug" : "type_betaalstromen",
        "ctrlr": "RevenueCirclesGroupV1",
        "graphs": [
            {
                "slug" : "revenue_circles",
                "ctrlr" : "RevenueCirclesV1",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "bedrijf",
                            "column": "payments_companies",
                            "colour": "orange"
                        }
                    ]
                ],
            }
        ],
        "header": null,
        "header_en": null,
        "functionality": ['yearSelect','table','definitions','download'],
        "description": "<p>De deelnemende aardgas-, aardolie- en zoutbedrijven geven op vrijwillige basis inzicht in de betaalstromen tussen deze bedrijven en de Nederlandse overheid. Daar waar mogelijk ziet u de bedragen per individuele vergunning. Een externe accountant heeft gecontroleerd of de cijfers van de overheid en de bedrijven overeenkomen, volgens de vereisten van de EITI-Standaard.</p>",
        "description_en": "<p>The participating natural gas, oil and salt companies voluntarily provide insight into the payment flows between these companies and the Dutch government. Where possible you will see the amounts per individual permit. An external accountant has checked whether the government and company figures correspond, according to the requirements of the EITI Standard.   </p>",
        "endpoints": ["payments_aggregated"],
        "segment": "2023",
    },
    {
        "slug" : "type_betaalstromen_per_jaar",
        "ctrlr": "RevenueBarsGroupV1",
        "graphs": [
            {
                "slug" : "revenue_bars",
                "ctrlr": "RevenueBarsV1",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "bedrijf",
                            "column": "payments_companies",
                            "colour": "orange"
                        }
                    ]
                ],
            }
        ],
        "header": "Betalingen per betaalstroom per jaar",
        "header_en": "Payments per revenue type over the years",
        "functionality": ['table','definitions','download'],
        "description": null,
        "description_en": null,
        "endpoints": ["payments_aggregated"],
        "segment": "2023"
    },
    {
        "slug" : "betalingen_bedrijven",
        "ctrlr": "PaymentsGroupV1",
        "graphs" : [
            {
                "slug": "betalingen_bedrijven_1",
                "ctrlr": "PaymentsBarsV1",
                "multiples" : "multiples",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "bedrijf",
                            "column": "payments_companies",
                            "colour": "orange"
                        }
                    ]
                ]
            }
        ],
        "header": "Betalingen van bedrijven per jaar",
        "header_en": "Anual company payments",
        "functionality": ['yearSelect','table','download'],
        "description": null,
        "description_en": null,
        "endpoints": ["reconciliation"],
        "segment": "2023",
    },
    {
        "slug" : "inkomsten_overheid_types",
        "ctrlr": "RevenueTypeSankeyGroupV1",
        "graphs": [
            {
                "slug" : "revenue_sankey",
                "ctrlr" : "RevenueTypeSankeyV1",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "betaalstroom",
                            "column": "payments_companies",
                            "colour": "orange"
                        }
                    ]
                ],
            }
        ],
        "header": " Overzicht betaalstromen tussen bedrijven en overheid per jaar",
        "header_en": "Overview of payments streams between companies and government",
        "functionality": ['yearSelect','table','definitions','download'],
        "description": null,
        "description_en": null,
        "endpoints": ["payments_aggregated"],
        "segment": "2023",
    },
    // {
    //     "slug" : "projects_map_group",
    //     "ctrlr": "ProjectsMapGroupV1",
    //     "graphs": [
    //     {
    //         "slug":"map",
    //         "ctrlr": "ProjectMapV1",
    //         "args": [],
    //         "parameters": [
    //             [
    //                 {
    //                     "label": "Cijns",
    //                     "column": "royalties",
    //                     "colour": "blue"
    //                 }
    //             ]
    //         ]
    //     },
    //     {
    //         "slug":"map",
    //         "ctrlr": "ProjectMapV1",
    //         "args": [],
    //         "parameters": [
    //             [
    //                 {
    //                     "label": "Oppervlakterecht",
    //                     "column": "royalties",
    //                     "colour": "orange"
    //                 }
    //             ]
    //         ]
    //     },
    //     {
    //         "slug":"map",
    //         "ctrlr": "ProjectMapV1",
    //         "args": [],
    //         "parameters": [
    //             [
    //                 {
    //                     "label": "Retributies",
    //                     "column": "retributions",
    //                     "colour": "green"
    //                 }
    //             ]
    //         ]
    //     }
    //     ],
    //     "header": "Betalingen per vergunning voor cijns, oppervlakterecht en retributies",
    //     "header_en": "Payments on licence level for royalties, surface rental and retributions",
    //     "functionality": ['tableView','download'],
    //     "description": "De data invoer is nog involledig wegens variatie in aanduidingen voor vergunningen.",
    //     "description_en": "Data entry is still incomplete, due to varying naming conventions",
    //     "endpoints": ["payments","netherlands","licences2023"],
    //     "segment": "2022",
        
    // }    
];

export default config;