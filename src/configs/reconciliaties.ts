import { IGraphMapping} from '@local/d3_types';

export const reconciliatie : IGraphMapping[] = [
    {
        "slug" : "reconciliatie_intro",
        "graph": "ReconciliatieIntroGroupV1",
        "args" : [],
        "parameters": [
          [
            {
                "label": "Rapportage bedrijf",
                "column": "payments_government_reported",
                "colour": "orange",
                "format": ""
            },
            {
              "label": "Rapportage overheid",
              "column": "payments_companies_reported",
              "colour": "orange",
              "format": ""
            },
            {
              "label": "Uitkomst bedrijf",
              "column": "payments_government",
              "colour": "orange",
              "format": ""
            },
            {
              "label": "Uitkomst overheid",
              "column": "payments_companies",
              "colour": "orange",
              "format": ""
            }

          ]
        ],
        "header": null,
        "multiGraph": true,
        "description":`<p>De reconciliatie is een methodiek om de betrouwbaarheid van aangeleverde betaalstromen te toetsen. De reconciliatie wordt jaarlijks uitgevoerd door een onafhankelijke accountant. Dit is een vereiste van de internationale EITI-Standaard die de leidraad is voor het reconciliatierapport. De bedrijven die deelnemen aan de reconciliatie doen dat op vrijwillige basis. Daarnaast geven zij een machtiging aan de accountant om dezelfde gegevens bij de Belastingdienst, het Ministerie van Economische Zaken en Klimaat (EZK) of het Staatstoezicht op de Mijnen (SodM) op te vragen.</p>
                <p>In het reconciliatieproces vergelijkt de accountant de gerapporteerde bedragen van bedrijven en overheden, om te bepalen of er verschillen tussen de twee bronnen bestaan. Zijn er verschillen, dan wordt contact opgenomen met de overheidsinstanties en de bedrijven, om deze verschillen te kunnen verklaren. Verschillen hebben vaak te maken met het tijdstip waarop de betalingen worden geregistreerd, als betalingen plaatsvinden aan het einde van een jaar (betaling in jaar t, registratie jaar t + 1). Als de accountant het een verklaarbaar verschil vindt, wordt dit aangepast in de uitkomst. Zie hiervoor het verschil tussen rapportage en uitkomst, de eerst twee bolletjes. Zie daarnaast het staafdiagram waarin de relatieve afwijking van de rapportages wordt afgezet tegen de uitkomst overheid.</p>
                <p>De verschillen die in de afgelopen jaren niet konden worden verklaard waren verwaarloosbaar. Ze vallen ruim binnen de acceptabele foutmarge voor resterende reconciliatieverschillen, die is vastgesteld op 1% van de totale inkomsten uit delfstofwinning, zoals die is gerapporteerd door de overheidsinstanties. Zie hiervoor het verschil tussen uitkomst overheid en uitkomst bedrijf, het derde bolletje.</p>
        `,
        "functionality": ["tableView","download"],
        "endpoint": "reconciliatie",
        "segment": "",
        "elementClasslist": ['graph-container','graph-container-12']
    },
    {
        "slug" : "reconciliatie_per_jaar",
        "graph": "ReconciliatieYearGroupV2",
        "args" : [],
        "parameters": [
            [
                {
                    "label": "Absoluut verschil tussen aangeleverde betaalstromen",
                    "column": "difference_in_reported_absolute",
                    "colour": "orange",
                    "format": ""
                },
                {
                    "label": "Relatief verschil tussen aangeleverde betaalstromen",
                    "column": "difference_in_reported_relative",
                    "colour": "orange",
                    "format": "percentage"
                },
                {
                    "label": "Verschil tussen midden aangeleverde betaalstromen en midden van uitkomsten",
                    "column": "difference_reported_and_middle_after",
                    "colour": "orange",
                    "format": "percentage"
                },
                {
                    "label": "Absoluut verschil tussen door bedrijf aangeleverde betaalstroom en uitkomst overheid",
                    "column": "discrepancy_company_absolute",
                    "colour": "orange",
                    "format": ""
                },
                {
                    "label": "Relatief verschil tussen door bedrijf aangeleverde betaalstroom en uitkomst overheid",
                    "column": "discrepancy_company_relative",
                    "colour": "orange",
                    "format": "percentage"
                },
                {
                    "label": "Absoluut verschil tussen door overheid aangeleverde betaalstroom en uitkomst overheid",
                    "column": "discrepancy_government_absolute",
                    "colour": "orange",
                    "format": ""
                },
                {
                    "label": "Relatief verschil tussen door overheid aangeleverde betaalstroom en uitkomst overheid",
                    "column": "discrepancy_government_relative",
                    "colour": "orange",
                    "format": "percentage"
                },
            ]
        ],
        "header": "Grootste verklaarbare verschillen",
        "multiGraph": true,
        "description": "In dit overzicht vindt u de grootste absolute/relatieve verklaarbare verschillen tussen de gerapporteerde bedragen of tussen het gerapporteerde bedrag en de uitkomst van de reconciliatie." ,
        "functionality": ['mappingSelect',"tableView","download"],
        "endpoint": "reconciliatie",
        "segment": "difference_in_reported_absolute",
        "elementClasslist": ['graph-container','graph-container-12']
    },
    // {
    //     "slug" : "reconciliatie_per_jaar",
    //     "graph": "ReconciliatieYearGroupV1",
    //     "args" : [],
    //     "parameters": [
    //         [
    //             {
    //                 "label": "bedrijf",
    //                 "column": "pre_company_report",
    //                 "colour": "orange",
    //                 "format": "percentage"
    //             }
    //         ]
    //     ],
    //     "header": "Reconciliatie per jaar",
    //     "multiGraph": true,
    //     "description": "Deze vorm gebruiken we waarschijnlijk op individuele bedrijven pagina.",
    //     "endpoint": "reconciliatie",
    //     "segment": "2022",
    //     "elementClasslist": ['graph-container','graph-container-12']
    // },
    // {
    //     "slug" : "reconciliatie_bedrijven",
    //     "graph": "ReconciliatieGroupV1",
    //     "args" : [],
    //     "parameters": [
    //         [
    //             {
    //                 "label": "bedrijf",
    //                 "column": "pre_company_report",
    //                 "colour": "orange",
    //                 "format": "percentage"
    //             }
    //         ]
    //     ],
    //     "header": "Reconciliatie",
    //     "multiGraph": true,
    //     "description": "Allereerst wordt de aanpak en methodologie van de reconciliatie van betaalstromen over 2021 toegelicht. Daarna worden de uitkomsten van de reconciliatieoefening weergegeven als totaal, per overheidsinstantie, per bedrijf en per betaalstroom. Vervolgens worden de gerapporteerde uitkomsten voor het jaar 2021 vergeleken met die 2020 en 2019 en van een context voorzien.",
    //     "endpoint": "reconciliatie",
    //     "segment": "2022",
    //     "elementClasslist": ['graph-container','graph-container-12']
    // }
];

