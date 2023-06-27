export const numberToPrice = (number: number) => {
    let numAsString = number.toString();

    let formattedNumber = "";
    let count = 0;

    for (let i = numAsString.length - 1; i >= 0; i--) {
        count++;
        formattedNumber = numAsString[i] + formattedNumber;

        if (count % 3 === 0 && i !== 0) {
            formattedNumber = " " + formattedNumber;
        }
    }

    formattedNumber += " Ft";

    return formattedNumber;
};
