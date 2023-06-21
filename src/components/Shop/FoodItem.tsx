import classes from "./FoodItem.module.css";
import { Food } from "./Foods";
import FoodPrices from "./FoodPrices";
import { useState } from "react";

type FoodItemProps = {
    food: Food;
    onAddToCart: (food: Food, detailId?: number) => void;
};

const FoodItem = ({ food, onAddToCart }: FoodItemProps) => {
    const [selectedPrice, setSelectedPrice] = useState<String>();

    let haveMorePrizes = food.prices !== undefined && food.prices.length > 0;

    const handleSelectedPrice = (selected: string) => {
        setSelectedPrice(selected);
    };

    const addToCartHandler = () => {
        if (haveMorePrizes) {
            if (!selectedPrice) {
                alert("Válaszd ki valamelyik tételt!");
                return;
            }
        }
        onAddToCart(food, Number(selectedPrice));
    };

    return (
        <li className={classes.li}>
            <div className={classes.name}>
                <h3>{food.name}</h3>
                <p>{food.description}</p>
            </div>
            <div className={classes.price}>
                {food.prices !== undefined && food.prices.length > 0 && (
                    // if there are more prizes, not just 1
                    <FoodPrices
                        foodId={food.id}
                        foodPrizes={food.prices}
                        handleSelectedPrice={handleSelectedPrice}
                    />
                )}

                {food.price && (
                    // if there is just 1 prize available
                    <div className={classes.price}>
                        <p>{food.price} Ft</p>
                    </div>
                )}
            </div>
            <div className={classes.orderbutton}>
                <button onClick={addToCartHandler}>KOS</button>
            </div>
        </li>
    );
};

export default FoodItem;
