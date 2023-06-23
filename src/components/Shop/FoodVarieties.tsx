import classes from "./FoodVarieties.module.css";
import { Details } from "./Foods";

type FoodVarietiesProps = {
    foodId: number;
    foodVarieties: Details[];
    handleSelectedPrice: (selected: string) => void;
};

const FoodVarieties = ({
    foodId,
    foodVarieties,
    handleSelectedPrice,
}: FoodVarietiesProps) => {
    const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleSelectedPrice(event.target.value);
    };

    return (
        <ul>
            {foodVarieties.map((detail) => (
                <li key={"food" + foodId + "detail" + detail.id}>
                    <input
                        type="radio"
                        name={"food" + foodId}
                        key={"food" + foodId + "detail" + detail.id}
                        id={"food" + foodId + "detail" + detail.id}
                        value={detail.id}
                        onChange={radioHandler}
                    ></input>
                    <label
                        htmlFor={"food" + foodId + "detail" + detail.id}
                        className={classes.detailName}
                    >
                        {detail.name}
                    </label>
                    <label
                        htmlFor={"food" + foodId + "detail" + detail.id}
                        className={classes.detailPrice}
                    >
                        {detail.price} {" Ft"} <br></br>
                    </label>
                </li>
            ))}
        </ul>
    );
};

export default FoodVarieties;
