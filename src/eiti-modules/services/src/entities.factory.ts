export const convertEntity = (s: string) => {

    switch(s) {

        case 'NAM': 
            return 'nam';
        case 'MOBIL': 
            return 'exxonmobil';
        case "PETROGAS": 
            return 'petrogas';
        case "TAQA PG": 
            return 'taqa';
        case "FRISIA": 
            return 'frisia_zoutwinning';
        case "TAQA ON": 
            return 'taqa';
        case "TAQA OFF": 
            return 'taqa';
        case 'VERM': 
            return 'vermilion_energy';
        case "NEPTUNE": 
            return 'neptune_energy';
        case 'DANA': 
            return 'dana_petroleum';
        case 'TOTAL': 
            return 'total';
        case 'ONE': 
            return 'one_dyas';
        case 'SPIRIT': 
            return 'spirit_energy';
        case "KISTOS NL2":
            return 'kistos';
        case 'WIN': 
            return 'wintershall';
        default: 
            return s;
        
    }
}

