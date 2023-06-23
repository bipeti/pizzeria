import classes from "./FoodItem.module.css";
import { Food } from "./Foods";
import FoodVarieties from "./FoodVarieties";
import { useState } from "react";

type FoodItemProps = {
    food: Food;
    onAddToCart: (food: Food, detailId?: number) => void;
};

const FoodItem = ({ food, onAddToCart }: FoodItemProps) => {
    const [selectedPrice, setSelectedPrice] = useState<String>();

    let hasMorePrizes =
        food.varieties !== undefined && food.varieties.length > 0;

    const handleSelectedPrice = (selected: string) => {
        setSelectedPrice(selected);
    };

    const addToCartHandler = () => {
        if (hasMorePrizes) {
            if (!selectedPrice) {
                alert("Válaszd ki valamelyik tételt!");
                return;
            }
        }
        onAddToCart(food, Number(selectedPrice));
    };

    return (
        <div className={classes.li}>
            <div className={classes.name}>
                <h3>{food.name}</h3>
                <p>{food.description}</p>
            </div>
            <div className={classes.price}>
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
                        <p>{food.price} Ft</p>
                    </div>
                )}
            </div>
            <div className={classes.orderbutton}>
                <button onClick={addToCartHandler}>KOS</button>
            </div>
        </div>
    );
};

export default FoodItem;
