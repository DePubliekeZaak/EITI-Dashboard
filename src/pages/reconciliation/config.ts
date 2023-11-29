import { IGroupMappingV2 } from '../shared/interfaces';

const config : IGroupMappingV2[] = [
    {
      "slug" : "reconciliatie_intro",
      "ctrlr": "ReconciliatieIntroGroupV1",
      "splice": true,
      "graphs": [
        {
          "slug" : "r_intro_bars_v2",
          "ctrlr" : "ReconciliatieIntroBarsV1",
          "multiples" : "totals",
          "args" : [],
          "parameters": [
            [
              {
                "label": "Rapportage overheid",
                "label_en": "Reported by government",
                "column": "payments_government_reported",
                "colour": "blue",
                "format": ""
              },
              {
                "label": "Rapportage bedrijven",
                "label_en": "Reported by companies",
                "column": "payments_companies_reported",
                "colour": "orange",
                "format": ""
              },
              {
                "label": "Uitkomst overheid",
                "label_en": "Outcome government",
                "column": "payments_government",
                "colour": "blue",
                "format": ""
              },
              {
                "label": "Uitkomst bedrijven",
                "label_en": "Outcome companies",
                "column": "payments_companies",
                "colour": "orange",
                "format": ""
              }
            ]
          ]  
      },
      {
        "slug" : "r_intro_bells_v1",
        "ctrlr" : "ReconciliatieIntroBellsV1",
        "multiples" : "distributions",
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
        ]  
    }
    ],
      "header": null,
      "header_en": null,
      "description":`<p>De reconciliatie is een methodiek om de betrouwbaarheid van aangeleverde betaalstromen te toetsen. De reconciliatie wordt jaarlijks uitgevoerd door een onafhankelijke accountant. Dit is een vereiste van de internationale EITI-Standaard die de leidraad is voor het reconciliatierapport. De bedrijven die deelnemen aan de reconciliatie doen dat op vrijwillige basis. Daarnaast geven zij een machtiging aan de accountant om dezelfde gegevens bij de Belastingdienst, het Ministerie van Economische Zaken en Klimaat (EZK) of het Staatstoezicht op de Mijnen (SodM) op te vragen.</p>
              <p>In het reconciliatieproces vergelijkt de accountant de gerapporteerde bedragen van bedrijven en overheden, om te bepalen of er verschillen tussen de twee bronnen bestaan. Zijn er verschillen, dan wordt contact opgenomen met de overheidsinstanties en de bedrijven, om deze verschillen te kunnen verklaren. Verschillen hebben vaak te maken met het tijdstip waarop de betalingen worden geregistreerd, als betalingen plaatsvinden aan het einde van een jaar (betaling in jaar t, registratie jaar t + 1). Als de accountant het een verklaarbaar verschil vindt, wordt dit aangepast in de uitkomst. Zie hiervoor het verschil tussen rapportage en uitkomst, de eerst twee bolletjes. Zie daarnaast het staafdiagram waarin de relatieve afwijking van de rapportages wordt afgezet tegen de uitkomst overheid.</p>
              <p>De verschillen die in de afgelopen jaren niet konden worden verklaard waren verwaarloosbaar. Ze vallen ruim binnen de acceptabele foutmarge voor resterende reconciliatieverschillen, die is vastgesteld op 1% van de totale inkomsten uit delfstofwinning, zoals die is gerapporteerd door de overheidsinstanties. Zie hiervoor het verschil tussen uitkomst overheid en uitkomst bedrijf, het derde bolletje.</p>
      `,
      "description_en":`<p>Reconciliation is a method to test the reliability of supplied payment flows. The reconciliation is carried out annually by an independent accountant. This is a requirement of the international EITI Standard that guides the reconciliation report. The companies that participate in the reconciliation do so on a voluntary basis. In addition, they authorise the accountant to request the same information from the Tax Authorities, the Ministry of Economic Affairs and Climate (EZK) or the State Supervision of Mines (SodM).</p>
      <p>In the reconciliation process, the accountant compares the reported amounts of companies and governments to determine if there are differences between the two sources. If there are differences, government authorities and companies will be contacted to explain these differences. Differences often have to do with the time at which payments are recorded, if payments are made at the end of a year (payment in year t, registration year t + 1). If the accountant finds it an explainable difference, this will be adjusted in the outcome. See the difference between reporting and outcome, the first two dots. See also the bar chart in which the relative deviation of the reports is compared to the government outcome.</p>
      <p>The differences that could not be explained in recent years were negligible. They are well within the acceptable margin of error for residual reconciliation differences, which is set at 1% of total mineral extraction revenues reported by government authorities. See the difference between government outcome and company outcome, the third bullet.</p>
      `,
      "functionality": ["tableView","download"],
      "endpoints": ["reconciliation"],
      "segment": "",

  },
    {
        "slug" : "reconciliatie_per_jaar",
        "ctrlr": "ReconciliatieYearGroupV2",
        "graphs": [
          {
            "slug" : "r_per_jaar",
            "ctrlr": "ReconciliatieByYearV2",
            "multiples" :"grouped",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "Verschil tussen aangeleverde betaalstromen",
                        "label_en": "Difference between reported payments",
                        "column": "difference_in_reported",
                        "colour": "orange",
                        "format": ""
                    },
                    // {
                    //     "label": "Verschil tussen midden aangeleverde betaalstromen en midden van uitkomsten",
                    //     "label_en": "Difference between average of the reported payments and average of the final payments",
                    //     "column": "difference_reported_and_middle_after",
                    //     "colour": "orange",
                    //     "format": "percentage"
                    // },
                    {
                        "label": "Verschil tussen door bedrijf aangeleverde betaalstroom en uitkomst overheid",
                        "label_en": "Difference between payment reported by company and final payment",
                        "column": "discrepancy_company",
                        "colour": "orange",
                        "format": ""
                    },
                    {
                        "label": "Verschil tussen door overheid aangeleverde betaalstroom en uitkomst overheid",
                        "label_en": "Difference between payment reported by government and final payment",
                        "column": "discrepancy_government",
                        "colour": "orange",
                        "format": ""
                    },
                ],
                [
                  {
                      "label": "Absoluut",
                      "label_en": "Absolute",
                      "column": "absolute",
                      "colour": "orange",
                      "format": ""
                  },
                  {
                      "label": "Relatief",
                      "label_en": "Relative",
                      "column": "relative",
                      "colour": "orange",
                      "format": "percentage"
                  }

                ]
              ]
              }
        ],
        "header": "Grootste verklaarbare verschillen",
        "header_en": "Largest explainable differences",
        "description": "In dit overzicht vindt u de grootste absolute/relatieve verklaarbare verschillen tussen de gerapporteerde bedragen of tussen het gerapporteerde bedrag en de uitkomst van de reconciliatie." ,
        "description_en": "In this overview you will find the largest absolute/relative explainable differences between the reported amounts or between the reported amount and the outcome of the reconciliation." ,
        "functionality": ['combiSelect',"tableView","download"],
        "endpoints": ["reconciliation"],
        "segment": "difference_in_reported_absolute"
    },
    {
        "slug" : "reconciliatie_per_jaar_percentage",
        "ctrlr": "ReconciliationCompanyGroupV2",
        "graphs": [{
            "slug": "r_per_company",
            "ctrlr" : "ReconciliationCompanyV2",
            "args" : [],
            "parameters": [
                [
                    {
                        "label": "verschil tussen rapportages en reconciliatie",
                        "label_en": "difference result discrepancy analysis",
                        "column": "pre_company_report",
                        "colour": "gray",
                        "format": "percentage"
                    },
                    {
                        "label": "aanpassing bedrijf",
                        "label_en": "result discrepancy analysis companies",
                        "column": "pre_company_report",
                        "colour": "orange",
                        "format": "percentage"
                    },
                    {
                        "label": "aanpassing overheid",
                        "label_en": "result discrepancy analysis government",
                        "column": "pre_company_report",
                        "colour": "blue",
                        "format": "percentage"
                    }
                ]
            ]
        }],
        "header": "Reconciliatie per bedrijf",
        "functionality": ["companySelect","tableView","download"],
        "description": null,
        "endpoints": ["reconciliation","entities"],
        "segment": "nam",
    },
    // {
    //     "slug" : "reconciliatie_per_jaar_percentage",
    //     "graph": "ReconciliationCompanyV3",
    //     "args" : [],
    //     "parameters": [
    //         [
                
    //             {
    //                 "label": "verschil tussen rapportages en reconciliatie",
    //                 "column": "pre_company_report",
    //                 "colour": "gray",
    //                 "format": "percentage"
    //             },
    //             {
    //                 "label": "aanpassing bedrijf",
    //                 "column": "pre_company_report",
    //                 "colour": "orange",
    //                 "format": "percentage"
    //             },
    //             {
    //                 "label": "aanpassing overheid",
    //                 "column": "pre_company_report",
    //                 "colour": "blue",
    //                 "format": "percentage"
    //             }
    //         ]
    //     ],
    //     "header": "Reconciliatie per jaar",
    //     "multiGraph": false,
    //     "functionality": ["companySelect","tableView","download"],
    //     "description": null,
    //     "endpoint": "reconciliatie",
    //     "segment": "nam",
    //     "elementClasslist": ['graph-container','graph-container-12']
    // }
];

export default config;