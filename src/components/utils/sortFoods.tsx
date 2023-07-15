import { Food } from "../../store/food-slice";

const getPrice = (food: Food): number | undefined => {
    if (food.price !== undefined) {
        return food.price;
    }
    if (food.varieties && food.varieties.length > 0) {
        return food.varieties[0].price;
    }
    return undefined;
};

export const getSortedFoodsForGroup = (
    foods: Food[],
    groupName: string
): Food[] => {
    const filteredFoods = foods.filter((food) => food.group === groupName);

    const sortedFoods = filteredFoods.sort((a, b) => {
        const priceA = getPrice(a);
        const priceB = getPrice(b);

        if (priceA !== undefined && priceB !== undefined) {
            return priceA - priceB;
        }
        if (priceA !== undefined) {
            return -1;
        }
        if (priceB !== undefined) {
            return 1;
        }
        return 0;
    });

    return sortedFoods;
};
