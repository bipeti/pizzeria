import { Food } from "../../store/food-slice";
import { numberToPrice } from "../utils/formatNumber";
import classes from "./FoodItem.module.css";
import FoodVarieties from "./FoodVarieties";
import { useState } from "react";

type FoodItemProps = {
    food: Food;
    onAddToCart: (food: Food, detailId?: number) => void;
};

const FoodItem = ({ food, onAddToCart }: FoodItemProps) => {
    const [selectedPrice, setSelectedPrice] = useState<String>();
    const [incompleteChoice, setIncompleteChoice] = useState(false);

    let hasMorePrizes =
        food.varieties !== undefined && food.varieties.length > 0;

    const handleSelectedPrice = (selected: string) => {
        setSelectedPrice(selected);
        setIncompleteChoice(false);
    };

    const addToCartHandler = () => {
        if (hasMorePrizes) {
            if (!selectedPrice) {
                setIncompleteChoice(true);
                return;
            }
        }
        onAddToCart(food, Number(selectedPrice));
    };
    let priceClass = `${classes.price}`;
    if (incompleteChoice) {
        priceClass = `${classes.priceinvalid}`;
    }

    return (
        <div className={classes.outer}>
            <div className={classes.name}>
                <h3>{food.name}</h3>
                <p>{food.description}</p>
            </div>
            <div className={priceClass}>
                {food.varieties !== undefined && food.varieties.length > 0 && (
                    // if there are more prizes, not just 1
                    <FoodVarieties
                        foodId={food.id}
                        foodVarieties={food.varieties}
                        handleSelectedPrice={handleSelectedPrice}
                    />
                )}

                {food.price && (
                    // if there is just 1 prize available
                    <div className={classes.price}>
                        <p>{numberToPrice(food.price)}</p>
                    </div>
                )}
            </div>
            <div className={classes.orderbutton}>
                <img alt="cart" src="cart.png" onClick={addToCartHandler}></img>
            </div>
        </div>
    );
};

export default FoodItem;
