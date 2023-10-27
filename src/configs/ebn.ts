import { IGraphMapping} from '@local/d3_types';

export const ebn : IGraphMapping[] = [
    {
        "slug" : "betaalstromen_ebn",
        "graph": "EbnSankeyV1",
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
        "header": " Overzicht betaalstromen",
        "multiGraph": false,
        "functionality": [],
        "description": `
        <p>Energie Beheer Nederland (EBN) zet zich op grond van de Mijnbouwwet in het algemeen belang in voor het planmatig beheer en de doelmatige opsporing en winning van de Nederlandse aardolie en aardgasbronnen. EBN is een besloten vennootschap met de Nederlandse Staat als enige (100%) aandeelhouder. De aandelen worden beheerd door het ministerie van Economische Zaken en Klimaat. De Staatsmijnen, de voorloper van EBN, kregen bijna 60 jaar geleden de taak om het economisch en maatschappelijk belang van de Nederlandse Staat te behartigen in het Gasgebouw en later ook om deel te nemen in het zoeken naar en het winnen van aardgas en aardolie in de Nederlandse ondergrond. Daarnaast adviseert EBN de minister van Economische Zaken en Klimaat over het energiebeleid. Inmiddels zet EBN haar kennis, kunde en kapitaal ook in om de energietransitie te versnellen, bijvoorbeeld waar het gaat om het gebruik van aardwarmte en de opslag van CO2 . EBN neemt deel in gasopslagen en kijkt naar andere vormen van energieopslag en ontwikkelingen op het gebied van waterstof en groen gas.</p>
        <p>EBN is een private onderneming, met een onafhankelijk bestuur, Raad van Commissarissen en financiële autonomie. Alle vergaarde inkomsten, inclusief de verkoop van het overheidsaandeel in productie, zijn in de jaarverslagen opgenomen. De Nederlandse overheid ontvangt dividenden op basis van geboekte winsten na belastingheffing.</p>
        <p>EBN is als niet-uitvoerend partner betrokken bij bijna alle olie- en gaswinningsprojecten in Nederland. Het belang in deze projecten bedraagt meestal 40%. De verplichte deelname van EBN in winningsactiviteiten van koolwaterstoffen is sinds 1963 voorgeschreven in de Mijnbouwwet, behoudens vrijstelling door de Minister. Op verzoek van de houder van een opsporingsvergunning en na goedkeuring van de Minister neemt EBN ook deel in opsporingsactiviteiten. De vergunninghouder (en eventuele medehouders) van een opsporings- of winningsvergunning sluiten met EBN een Overeenkomst van Samenwerking (OvS) af. Deze OvS vormt de contractuele basis voor het op gezamenlijke rekening verrichten van mijnbouwactiviteiten. De OvS tussen EBN en de vergunninghouder(s) is een private overeenkomst. De OvS regelt met name de wijze van operationele en financiële samenwerking tussen EBN en de vergunninghouder(s).</p>
        <p>De modeltekst voor een Overeenkomst van Samenwerking (OvS) kan betrekking hebben op de <a href="https://www.eiti.nl/documenten/publicaties/2022/12/22/model-overeenkomst-samenwerking-opsporing" target="_blank">opsporingsactiviteiten</a> of op <a href="https://www.eiti.nl/documenten/publicaties/2022/12/22/model-overeenkomst-samenwerking-vergunning" target="_blank">winningsactiviteiten</a>. In de Mijnbouwwet is geregeld dat EBN haar aandeel, meestal 40%, van de gewonnen gas of olie (koolwaterstoffen) in eigendom verkrijgt. De belangrijkste onderdelen van deze overeenkomsten zijn afspraken ten aanzien van: </p>
        <ul>
            <li>aanwijzing van de operator (operationele uitvoerder) en de uitvoering van de taken;</li>
            <li>de zeggenschap binnen het samenwerkingsverband;</li>
            <li>de begrotingscyclus, zoals meerjarenplannen en jaarplannen;</li>
            <li>de wijze van financiering en garantiestellingen;</li>
            <li>de verzekeringen;</li>
            <li>aansprakelijkheden;</li>
            <li>periodieke rapportages;</li>
            <li>boekhoudprocedures;</li>
            <li>de wijze van behandeling van boorvoorstellen;</li>
            <li>de eigendomsrechten van mijnbouwwerken;</li>
            <li>de eigendomsrechten van de koolwaterstoffen;</li>
            <li>de wijze van verkoop van de koolwaterstoffen;</li>
            <li>het opruimen van de mijnbouwinstallaties.</li>

        </ul>
        <br/>
        <p>Deze overeenkomst van samenwerking (OvS) vormt samen met een goedgekeurd werkprogramma en budget de grondslag voor de doorbelasting van uitgaven en kosten door de operator aan EBN en eventuele andere medevergunninghouders. In de Accounting Procedure (bijlage bij de OvS) zijn afspraken opgenomen over welke uitgaven en kosten ten laste van de gezamenlijke rekening mogen komen.</p>
        <p>Op maandbasis betaalt EBN haar aandeel in de uitgaven en kosten van de gezamenlijke rekening aan de operator. EBN financiert haar investeringen zelf. Hiertoe leent zij geld van externe geldverstrekkers of financiert ze deze vanuit de inkomende kasstromen. EBN ontvangt geen subsidie of andere bijdragen van de overheid voor het deelnemen in olie- en gaswinning. Wel wordt er voor projecten die daarvoor in aanmerking komen gebruik gemaakt van fiscale regelingen zoals Energie Investeringsaftrek (EIA).</p>
        <p>Door positie van EBN (waar de overheid 100% aandeelhouder van is) toe te lichten wordt voldaan aan de vereisten 2.6, 4.5 en 6.2 van de EITI Standaard.</p>
        `,
        "endpoint": "government_revenue",
        "segment": "2022",
        "elementClasslist": ['graph-container','graph-container-12']
    },
    {
        "slug" : "ebn_bar_group",
        "graph": "EbnBarGroupV1",
        "args" : [],
        "parameters": [
            [
                {
                    "label": "Netto kasstroom",
                    "column": "netto",
                    "colour": "purple"
                },
                {
                    "label": "Inkomende kasstromen",
                    "column": "incoming",
                    "colour": "orange"
                },
                {
                    "label": "Uitgaande kasstromen",
                    "column": "outgoing",
                    "colour": "blue"
                }
               
            ]
        ],
        "header": " Kasstromen",
        "multiGraph": true,
        "functionality": ['tableView','download'],
        "description": "<p>Voor EBN bestaat de inkomende kasstroom uit ontvangsten uit de verkoop van koolwaterstoffen. De uitgaande kasstroom bestaat uit betalingen voor kosten en investeringsuitgaven (capex) in olie- en gaswinningsprojecten, dividenden aan de Nederlandse Staat en vennootschapsbelasting. Om de inkomsten van de Nederlandse Staat uit olie- en gaswinningsprojecten niet dubbel te tellen, zijn alleen betalingen van EBN aan de Belastingdienst en EZK als directe inkomsten uit de sector opgevat.</p>",
        "endpoint": "payments",
        "segment": "incoming",
        "elementClasslist": ['graph-container','graph-container-12']
    },
    // {
    //     "slug" : "ebn_ontvangsten",
    //     "graph": "EbnSimpleBarsV2",
    //     "args" : [],
    //     "parameters": [
    //         [
    //             {
    //                 "label": "Netto kasstroom",
    //                 "column": "netto",
    //                 "colour": "purple"
    //             },
    //             {
    //                 "label": "Inkomende kasstromen",
    //                 "column": "incoming",
    //                 "colour": "orange"
    //             },
    //             {
    //                 "label": "Uitgaande kasstromen",
    //                 "column": "outgoing",
    //                 "colour": "blue"
    //             }
               
    //         ]
    //     ],
    //     "header": " Inkomende kasstromen",
    //     "multiGraph": false,
    //     "functionality": ['tableView','download'],
    //     "description": "<p>Voor EBN bestaat de inkomende kasstroom uit ontvangsten uit de verkoop van koolwaterstoffen. De uitgaande kasstroom bestaat uit betalingen voor kosten en investeringsuitgaven (capex) in olie- en gaswinningsprojecten, dividenden aan de Nederlandse Staat en vennootschapsbelasting. Om de inkomsten van de Nederlandse Staat uit olie- en gaswinningsprojecten niet dubbel te tellen, zijn alleen betalingen van EBN aan de Belastingdienst en EZK als directe inkomsten uit de sector opgevat.</p>",
    //     "endpoint": "payments",
    //     "segment": "incoming",
    //     "elementClasslist": ['graph-container','graph-container-12']
    // },
    // {
    //     "slug" : "ebn_uitgaven",
    //     "graph": "EbnProgressionBarsV1",
    //     "args" : [],
    //     "parameters": [
    //         [
    //             {
    //                 "label": "Netto kasstroom",
    //                 "column": "netto",
    //                 "colour": "purple"
    //             },
    //             {
    //                 "label": "Inkomende kasstromen",
    //                 "column": "incoming",
    //                 "colour": "orange"
    //             },
    //             {
    //                 "label": "Uitgaande kasstromen",
    //                 "column": "outgoing",
    //                 "colour": "blue"
    //             }
               
    //         ]
    //     ],
    //     "header": " Uitgaande kasstromen",
    //     "multiGraph": false,
    //     "functionality": ['tableView','download'],
    //     "description": "<p>Voor EBN bestaat de inkomende kasstroom uit ontvangsten uit de verkoop van koolwaterstoffen. De uitgaande kasstroom bestaat uit betalingen voor kosten en investeringsuitgaven (capex) in olie- en gaswinningsprojecten, dividenden aan de Nederlandse Staat en vennootschapsbelasting. Om de inkomsten van de Nederlandse Staat uit olie- en gaswinningsprojecten niet dubbel te tellen, zijn alleen betalingen van EBN aan de Belastingdienst en EZK als directe inkomsten uit de sector opgevat.</p>",
    //     "endpoint": "payments",
    //     "segment": "netto",
    //     "elementClasslist": ['graph-container','graph-container-12']
    // },
    // {
    //     "slug" : "ebn_ontvangsten",
    //     "graph": "EbnSimpleBarsV2",
    //     "args" : [],
    //     "parameters": [
    //         [
    //             {
    //                 "label": "Netto kasstroom",
    //                 "column": "netto",
    //                 "colour": "purple"
    //             },
    //             {
    //                 "label": "Inkomende kasstromen",
    //                 "column": "incoming",
    //                 "colour": "orange"
    //             },
    //             {
    //                 "label": "Uitgaande kasstromen",
    //                 "column": "outgoing",
    //                 "colour": "blue"
    //             }
               
    //         ]
    //     ],
    //     "header": " Netto kasstroom",
    //     "multiGraph": false,
    //     "functionality": ['tableView','download'],
    //     "description": "<p>Voor EBN bestaat de inkomende kasstroom uit ontvangsten uit de verkoop van koolwaterstoffen. De uitgaande kasstroom bestaat uit betalingen voor kosten en investeringsuitgaven (capex) in olie- en gaswinningsprojecten, dividenden aan de Nederlandse Staat en vennootschapsbelasting. Om de inkomsten van de Nederlandse Staat uit olie- en gaswinningsprojecten niet dubbel te tellen, zijn alleen betalingen van EBN aan de Belastingdienst en EZK als directe inkomsten uit de sector opgevat.</p>",
    //     "endpoint": "payments",
    //     "segment": "netto",
    //     "elementClasslist": ['graph-container','graph-container-12']
    // },
    {
        "slug" : "Ontvangsten en betalingen per bedrijf",
        "graph": "EbnCirclesV1",
        "args" : [],
        "parameters": [
            [
                {
                    "label": "Ontvangsten",
                    "column": "payments_companies",
                    "colour": "blue"
                },
                {
                    "label": "Betalingen",
                    "column": "payments_companies",
                    "colour": "orange"
                },
                // {
                //     "label": "Netto",
                //     "column": "payments_companies",
                //     "colour": "black"
                // }
            ]
        ],
        "header": "Ontvangsten en betalingen uit olie- en gaswinningsprojecten",
        "multiGraph": false,
        "functionality": ["companySelect","tableView","download"],
        "description": `
            <p>EBN is als niet-uitvoerend partner betrokken bij bijna alle olie- en gaswinningsprojecten in Nederland. Het belang in dit soort projecten bedraagt in de regel 40%. Inkomsten die EBN van exploratie- en productiebedrijven heeft ontvangen voor het aandeel in de diverse olie- en gaswinningsprojecten, en de betalingen die EBN aan de operators heeft gedaan voor zijn aandeel in de operationele en geactiveerde uitgaven, zijn ter informatie apart vermeld en worden niet als extra inkomsten voor of heffingen door de overheid meegerekend.</p>
            <p>De inkomsten voor het Staatsaandeel in de diverse olie- en gaswinningsprojecten en de betalingen aan operators voor kosten en investeringsuitgaven (capex) staan hieronder weergegeven. De ontvangsten uit de verkoop van koolwaterstoffen aan GasTerra en andere klanten (niet gespecificeerd) van EBN zijn alleen door EBN gerapporteerd.</p>
            <h3>Per bedrijf</h3>
        `,
        "endpoint": "government_revenue",
        "segment": "nam",
        "elementClasslist": ['graph-container','graph-container-12']
    },
    {
        "slug" : "ebn_books",
        "graph": "EbnCircleGroupV2",
        "args" : [],
        "parameters": [
            [
                {
                    "label": "Gasterra",
                    "column": "gasterra",
                    "colour": "purple"
                },
                {
                    "label": "NAM",
                    "column": "nam",
                    "colour": "blue"
                },
                {
                    "label": "Overige deelnemers",
                    "column": "oil",
                    "colour": "orange"
                },
                {
                    "label": "Andere klanten",
                    "column": "overig",
                    "colour": "green"
                }
            ]
        ],
        "header": "Per jaar",
        "multiGraph": true,
        "functionality": [],
        "description": ``,
        "endpoint": "payments",
        "segment": "sales",
        "elementClasslist": ['graph-container','graph-container-12']
    }  
    
]