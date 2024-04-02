import { IGroupMappingV2 } from "../shared/interfaces";

const group : IGroupMappingV2[] = [
    {
        "slug" : "history_fs_vergoedingen",
        "ctrlr": "SchadevergoedingenGroupV1",
        "graphs": [
            {
            "slug" : "schadevergoedingen_taart",
            "ctrlr" : "PieChartSumV1",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Mijnbouwschade",
                        "column": "fysieke_schade_schadebedrag",
                        "colour": "brown",
                        "format" : "currency",
                        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. "
                    },
                    {
                        "label": "Stuwmeerregeling",
                        "column": "fysieke_schade_stuwmeerregeling_bedrag",
                        "colour": "blue",
                        "format" : "currency",
                        "description" :"Consequat interdum varius sit amet mattis vulputate. Magna sit amet purus gravida. Est velit egestas dui id ornare arcu. Malesuada fames ac turpis egestas maecenas pharetra convallis."
                    },
                    {
                        "label": "Bijkomende kosten",
                        "column": "fysieke_schade_bijkomende_kosten_bedrag",
                        "colour": "moss",
                        "format" : "currency",
                        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. "

                    },
                    {
                        "label": "Wettelijke rente",
                        "column": "fysieke_schade_wettelijke_rente_bedrag",
                        "colour": "orange",
                        "format" : "currency",
                        "description" :"Consequat interdum varius sit amet mattis vulputate. Magna sit amet purus gravida. Est velit egestas dui id ornare arcu. Malesuada fames ac turpis egestas maecenas pharetra convallis."

                    }
                ],
                [
                    {
                        "label": "Totaal verleend",
                        "column": "fysieke_schade_totaal_verleend",
                        "colour": "gray",
                        "format" : "currency",
                        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. "

                    }
                ]
            ]
        }
        ],
        "header": "Schadevergoedingen",
        "functionality": ['table', 'definitions','download'],
        "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
        "endpoints": ["historie"],
        "segment": "meldingen",
    },
    {
        "slug" : "history_fs_gem_schadebedrag",
        "ctrlr": "GemBedragGroupV1",
        "graphs": [
            {
                "slug" : "gem_bedrag_trend",
                "ctrlr" : "BarTrendGemVervoeding",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Gemiddeld schadebedrag",
                            "column": "fysieke_schade_gemiddeld_schadebedrag",
                            "colour": "orange",
                            "format": "currency"
                        }
                    ],
                    []
                ]
            }
        ],
        "header": "Gemiddeld schadebedrag",
        "functionality": ['table', 'definitions','download'],
        "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
        "endpoints": ["historie"],
        "segment": "meldingen",
    },
    {
        "slug" : "history_fs_schadebedrag_ordes",
        "ctrlr": "OrdesBedragGroupV1",
        "graphs": [
            {
                "slug" : "gem_bedrag_ordes",
                "ctrlr" : "SMBandBarsOrdes",
                "multiples" : "years",
                "args" : [],
                "parameters": [
                    [
                        {
                            label: "< €1K",
                            column: "vergoedingen_lager_dan_1000",
                            colour: 'lightBlue'
                        },
                        {
                            label : "€1K t/m €4K",
                            column : "vergoedingen_tussen_1000_en_4000",
                            colour :'orange'
                        },
                        {
                            label : "€4K t/m €10K",
                            column : "vergoedingen_tussen_4000_en_10000",
                            colour: 'moss'
                        },
                        {
                            label : "> €10K",
                            column : "vergoedingen_hoger_dan_10000",
                            colour: 'brown'
                        }
                    ],
                    []
                ]
            }
        ],
        "header": "Ordegrootte van schadevergoedingen",
        "functionality": ['table', 'definitions','download'],
        "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
        "endpoints": ["vergoedingen_jaarlijks?gemeente=eq.all"],
        "segment": "meldingen",
    },
    {
        "slug" : "history_fs_schadebedrag_geo",
        "ctrlr": "GeoGroupV1",
        "graphs": [
            {
                "slug" : "gem_bedrag_geo",
                "ctrlr" : "MapV1",
                "multiples" : "geo",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "Gemiddeld schadebedrag",
                            "column": "gemiddeld_schadebedrag",
                            "colour": "orange",
                            "format": "currency"
                        }
                    ],
                    []
                ]
            }
        ],
        "header": "Spreiding van het gemiddeld uitgekeerd schadebedrag",
        "functionality": ['table', 'definitions','download'],
        "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
        "endpoints": ["map"],
        "segment": "meldingen",
    }
];

export default group;