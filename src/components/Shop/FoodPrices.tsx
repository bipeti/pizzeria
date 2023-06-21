import classes from "./FoodPrices.module.css";
import { Details } from "./Foods";

type FoodPricesProps = {
    foodId: number;
    foodPrizes: Details[];
    handleSelectedPrice: (selected: string) => void;
};

const FoodPrices = ({
    foodId,
    foodPrizes,
    handleSelectedPrice,
}: FoodPricesProps) => {
    const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleSelectedPrice(event.target.value);
    };

    return (
        <>
            {foodPrizes.map((detail) => (
                <>
                    <input
                        type="radio"
                        name={"food" + foodId}
                        key={detail.id}
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
                </>
            ))}
        </>
    );
};

export default FoodPrices;
