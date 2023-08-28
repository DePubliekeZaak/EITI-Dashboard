export const degreestoDecimals = (string) : number =>  {

    const array = string.replace("°","").split(" ");
    return parseInt(array[1]) + (parseFloat(array[2]) / 60) + (parseFloat(array[3]) / 3600);
    
}