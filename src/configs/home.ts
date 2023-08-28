import { IGraphMapping } from '@local/d3_types';

export const home : IGraphMapping[] = [
    {
        "slug" : "bol_tevredenheid_algemeen",
        "graph": "CijfersMonths",
        "args" : [],
        "parameters": [
            [
                {
                    "label": "Tevredenheidscijfer",
                    "column": "doorlopend_cijfer",
                    "colour": "orange"
                },
                {
                    "label": "Tevredenheidscijfer",
                    "column": "maandcijfer",
                    "colour": "orange"
                },
                {
                    "label": "Tevredenheidscijfer",
                    "column": "aantal_respondenten",
                    "colour": "orange"
                }
            ]
        ],
        "header": "Tevredenheidscijfer",
        "multiGraph": false,
        "description" : "Het betreft hier een gemiddelde gebaseerd op alle reacties die sinds de start van diverse metingen zijn binnengekomen. Er wordt daarbij voor verschillende regelingen per e-mail om een reactie gevraagd kort nadat het besluit is bekend gemaakt bij de aanvrager. Na een besluit over de aanvraag tot vergoeding van fysieke schade wordt gevraagd: “Welk rapportcijfer geeft u het besluit dat u ontvangen heeft? (1-10)” Na een besluit over de aanvraag tot vergoeding van waardedaling wordt gevraagd: “Hoe tevreden bent u over het indienen en afhandelen van uw aanvraag?(1-10)” Hoe meer besluiten er zijn genomen bij die specifieke regeling, hoe zwaarder dat gemiddelde vervolgens meetelt bij het tevredenheidscijfer voor het IMG als geheel. Onder het totaalcijfer over de gehele periode, staat het doorlopend gemiddelde totaalcijfer voor die maand weergegeven. Het totaalcijfer wordt wekelijks geüpdatet en is tot op heden gebaseerd op <span data-slug='aantal_respondenten'>xxxxx</span> reacties.",
        "endpoint": "tevredenheid",
        "segment": "all",
        "elementClasslist": ['img-graph-container','img-graph-container-4']
    }
];