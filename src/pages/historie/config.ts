import { IGroupMappingV2 } from "../shared/interfaces";

const bedrijf : IGroupMappingV2[] = [
    {
        "slug" : "history_fs",
        "ctrlr": "ProgressGroupV1",
        "graphs": [
            {
            "slug" : "fysieke_schade",
            "ctrlr" : "BarTrendV1",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "schademeldingen",
                        "column": "fysieke_schade_meldingen",
                        "colour": "orange"
                    },
                    {
                        "label": "afgehandeld",
                        "column": "fysieke_schade_afgehandeld",
                        "colour": "green"
                    },
                    {
                        "label": "uitgekeerd",
                        "column": "fysieke_schade_uitgekeerd",
                        "colour": "blue"
                    },
                    {
                        "label": "werkvoorraad",
                        "column": "fysieke_schade_werkvoorraad",
                        "colour": "blue"
                    },
                ],
                [
                    {
                        "label": "toename",
                        "column": "",
                        "colour": "orange"
                    },
                    {
                        "label": "cumulatief",
                        "column": "cumulatief",
                        "colour": "orange"
                    },   
                ],
                [
                    {
                        "label": "vaste vergoeding",
                        "column": "vaste_vergoeding",
                        "colour": "purple"
                    },
                    {
                        "label": "gepauzeerd", // n.a.v. parlementaire enquete
                        "column": "gepauzeerd",
                        "colour": "purple"
                    }
                ]
            ]
        }
        ],
        "header": "Fysieke schade",
        "functionality": ['combiSelect','table', 'definitions','download'],
        "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
        "endpoints": ["historie"],
        "segment": "meldingen",
    },
    // {
    //     "slug" : "history_ves",
    //     "ctrlr": "ProgressGroupV1",
    //     "graphs": [
    //         {
    //             "slug" : "vaste_vergoeding",
    //             "ctrlr" : "BarTrendV1",
    //             "args" : [],
    //             "parameters": [
    //                 [
    //                     {
    //                         "label": "aanvragen",
    //                         "column": "vaste_vergoeding_aanvragen",
    //                         "colour": "orange"
    //                     },
    //                     {
    //                         "label": "afgehandeld",
    //                         "column": "vaste_vergoeding_afgehandeld",
    //                         "colour": "green"
    //                     },
    //                     {
    //                         "label": "werkvoorraad",
    //                         "column": "vaste_vergoeding_werkvoorraad",
    //                         "colour": "blue"
    //                     },
    //                 ],
    //                 [
    //                     {
    //                         "label": "toename",
    //                         "column": "",
    //                         "colour": "orange"
    //                     },
    //                     {
    //                         "label": "cumulatief",
    //                         "column": "cumulatief",
    //                         "colour": "orange"
    //                     },   
    //                 ]
    //             ]
    //         }
    //     ],
    //     "header": "Vaste vergoeding",
    //     "functionality": ['combiSelect','tableView', 'download'],
    //     "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
    //     "endpoints": ["historie"],
    //     "segment": "vaste_vergoeding_aanvragen",
    // },
    {
        "slug" : "history_wd",
        "ctrlr": "ProgressGroupV1",
        "graphs": [
            {
            "slug" : "waardedaling",
            "ctrlr" : "BarTrendV1",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "aanvragen",
                        "column": "waardedaling_aanvragen",
                        "colour": "orange"
                    },
                    {
                        "label": "afgehandeld",
                        "column": "waardedaling_afgehandeld",
                        "colour": "green"
                    },
                    {
                        "label": "werkvoorraad",
                        "column": "waardedaling_werkvoorraad",
                        "colour": "blue"
                    },
                ],
                [
                    {
                        "label": "toename",
                        "column": "",
                        "colour": "orange"
                    },
                    {
                        "label": "cumulatief",
                        "column": "cumulatief",
                        "colour": "orange"
                    },   
                ]
            ]
            }
        ],
        "header": "Waardedalingsregeling",
        "functionality": ['combiSelect','table', 'download'],
        "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
        "endpoints": ["historie"],
        "segment": "aanvragen",
    },
    {
        "slug" : "history_ims",
        "ctrlr": "ProgressGroupV1",
        "graphs": [
            {
            "slug" : "immateriele_schade",
            "ctrlr" : "BarTrendV1",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "aanvragen",
                        "column": "immateriele_schade_aanvragen",
                        "colour": "orange"
                    },
                    {
                        "label": "afgehandeld",
                        "column": "immateriele_schade_afgehandeld",
                        "colour": "green"
                    },
                    {
                        "label": "werkvoorraad",
                        "column": "immateriele_schade_werkvoorraad",
                        "colour": "blue"
                    },
                ],
                [
                    {
                        "label": "toename",
                        "column": "",
                        "colour": "orange"
                    },
                    {
                        "label": "cumulatief",
                        "column": "cumulatief",
                        "colour": "orange"
                    },   
                ]
            ]
            }
        ],
        "header": "Immateriele schade",
        "functionality": ['combiSelect','table', 'download'],
        "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
        "endpoints": ["historie"],
        "segment": "aanvragen",
    }
];

export default bedrijf;