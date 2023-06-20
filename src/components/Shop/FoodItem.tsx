import classes from "./FoodItem.module.css";
import { Food } from "./Foods";

type FoodItemProps = {
    food: Food;
    showExtras: () => void;
};

const FoodItem = ({ food, showExtras }: FoodItemProps) => {
    const addToCart = () => {
        showExtras();
    };

    return (
        <li className={classes.li}>
            <div className={classes.name}>
                <h3>{food.name}</h3>
                <p>{food.description}</p>
            </div>
            <div className={classes.price}>
                {food.prices !== undefined &&
                    food.prices.length > 0 &&
                    // if there are more prizes, not just 1
                    food.prices.map((detail) => (
                        <>
                            <input
                                type="radio"
                                name={food.id.toString()}
                                key={food.id + detail.name}
                                id={food.id + detail.name}
                                value={detail.price}
                            ></input>
                            <label
                                htmlFor={food.id + detail.name}
                                className={classes.detailName}
                            >
                                {detail.name}
                            </label>
                            <label
                                htmlFor={food.id + detail.name}
                                className={classes.detailPrice}
                            >
                                {detail.price} {" Ft"} <br></br>
                            </label>
                        </>
                    ))}

                {food.price && (
                    // if there is just 1 prize available
                    <div className={classes.price}>
                        <p>{food.price} Ft</p>
                    </div>
                )}
            </div>
            <div className={classes.orderbutton}>
                <input type="button" value="KOS" onClick={addToCart} />
            </div>
        </li>
    );
};

export default FoodItem;
