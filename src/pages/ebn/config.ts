
import { IGroupMappingV2 } from '../shared/interfaces';

const config : IGroupMappingV2[] = [
    {
        "slug" : "betaalstromen_ebn",
        "ctrlr": "EbnSankeyGroupV1",
        "graphs": [{
            "slug": "ebn_sankey",
            "ctrlr": "EbnSankeyV1",
            "multiples": "graphs",
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
        }],
        "header": "Overzicht betaalstromen",
        "header_en": "Overview of payments streams",
        "functionality": [],
        "description": `
        <p>Energie Beheer Nederland (EBN) zet zich op grond van de Mijnbouwwet in het algemeen belang in voor het planmatig beheer en de doelmatige opsporing en winning van de Nederlandse aardolie en aardgasbronnen. EBN is een besloten vennootschap met de Nederlandse Staat als enige (100%) aandeelhouder. De aandelen worden beheerd door het ministerie van Economische Zaken en Klimaat. 
        De Staatsmijnen, de voorloper van EBN, kregen in 1963 de taak om het economisch en maatschappelijk belang van de Nederlandse Staat te behartigen in het Gasgebouw en later ook om deel te nemen in het zoeken naar en het winnen van aardgas en aardolie in de Nederlandse ondergrond. 
        Daarnaast adviseert EBN de minister van Economische Zaken en Klimaat over het energiebeleid. Inmiddels zet EBN haar kennis, kunde en kapitaal ook in om de energietransitie te versnellen, bijvoorbeeld waar het gaat om het gebruik van aardwarmte en de opslag van CO2. EBN neemt deel in gasopslagen en kijkt naar andere vormen van energieopslag en ontwikkelingen op het gebied van waterstof en groen gas.</p>
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
        "description_en": `<p>Pursuant to the Mining Act, EBN is responsible for the public interest, for the planned management and effective exploration and extraction of Dutch oil and natural gas resources. The Dutch State is the sole (100%) shareholder in this private limited company. The Ministry of Economic Affairs and Climate Policy manages the shares. The States Mines, the predecessor to EBN, was set the task in 1963 to represent the economic and social interests of the Dutch State, participating in the Gas Building in the exploration and extraction of oil and natural gas in the Dutch subsurface. EBN also advises the Minister of Economic Affairs and Climate Policy on aspects of the energy policy. Today, EBN also employs its knowledge, skills and capital in accelerating the energy transition, for example in relation to the use of geothermal energy and the storage of CO2. EBN is a participant in gas storage facilities and is investigating other forms of energy storage, as well as developments in the field of hydrogen and green gas.</p>
        <p>EBN is run as a private enterprise, with an independent Board, Board of Supervisory Directors and financial autonomy. All income generated, including from the sale of the government share in production, is reported in the annual reports. The Dutch government receives dividends on the basis of the booked profits following taxation.</p>
        <p>EBN is involved as a non-executive partner in almost all oil and gas extraction projects in the Netherlands. The organisation’s interest in projects of this kind generally amounts to 40%. Compulsory participation by EBN in extraction activities for hydrocarbons has been laid down in the Mining Act since 1963, unless a special exemption is issued by the Minister. At the request of the holder of an exploration licence and following approval from the Minister, EBN also participates in exploration activities. The licence holder (and any co-licence holders) of an exploration or extraction licence, enters into a cooperation agreement with EBN (an OvS). This OvS agreement forms the contractual basis for conducting mining activities, for their joint account. The OvS between EBN and the licence holder(s) is a private agreement. </p>
        <p>The primary objective of the OvS is to settle all issues relating to operational and financial cooperation between EBN and the licence holder(s). The model text for an OvS is available on the website of NL-EITI. The Mining Act specifies that EBN acquires ownership of its share, normally 40%, of all extracted gas and oil (hydrocarbons). The most important elements of these agreements are undertakings relating to: <p>
        <ul>
        <li>appointment of the operator (operational executive) and the execution of the tasks;</li>
        <li>authority within the cooperative venture;</li>
        <li> the budget cycle, such as multiyear plans and annual plans;</li>
        <li>the method of financing and guarantees; </li>
        <li>insurance;</li>
        <li>liabilities; </li>
        <li>periodic reports;</li>
        <li>bookkeeping procedures; </li>
        <li>the method of dealing with drilling proposals;  </li>
        <li>the property rights to mining structures; </li>
        <li>the property rights to hydrocarbons; </li>
        <li>the selling method for hydrocarbons; </li>
        <li>the decommissioning of mining structures.  </li>
        </ul>
        <br/>
        <p>Together with an approved work programme and budget, the OvS forms the basis for the charging on of expenditure and costs by the operator to EBN, and any other co-licence holders. The Accounting Procedure (appendix to the OvS) contains all the agreements about which expenditure and costs can be charged to the joint account.</p>
        <p>Each month, EBN pays its share of the expenditure and costs to the operator, from the joint account. EBN finances its own investments. To this end, EBN borrows funds from external lenders or finances its investments from incoming cashflow. EBN receives no grant or other contributions from the government for participating in oil and gas extraction. However, for eligible projects, use is made of fiscal schemes such as the Energy Investment Allowance (EIA).</p>
        <p>By explaining the position of EBN (of which the government is a 100% shareholder), requirements 2.6, 4.5 and 6.2 of the EITI Standard are met.</p>

        `,
        "endpoints": ["payments"],
        "segment": "2022",
    },
    {
        "slug" : "ebn_bar_group",
        "ctrlr": "EbnBarGroupV1",
        "graphs": [
            {
                "slug": "ebn_incoming",
                "ctrlr": "EbnSimpleBarsV1",
                "args" : ["incoming"],
                "parameters": [[
                    {
                        "label": "Inkomende kasstroom",
                        "label_en" : "Incoming cash flow",
                        "column" : "incoming",
                        "colour" : "orange"
                    }
                ]]
            },
            {
                "slug": "ebn_outgoing",
                "ctrlr": "EbnProgressionBarsV1",
                "args" : ["outgoing"],
                "parameters": [[
                    {
                        "label": "Uitgaande kasstroom",
                        "label_en" : "Outgoing cash flow",
                        "column" : "outgoing",
                        "colour" : "orange"
                    }
                ]]
            },
            {
                "slug": "ebn_netto",
                "ctrlr": "EbnSimpleBarsV1",
                "args" : ["netto"],
                "parameters": [[
                    {
                        "label": "Netto kasstroom",
                        "label_en" : "Net cash flow",
                        "column" : "netto",
                        "colour" : "orange"
                    }
                ]]
            },
            
        ],
        
        "header": " Kasstromen",
        "header_en": " Cash flows",
        "functionality": ['tableView','download'],
        "description": "<p>Voor EBN bestaat de inkomende kasstroom uit ontvangsten uit de verkoop van koolwaterstoffen. De uitgaande kasstroom bestaat uit betalingen voor kosten en investeringsuitgaven (capex) in olie- en gaswinningsprojecten, dividenden aan de Nederlandse Staat en vennootschapsbelasting. Om de inkomsten van de Nederlandse Staat uit olie- en gaswinningsprojecten niet dubbel te tellen, zijn alleen betalingen van EBN aan de Belastingdienst en EZK als directe inkomsten uit de sector opgevat.</p>",
        "description_en": "<p>For EBN, the incoming cash flow consists of receipts from the sale of hydrocarbons. The outgoing cash flow consists of payments for costs and investment expenses (capex) in oil and gas extraction projects, dividends to the Dutch State and corporate tax. To avoid double counting the income accruing to the Dutch State from these oil and gas extraction projects, only payments by EBN to the Tax and Customs Administration and EZK are viewed as direct income from the sector</p>",
        "endpoints": ["payments"],
        "segment": "incoming",
    },
    {
        "slug" : "Ontvangsten en betalingen per bedrijf",
        "ctrlr" : "EbnCircleGroupV1",
        "graphs": [{
            "slug" : "ebn_per_company",
            "ctrlr" : "EbnCirclesV1",
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
                ]
            ]
        }],
        "header": "Ontvangsten en betalingen uit olie- en gaswinningsprojecten",
        "header_en": "Income and payments from oil and gas extraction projects",
        "functionality": ["companySelect","tableView","download"],
        "description": `
            <p>EBN is als niet-uitvoerend partner betrokken bij bijna alle olie- en gaswinningsprojecten in Nederland. Het belang in dit soort projecten bedraagt in de regel 40%. Inkomsten die EBN van exploratie- en productiebedrijven heeft ontvangen voor het aandeel in de diverse olie- en gaswinningsprojecten, en de betalingen die EBN aan de operators heeft gedaan voor zijn aandeel in de operationele en geactiveerde uitgaven, zijn ter informatie apart vermeld en worden niet als extra inkomsten voor of heffingen door de overheid meegerekend.</p>
            <p>De inkomsten voor het Staatsaandeel in de diverse olie- en gaswinningsprojecten en de betalingen aan operators voor kosten en investeringsuitgaven (capex) staan hieronder weergegeven. De ontvangsten uit de verkoop van koolwaterstoffen aan GasTerra en andere klanten (niet gespecificeerd) van EBN zijn alleen door EBN gerapporteerd.</p>
            <h3>Per bedrijf</h3>
        `,
        "description_en": `
            <p>EBN is involved as a non-executive partner in almost all oil and gas extraction projects in the Netherlands. The organisation’s interest in projects of this kind generally amounts to 40%. Income received by EBN from E&P companies for its share in the various oil and gas extraction projects, and the payments made by EBN to the operators for its share in the operational and capitalised expenditure are reported separately in this section, for informational purposes, and are not counted as additional income for or levies by the government..</p>
            <p>According to the data issued by EBN, the income for the state share in the various oil and gas extraction projects and the payments to operators for costs and capex were broken down according to operators, as follows. The revenue from the sale of hydrocarbons to GasTerra and other customers of EBN were only reported by EBN.</p>
            <h3>Pro company</h3>
        `,
        "endpoints": ["payments","entities"],
        "segment": "nam",
    },
    {
        "slug" : "ebn_books",
        "ctrlr": "EbnCircleGroupV2",
        "graphs" : [{
            "slug" : "ebn_circs",
            "ctrlr" : "EbnCirclesV2",
            "multiples": "grouped",
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
        }],
        "header": "Per jaar",
        "header_en": "Pro year",
        "functionality": [],
        "description": null,
        "description_en": null,
        "endpoints": ["payments"],
        "segment": "sales",
    }  

];

export default config;