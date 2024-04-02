import { IGroupMappingV2 } from "../shared/interfaces";

const config : IGroupMappingV2[] = [
    {
        "slug" : "meldingen_geo",
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
                            "label": "Schademeldingen",
                            "column": "schademeldingen",
                            "colour": "orange",
                            "format": ""
                        }
                    ],
                    []
                ]
            }
        ],
        "header": "Spreiding van schademeldingen",
        "functionality": ['table', 'definitions','download'],
        "description": "Mag ik dit delen door aantal inwoners van gemeente? ",
        "endpoints": ["map"],
        "segment": "meldingen",
    },
];

export default config;