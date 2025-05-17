
import { IGroupMappingV2 } from '../shared/interfaces';

const config : IGroupMappingV2[] = [
  {
    "slug" : "ubo_register",
    "ctrlr": "UboCardsGroupV1",
    "graphs": [{
        "slug" : "cards",
        "ctrlr" : "UboCardsV1",
        "args" : [],
        "parameters": [
            [
                {
                    label: "Handelsnaam",
                    label_en: "Trade name",
                    column: "trade_name",
                    colour: "orange"
                },
                {
                    label: "KvK nummer",
                    label_en: "Registration reference",
                    column: "registration_ref",
                    colour: "orange"
                },
                {
                    label: "Moederbedrijf",
                    label_en: "Parent company",
                    column: "parent_company",
                    colour: "orange"
                },
                {
                    label: "Link naar register",
                    label_en: "Link to register",
                    column: "registry_link",
                    colour: "orange"
                }    
            ]
        ]
    }],
    "header": null,
    "header_en": null,
    "functionality": ['yearSelect','table','download'],
    "description": `
        <p>De EITI-Standaard vereist het transparant maken van de eigenaar van of de persoon met de feitelijke zeggenschap over het mijnbouwbedrijf, ook wel de ultimate beneficial owner (UBO) genoemd. Dit is uitgewerkt in vereiste 2.5 van de EITI-Standaard. Bij een besloten vennootschap (bv) of naamloze vennootschap (nv) gaat het om: personen met meer dan 25% van de aandelen, personen met meer dan 25% van de stemrechten, personen die de feitelijke zeggenschap over de onderneming hebben. Op 27 maart 2022 moesten organisaties hun UBO’s hebben geregistreerd. Dat betekent dat zij hun eigenaren of personen met zeggenschap in het UBO-register hebben ingeschreven bij de Kamer van Koophandel. Het UBO-register volgt uit Europese regels. Het register moet financieel-economische criminaliteit voorkomen, zoals witwassen, fraude, belastingontduiking en terrorismefinanciering.</p>

        <p>Een uitspraak van het Europese Hof van Justitie heeft tot gevolg dat vanaf eind november 2022 het Nederlandse UBO-register niet meer openbaar toegankelijk is:</p>

        <ul>
            <li>a. Het Hof stelt vast dat met het UBO-register een doelstelling van algemeen belang wordt nagestreefd. Daarbij is het UBO-register onderdeel van een Europese anti-witwasrichtlijn.</li>

            <li>b. Deze doelstelling rechtvaardigt een inbreuk op de eerbiediging van het privéleven.</li>

            <li>c. Het Hof zegt vervolgens dat een volledig openbaar UBO-register onvoldoende onderbouwd en daarmee ongeldig is.</li>

            <li>d. Het ministerie van Financiën bepaalt vervolgens eind november 2022 dat uit het UBO-register “tijdelijk geen informatieverstrekking meer mogelijk is”.</li>

        </ul>
        <br/>

        <p>Het NL-EITI rapport volgt deze benadering, waardoor recente UBO-informatie niet meer kan worden weergegeven in deze rapportage. Tenzij er een beursgenoteerd moederbedrijf is of een moederbedrijf wat gevestigd is in een land waar het UBO-register wel openbaar is.</p>

`,
    "description_en": `
    
        <p>One item in the report is transparency about the owner or the person with actual final authority, also known as the ultimate beneficial owner (UBO). This is elaborated in requirement 2.5 of the EITI Standard. With a private limited liability company (bv) or public limited company (nv) these are: persons with more than 25% of the shares, persons with more than 25% of the voting rights, and persons who have actual authority over the company. On 27 March 2022, all the organisations had to have registered their UBO. In other words, they had to have entered their owners or persons with authority in the UBO register with the Chamber of Commerce. The UBO register is required in accordance with European rules. The aim of the register is to prevent financial and economic crime, such as money laundering, fraud, tax evasion and terrorism financing.</p>

        <p>As a consequence of a ruling by the European Court of Justice, from the end of November 2022, the Dutch UBO register is no longer accessible to the public:</p>
    
        <ul>
        <li>a. The Court finds that the UBO register intends to serve a general interest. The UBO register is an integral part of a European anti-money laundering directive.</li>
        <li>b. This objective justifies an infringement of honouring the right to privacy.</li>
        <li>c. The Court subsequently suggests that a fully public UBO register is insufficiently underpinned and therefore invalid. d. The Ministry of Finance subsequently determined at the end of November 2022 that ‘for the time being no further provision of information is possible’ from the UBO register.</li>
        </ul>
        <br/>
        <p>The UBO records in the NL-EITI report followed this approach, as a consequence of which recent UBO information can no longer be reproduced in this report. Unless there is a listed parent company or a parent company located in a country where the UBO register is public.</p>        
    `,
    "endpoints": ["entities"],
    "segment": "2023",
}
];

export default config;