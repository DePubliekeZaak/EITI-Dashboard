import { IGraphMapping} from '@local/d3_types';

export const betalingen : IGraphMapping[] = [
    {
        "slug" : "type_betaalstromen",
        "graph": "RevenueCirclesV1",
        "args" : [],
        "parameters": [
            [
                {
                    "label": "bedrijf",
                    "column": "payments_companies",
                    "colour": "orange"
                }
            ]
        ],
        "header": null,
        "multiGraph": false,
        "functionality": ['yearSelect','tableView','download'],
        "description": "<p>De deelnemende aardgas-, aardolie- en zoutbedrijven geven op vrijwillige basis inzicht in de betaalstromen tussen deze bedrijven en de Nederlandse overheid. Daar waar mogelijk ziet u de bedragen per individuele vergunning. Een externe accountant heeft gecontroleerd of de cijfers van de overheid en de bedrijven overeenkomen, volgens de vereisten van de EITI-Standaard.</p>",
        "endpoint": "payments",
        "segment": "2022",
        "elementClasslist": ['graph-container','graph-container-12']
    },
    {
        "slug" : "type_betaalstromen_per_jaar",
        "graph": "RevenueBarsV1",
        "args" : [],
        "parameters": [
            [
                {
                    "label": "bedrijf",
                    "column": "payments_companies",
                    "colour": "orange"
                }
            ]
        ],
        "header": "Betalingen per betaalstroom per jaar",
        "multiGraph": false,
        "functionality": ['tableView','download'],
        "description": "<p></p>",
        "endpoint": "payments",
        "segment": "2022",
        "elementClasslist": ['graph-container','graph-container-12']
    },
    {
        "slug" : "betalingen_bedrijven",
        "graph": "PaymentsGroupV1",
        "args" : [],
        "parameters": [
            [
                {
                    "label": "bedrijf",
                    "column": "payments_companies",
                    "colour": "orange"
                }
            ]
        ],
        "header": "Betalingen van bedrijven per jaar",
        "multiGraph": true,
        "functionality": ['yearSelect','tableView','download'],
        "description": "",
        "endpoint": "reconciliatie",
        "segment": "2022",
        "elementClasslist": ['graph-container','graph-container-12']
    },
    {
        "slug" : "inkomsten_overheid_types",
        "graph": "RevenueTypeSankeyV1",
        "args" : [],
        "parameters": [
            [
                {
                    "label": "betaalstroom",
                    "column": "payments_companies",
                    "colour": "orange"
                }
            ]
        ],
        "header": " Overzicht betaalstromen tussen bedrijven en overheid per jaar",
        "multiGraph": false,
        "functionality": ['yearSelect','tableView','download'],
        "description": null,
        "endpoint": "government_revenue",
        "segment": "2022",
        "elementClasslist": ['graph-container','graph-container-12']
    },
    {
        "slug" : "oppervlakterecht_kaart",
        "graph": "ProjectsMapGroupV1",
        "args" : [],
        "parameters": [
            [
                {
                    "label": "betaalstroom",
                    "column": "payments_companies",
                    "colour": "orange"
                }
            ]
        ],
        "header": "Betalingen per vergunning voor cijns, oppervlakterecht en retributies per jaar",
        "multiGraph": true,
        "functionality": ['yearSelect','tableView','download'],
        "description": "De data invoer is nog involledig wegens variatie in aanduidingen voor vergunningen.",
        "endpoint": "government_revenue",
        "segment": "2022",
        "elementClasslist": ['graph-container','graph-container-12']
    }
];