import { IGroupMappingV2 } from "../shared/interfaces";

const group : IGroupMappingV2[] = [
    {
        "slug" : "history_fs_duration",
        "ctrlr": "DuurGroupV1",
        "graphs": [
            {
            "slug" : "duur_bars",
            "ctrlr" : "BarTrendStackedDuur",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": '2 jaar en ouder',
                        "column": 'fysieke_schade_langer_dan_twee_jaar_in_procedure',
                        "colour": "orange",
                        "short": "> 2 jaar"
                    },
                    {
                        "label": '1-2 jaar oud',
                        "column": 'fysieke_schade_tussen_jaar_en_twee_jaar_in_procedure',
                        "colour": "yellow",
                        "short": "1 t/m 2 jaar"
                    },
                    {
                        "label": '0,5-1 jaar oud',
                        "column": 'fysieke_schade_tussen_half_jaar_en_jaar_in_procedure',
                        "colour": "moss",
                        "short": "1/2 t/m 1 jaar"
                    },
                    {
                        "label": '< 0,5 jaar oud',
                        "column": 'fysieke_schade_minder_dan_half_jaar_in_procedure',
                        "colour": "lightBlue",
                        "short": "< 1/2 jaar"
                    }
                ],
                [
                    {
                    "label": "Verwacht aantal dagen tussen melding en besluit",
                    "column": "fysieke_schade_percentage_binnen_half_jaar",
                    "colour": "black"
                    }
                ]
            ]
            }
        ],
        "header": "Duur openstaande dossiers",
        "functionality": ['table', 'definitions','download'],
        "description": "Het aantal openstaande schademeldingen onderverdeeld in de leeftijd van die melding sinds de indiening ervan. De grafiek toont de ontwikkeling door de tijd heen. Aangezien het IMG ernaar streeft dat reguliere schademeldingen binnen een half jaar zijn afgehandeld, zou dit verreweg de grootste groep moeten zijn van het totaal aantal openstaande schademeldingen op dit moment.",
        "endpoints": ["historie"],
        "segment": "meldingen",
    },
    {
        "slug" : "history_fs_projections",
        "ctrlr": "DuurProjectiesGroupV1",
        "graphs": [
            {
                "slug" : "duur_lines",
                "ctrlr" : "BarTrendVoorraadenGemiddeldes",
                "args" : [],
                "parameters": [
                    [
                        {
                            "label": "werkvoorraad",
                            "column": "fysieke_schade_werkvoorraad",
                            "colour": "yellow"
                        }
                    ],
                    [
                        {
                            "label": "Verwacht aantal dagen tussen melding en besluit",
                            "column": "fysieke_schade_verwacht_aantal_dagen_tussen_melding_en_besluit",
                            "colour": "purple"
                        },
                        {
                            "label": "Mediaan doorlopptijd",
                            "column": "fysieke_schade_mediaan_doorlooptijd",
                            "colour": "orange"
                        }
                    ]
                ]
            }
        ],
        "header": "Werkvoorraad en mediaan doorlooptijd",
        "functionality": ['table', 'definitions','download'],
        "description": "",
        "endpoints": ["historie"],
        "segment": "meldingen",
    }
];

export default group;