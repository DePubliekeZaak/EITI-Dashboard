import { IGraphMapping} from '@local/d3_types';

export const ubo : IGraphMapping[] = [
    {
        "slug" : "ubo_register",
        "graph": "UboCardsV1",
        "args" : [],
        "parameters": [
            [
                {
                    label: "Handelsnaam",
                    column: "trade_name" 
                },
                {
                    label: "KvK nummer",
                    column: "registration_ref" 
                },
                {
                    label: "Moederbedrijf",
                    column: "parent_company"
                },
                {
                    label: "Link naar register",
                    column: "registry_link"
                }    
            ]
        ],
        "header": null,
        "multiGraph": false,
        "functionality": ['tableView','download'],
        "description": "<p>Pellentesque non aliquam turpis, id molestie ligula. Nulla facilisi. Integer malesuada non ipsum ut posuere. Nam in erat mi. Aenean vel felis dictum, vestibulum metus vitae, finibus velit. Pellentesque dictum consectetur lorem, vel mollis quam auctor a. Maecenas ac ante at augue placerat lacinia non ac ante. Cras ultrices aliquam enim quis molestie. Suspendisse potenti. Nulla tempor imperdiet mattis. Morbi eget lacinia ex.</p>",
        "endpoint": "entities",
        "segment": "2022",
        "elementClasslist": ['graph-container','graph-container-12']
    }
]