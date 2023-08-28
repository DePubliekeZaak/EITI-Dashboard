import { IGraphMapping} from '@local/d3_types';

export const economy : IGraphMapping[] = [
    {
        "slug" : "shares_in_economy",
        "graph": "EconomySharesGroupV1",
        "args" : [],
        "parameters": [
            [
                {
                    "label": "BBP Mijnbouw",
                    "column": "gdp_mining",
                    "colour": "orange"
                },
                {
                    "label": "BBP Totaal",
                    "column": "gdp_total",
                    "colour": "blue"
                },
            ],
            [
                {
                    "label": "Overheidsinkomsten mijnbouw",
                    "column": "gov_revenues_mining",
                    "colour": "orange"
                },
                {
                    "label": "Overheidsinkomsten totaal",
                    "column": "gov_revenues_total",
                    "colour": "blue"
                },
            ],
            [
                {
                    "label": "Uitvoer mijnbouw",
                    "column": "export_mining",
                    "colour": "orange"
                },
                {
                    "label": "Uitvoer totaal",
                    "column": "export_total",
                    "colour": "blue"
                },
            ],
            [
                {
                    "label": "Werkgelegenheid mijnbouw",
                    "column": "employment_mining",
                    "colour": "orange"
                },
                {
                    "label": "Werkgelegenheid totaal",
                    "column": "employment_total",
                    "colour": "blue"
                },
            ],
            [
                {
                    "label": "Investeringen mijnbouw",
                    "column": "investments_mining",
                    "colour": "orange"
                },
                {
                    "label": "Investeringen totaal",
                    "column": "investments_total",
                    "colour": "blue"
                }
            ]
        ],
        "header": "Aandeel van mijnbouw in de economie",
        "multiGraph": true,
        "functionality": ["shareTotalSelect","tableView","download"],
        "description": "<p>Cras id arcu a enim pretium iaculis at vel justo. Aliquam lacinia posuere ante, a viverra tortor posuere in. Donec elementum faucibus viverra. Duis nec diam bibendum, eleifend massa sit amet, ullamcorper velit. Vestibulum sed metus nulla. Donec dapibus lorem id nibh vestibulum porta ac sit amet nisl. Donec eu tortor nec orci hendrerit tristique non non quam. Suspendisse pulvinar felis vitae neque maximus scelerisque. Integer ut ullamcorper erat, eu auctor nisl. Quisque orci sapien, viverra at ullamcorper sed, fermentum ac sapien.</p>",
        "endpoint": "economy",
        "segment": "percentage",
        "elementClasslist": ['graph-container','graph-container-12']
    },
    {
        "slug" : "social",
        "graph": "EconomyProdGroupV1",
        "args" : [],
        "parameters": [
            [
                {
                    "label": "Ruwe aardolie en ruwe olie uit bitumineuze mineralen (2709)",
                    "column": "prod_2709_volume",
                    "colour": "orange"
                },
                {
                    "label": "Ruwe aardolie en ruwe olie uit bitumineuze mineralen (2709)",
                    "column": "prod_2709_price",
                    "colour": "orange"
                },
                {
                    "label": "Ruwe aardolie en ruwe olie uit bitumineuze mineralen (2709)",
                    "column": "export_2709_volume",
                    "colour": "blue"
                },
                {
                    "label": "Ruwe aardolie en ruwe olie uit bitumineuze mineralen (2709)",
                    "column": "export_2709_price",
                    "colour": "blue"
                }
            ],
            [
                {
                    "label": "Aardgas en andere gasvormige koolwaterstoffen (2711)",
                    "column": "prod_2711_volume",
                    "colour": "orange"
                },
                {
                    "label": "Aardgas en andere gasvormige koolwaterstoffen (2711)",
                    "column": "prod_2711_price",
                    "colour": "orange"
                },
                {
                    "label": "Aardgas en andere gasvormige koolwaterstoffen (2711)",
                    "column": "export_2711_volume",
                    "colour": "blue"
                },
                {
                    "label": "Aardgas en andere gasvormige koolwaterstoffen (2711)",
                    "column": "export_2711_price",
                    "colour": "blue"
                },
            ],
            [
                {
                    "label": "Zout en zuiver natriumchloride (2501)",
                    "column": "prod_2501_volume",
                    "colour": "orange"
                },
                {
                    "label": "Zout en zuiver natriumchloride (2501)",
                    "column": "prod_2501_price",
                    "colour": "orange"
                },
                {
                    "label": "Zout en zuiver natriumchloride (2501)",
                    "column": "export_2501_volume",
                    "colour": "blue"
                },
                {
                    "label": "Zout en zuiver natriumchloride (2501)",
                    "column": "export_2501_price",
                    "colour": "blue"
                }
            ]
        ],
        "header": "Productie en export",
        "multiGraph": true,
        "functionality": ["tableView","download"],
        "description": "<p>Cras id arcu a enim pretium iaculis at vel justo. Aliquam lacinia posuere ante, a viverra tortor posuere in. Donec elementum faucibus viverra. Duis nec diam bibendum, eleifend massa sit amet, ullamcorper velit. Vestibulum sed metus nulla. Donec dapibus lorem id nibh vestibulum porta ac sit amet nisl. Donec eu tortor nec orci hendrerit tristique non non quam. Suspendisse pulvinar felis vitae neque maximus scelerisque. Integer ut ullamcorper erat, eu auctor nisl. Quisque orci sapien, viverra at ullamcorper sed, fermentum ac sapien.</p>",
        "endpoint": "economy",
        "segment": "prijs",
        "elementClasslist": ['graph-container','graph-container-12']
    },
    {
        "slug" : "productie_vs_export",
        "graph": "EconomySocialGroupV1",
        "args" : [],
        "parameters": [
            [
                {
                    "label": "Sociale betalingen",
                    "column": "sociale_betalingen",
                    "colour": "green"
                }
            ],
            [
                {
                    "label": "Milieubetaling - afdracht energiebelasting",
                    "column": "energiebelasting",
                    "colour": "green"
                }
            ],
            [
                {
                    "label": "Milieubetaling - opslag duurzame energie",
                    "column": "milieubetaling_opslag",
                    "colour": "green"
                }
            ],
            [
                {
                    "label": "Betalingen aan waterschappen",
                    "column": "betalingen_aan_waterschappen",
                    "colour": "green"
                }
            ]
        ],
        "header": "Sociale betalingen, milieu en waterschappen",
        "multiGraph": true,
        "functionality": ["priceVolumeSelect","tableView","download"],
        "description": "<p>Cras id arcu a enim pretium iaculis at vel justo. Aliquam lacinia posuere ante, a viverra tortor posuere in. Donec elementum faucibus viverra. Duis nec diam bibendum, eleifend massa sit amet, ullamcorper velit. Vestibulum sed metus nulla. Donec dapibus lorem id nibh vestibulum porta ac sit amet nisl. Donec eu tortor nec orci hendrerit tristique non non quam. Suspendisse pulvinar felis vitae neque maximus scelerisque. Integer ut ullamcorper erat, eu auctor nisl. Quisque orci sapien, viverra at ullamcorper sed, fermentum ac sapien.</p>",
        "endpoint": "economy",
        "segment": "prijs",
        "elementClasslist": ['graph-container','graph-container-12']
    },
    
    // {
    //     "slug" : "shares_in_economy",
    //     "graph": "EconomyPiesGroupV1",
    //     "args" : [],
    //     "parameters": [
    //         [
    //             {
    //                 "label": "BBP Mijnbouw",
    //                 "column": "gdp_mining",
    //                 "colour": "orange"
    //             },
    //             {
    //                 "label": "BBP Totaal",
    //                 "column": "gdp_total",
    //                 "colour": "blue"
    //             },
    //         ],
    //         [
    //             {
    //                 "label": "Overheidsinkomsten mijnbouw",
    //                 "column": "gov_revenues_mining",
    //                 "colour": "orange"
    //             },
    //             {
    //                 "label": "Overheidsinkomsten totaal",
    //                 "column": "gov_revenues_total",
    //                 "colour": "blue"
    //             },
    //         ],
    //         [
    //             {
    //                 "label": "Uitvoer mijnbouw",
    //                 "column": "export_mining",
    //                 "colour": "orange"
    //             },
    //             {
    //                 "label": "Uitvoer totaal",
    //                 "column": "export_total",
    //                 "colour": "blue"
    //             },
    //         ],
    //         [
    //             {
    //                 "label": "Werkgelegenheid mijnbouw",
    //                 "column": "employment_mining",
    //                 "colour": "orange"
    //             },
    //             {
    //                 "label": "Werkgelegenheid totaal",
    //                 "column": "employment_total",
    //                 "colour": "blue"
    //             },
    //         ],
    //         [
    //             {
    //                 "label": "Investeringen mijnbouw",
    //                 "column": "investments_mining",
    //                 "colour": "orange"
    //             },
    //             {
    //                 "label": "Investeringen totaal",
    //                 "column": "investments_total",
    //                 "colour": "blue"
    //             }
    //         ]
    //     ],
    //     "header": "Aandeel van mijnbouw in de economie",
    //     "multiGraph": true,
    //     "functionality": [],
    //     "description": "<p>Cras id arcu a enim pretium iaculis at vel justo. Aliquam lacinia posuere ante, a viverra tortor posuere in. Donec elementum faucibus viverra. Duis nec diam bibendum, eleifend massa sit amet, ullamcorper velit. Vestibulum sed metus nulla. Donec dapibus lorem id nibh vestibulum porta ac sit amet nisl. Donec eu tortor nec orci hendrerit tristique non non quam. Suspendisse pulvinar felis vitae neque maximus scelerisque. Integer ut ullamcorper erat, eu auctor nisl. Quisque orci sapien, viverra at ullamcorper sed, fermentum ac sapien.</p>",
    //     "endpoint": "economy",
    //     "segment": "2022",
    //     "elementClasslist": ['graph-container','graph-container-12']
    // }
]