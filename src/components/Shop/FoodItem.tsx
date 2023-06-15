// import classes from "./FoodItem.module.css";
import { Food } from "./Foods";

type FoodItemProps = {
    food: Food;
};

const FoodItem = ({ food }: FoodItemProps) => {
    return (
        <>
            <li>
                {food.id}, {food.name}, {food.price}
            </li>
        </>
    );
};

export default FoodItem;
