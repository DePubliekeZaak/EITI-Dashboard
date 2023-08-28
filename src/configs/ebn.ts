import { IGraphMapping} from '@local/d3_types';

export const ebn : IGraphMapping[] = [
    {
        "slug" : "betaalstromen_ebn",
        "graph": "EbnSankeyV1",
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
        "header": " Overzicht betaalstromen rondom EBN",
        "multiGraph": false,
        "functionality": ['yearSelect','tableView','download'],
        "description": "<p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse pellentesque, est a pulvinar mattis, ligula sapien pellentesque orci, non tincidunt diam erat imperdiet ligula.</p>",
        "endpoint": "government_revenue",
        "segment": "2022",
        "elementClasslist": ['graph-container','graph-container-12']
    },
    {
        "slug" : "ebn_ontvangsten",
        "graph": "EbnSimpleBarsV2",
        "args" : [],
        "parameters": [
            [
                {
                    "label": "Netto kasstroom",
                    "column": "netto",
                    "colour": "purple"
                },
                {
                    "label": "Ontvangsten",
                    "column": "sales",
                    "colour": "blue"
                },
                {
                    "label": "Kosten",
                    "column": "costs",
                    "colour": "orange"
                }
            ]
        ],
        "header": "Opbrengsten EBN uit verkoop aandelen olie en gas",
        "multiGraph": false,
        "functionality": ['mappingSelect','tableView','download'],
        "description": "<p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse pellentesque, est a pulvinar mattis, ligula sapien pellentesque orci, non tincidunt diam erat imperdiet ligula.</p>",
        "endpoint": "payments",
        "segment": "netto",
        "elementClasslist": ['graph-container','graph-container-12']
    },
    {
        "slug" : "ebn_books",
        "graph": "EbnCircleGroupV2",
        "args" : [],
        "parameters": [
            [
                {
                    "label": "Gasterra",
                    "column": "gasterra",
                    "colour": "purple"
                },
                {
                    "label": "Groningen",
                    "column": "groningen",
                    "colour": "blue"
                },
                {
                    "label": "Olie & Gas Exploratie & Productie",
                    "column": "oil",
                    "colour": "orange"
                },
                {
                    "label": "Overige",
                    "column": "overig",
                    "colour": "green"
                }
            ]
        ],
        "header": "Opbrengsten EBN uit verkoop aandelen olie en gas",
        "multiGraph": true,
        "functionality": ['tableView','download'],
        "description": "<p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse pellentesque, est a pulvinar mattis, ligula sapien pellentesque orci, non tincidunt diam erat imperdiet ligula.</p>",
        "endpoint": "payments",
        "segment": "sales",
        "elementClasslist": ['graph-container','graph-container-12']
    },
    // {
    //     "slug" : "ebn_ontvangsten_per_bedrijf",
    //     "graph": "EbnGroupV1",
    //     "args" : [],
    //     "parameters": [
    //         [
    //             {
    //                 "label": "bedrijf",
    //                 "column": "payments_companies",
    //                 "colour": "orange"
    //             }
    //         ]
    //     ],
    //     "header": null,
    //     "multiGraph": true,
    //     "functionality": ['tableView','download'],
    //     "description": "<p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse pellentesque, est a pulvinar mattis, ligula sapien pellentesque orci, non tincidunt diam erat imperdiet ligula. Cras tincidunt purus sed tortor blandit venenatis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum est eros, laoreet vel justo ut, volutpat bibendum quam. Fusce ut efficitur lacus, sed sodales odio. Nulla elit sapien, cursus a risus et, ullamcorper feugiat augue. Morbi mollis dui id laoreet consectetur. Aenean massa massa, aliquam ultrices rhoncus eget, faucibus nec mi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin non mi lorem.</p>",
    //     "endpoint": "payments",
    //     "segment": "2022",
    //     "elementClasslist": ['graph-container','graph-container-12']
    // },
    
]