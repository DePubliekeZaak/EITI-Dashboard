import { IGraphMapping} from '@local/d3_types';

export const licences : IGraphMapping[] = [
    {
        "slug" : "licences_map",
        "graph": "LicencesMapV1",
        "args" : [],
        "parameters": [
            [
                {
                    "label": "Bedrijf",
                    "column": "location_operator",
                    "colour": "orange"
                }
            ]
        ],
        "header": "Winningsvergunningen koolwaterstoffen",
        "multiGraph": false,
        "functionality": ['paramSelector'],
        "description": "<p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse pellentesque, est a pulvinar mattis, ligula sapien pellentesque orci, non tincidunt diam erat imperdiet ligula.</p>",
        "endpoint": "licences",
        "segment": "2022",
        "elementClasslist": ['graph-container','graph-container-12']
    }
    
]