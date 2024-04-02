import { IGroupMappingV2 } from "../shared/interfaces";

const bezwaren : IGroupMappingV2[] = [
    {
        "slug" : "history_bezwaren",
        "ctrlr": "BezwarenGroupV1",
        "graphs": [
            {
            "slug" : "bezwaren_taart",
            "ctrlr" : "PieChartV1",
            "args" : [],
            "parameters": [[
                {
                    "label": "Gegrond",
                    "column": "bezwaren_gegrond",
                    "colour": "purple"
                },
                {
                    "label": "Deels gegrond",
                    "column": "bezwaren_deels_gegrond",
                    "colour": "lightBlue"
                },
                {
                    "label": "Ongegrond",
                    "column": "bezwaren_ongegrond",
                    "colour": "blue"
                },
                {
                    "label": "Niet ontvankelijk",
                    "column": "bezwaren_niet_ontvankelijk",
                    "colour": "moss"
                },
                {
                    "label": "Ingetrokken",
                    "column": "bezwaren_ingetrokken",
                    "colour": "green"
                },
                {
                    "label": "Naar schadeprocedure",
                    "column": "bezwaren_doorgezet",
                    "colour": "brown"
                },
                {
                    "label": "In behandeling",
                    "column": "bezwaren_in_behandeling",
                    "colour": "orange"
                }
            ],
            [
                {
                    "label": "Totaal afgehandeld",
                    "column": "sum",
                    "colour": "gray"
                }
            ]
        ]
        }
        ],
        "header": "Bezwaren",
        "functionality": ['tableView', 'download'],
        "description": "Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Dui sapien eget mi proin sed libero enim sed. Vitae tempus quam pellentesque nec nam aliquam. Gravida neque convallis a cras semper auctor neque. Aliquet bibendum enim facilisis gravida. Lorem ipsum dolor sit amet. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi porta lorem mollis aliquam ut porttitor leo. Nibh ipsum consequat nisl vel. Eget est lorem ipsum dolor. Ornare suspendisse sed nisi lacus. Sagittis id consectetur purus ut faucibus.",
        "endpoints": ["reacties?gemeente=eq.all"],
        "segment": "meldingen",
    }
];

export default bezwaren;