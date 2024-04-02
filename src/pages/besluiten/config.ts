import { IGroupMappingV2 } from "../shared/interfaces";

const group : IGroupMappingV2[] = [
    {
        "slug" : "history_fs_besluiten",
        "ctrlr": "BesluitenGroupV1",
        "graphs": [
            {
            "slug" : "besluiten_taart",
            "ctrlr" : "PieChartV1",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Meldingen met afwijzing",
                        "column": "fysieke_schade_afgewezen_besluiten",
                        "colour": "orange"
                    },
                    {
                        "label": "Besluiten met toekenning",
                        "column": "fysieke_schade_toegewezen_besluiten",
                        "colour": "blue"
                    }
                ],
                [
                    {
                        "label": "Percentage toegekend",
                        "column": "fysieke_schade_percentage_toegewezen_besluiten",
                        "colour": "purple"
                    }
                ]
            ]
            },
            {
                "slug" : "besluiten_trend",
                "ctrlr" : "BarTrendStackedBesluiten",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Besluiten met afwijzing",
                            "column": "fysieke_schade_nieuw_afgewezen_besluiten",
                            "colour": "orange"
                        },
                        {
                            "label": "Besluiten met toekenning",
                            "column": "fysieke_schade_nieuw_toegewezen_besluiten",
                            "colour": "blue"
                        }
                    ],
                    [
                        {
                            "label": "percentage toegekend",
                            "column": "fysieke_schade_nieuw_percentage_toegewezen_besluiten",
                            "colour": "purple"
                        }
                    ]
                ]
            }
        ],
        "header": "Besluiten",
        "functionality": ['table', 'definitions','download'],
        "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
        "endpoints": ["historie"],
        "segment": "meldingen",
    },
    {
        "slug" : "history_fs_percentage_goedgekeurd_geo",
        "ctrlr": "GeoGroupV1",
        "graphs": [
            {
                "slug" : "gem_bedrag_geo_",
                "ctrlr" : "MapV1",
                "multiples" : "geo",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Percentage toegewezen besluiten",
                            "column": "percentage_toegewezen_besluiten",
                            "colour": "blue",
                            "format": "percentage"
                        }
                    ],
                    []
                ]
            }
        ],
        "header": "Spreiding van het percentage toegewezen besluiten",
        "functionality": ['table', 'definitions','download'],
        "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
        "endpoints": ["map"],
        "segment": "meldingen",
    }
];

export default group;