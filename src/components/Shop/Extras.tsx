import Modal from "../UI/Modal";
import { Collapsible } from "../Layout/Collapsible";
import classes from "./Extras.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { cartActions } from "../../store/cart-slice";
import { numberToPrice } from "../utils/formatNumber";
import { Details, Food } from "../../store/food-slice";

type ExtrasProps = {
    food: Food;
    priceId: number | undefined;
    onClose: () => void;
};

const Extras = ({ onClose, food, priceId }: ExtrasProps) => {
    const dispatch = useDispatch();
    const [selectedExtras, setSelectedExtras] = useState<Details[]>([]);
    const [selectedChildrenPortion, setSelectedChildrenPortion] =
        useState(false);

    let myPrice = 0;
    let price;
    let myVarietyName = "";

    if (food.price !== undefined) {
        myPrice = food.price;
    }

    if (food.varieties !== undefined && food.varieties.length > 0) {
        let myElement = food.varieties!.find(
            (element) => element.id === priceId
        );
        myVarietyName = myElement!.name;
        myPrice = myElement!.price;
    }
    price = <h3>Alapár: {numberToPrice(myPrice)}</h3>;

    const [subTotal, setSubTotal] = useState(myPrice + food.packagingFee);

    const extraHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, name, checked, value } = event.target;
        if (checked) {
            setSelectedExtras((prevSelectedExtras) => [
                ...prevSelectedExtras,
                { id: Number(id), name, price: Number(value) },
            ]);
            setSubTotal(subTotal + Number(value));
        } else {
            setSelectedExtras((prevSelectedExtras) =>
                prevSelectedExtras.filter((extra) => extra.name !== name)
            );
            setSubTotal(subTotal - Number(value));
        }
    };

    const childrenHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = event.target;
        if (checked) {
            setSubTotal(subTotal - myPrice + Number(value));
            setSelectedChildrenPortion(true);
        } else {
            setSubTotal(subTotal + myPrice - Number(value));
            setSelectedChildrenPortion(false);
        }
    };

    let hasExtras = food.extras !== undefined && food.extras.length > 0 && (
        <Collapsible title="Milyen extrát kérsz hozzá?" isOpened={true}>
            <ul className={classes.inner}>
                {food.extras.map((extra) => (
                    <li key={extra.id}>
                        <input
                            type="checkbox"
                            name={extra.name}
                            key={extra.name}
                            id={extra.id.toString()}
                            value={extra.price}
                            onChange={extraHandler}
                        ></input>
                        <label
                            htmlFor={extra.id.toString()}
                            className={classes.extraName}
                        >
                            {extra.name + " "}
                        </label>
                        <label
                            htmlFor={extra.id.toString()}
                            className={classes.extraPrice}
                        >
                            {numberToPrice(extra.price)}
                        </label>
                    </li>
                ))}
            </ul>
        </Collapsible>
    );

    let hasChildrenPortion = food.hasChildrenServingSize && (
        <Collapsible title="Gyerekadag" isOpened={false}>
            <div className={classes.inner}>
                <p>
                    <input
                        type="checkbox"
                        name="childrenServingSize"
                        key="childrenServingSize"
                        id="childrenServingSize"
                        value={food.priceOfChildrenServingSize}
                        onChange={childrenHandler}
                    ></input>
                    <label
                        htmlFor="childrenServingSize"
                        className={classes.extraName}
                    >
                        {"igen "}
                    </label>
                    <label
                        htmlFor="childrenServingSize"
                        className={classes.extraPrice}
                    >
                        {numberToPrice(food.priceOfChildrenServingSize!)}
                    </label>
                </p>
            </div>
        </Collapsible>
    );

    const addToCartHandler = () => {
        // Reminder: the price in the cart contains the sum of all of
        // extras, or children portion, except the packagingFee.

        dispatch(
            cartActions.addItemToCart({
                id: "", // it recalculated in cart-slice
                foodId: food.id,
                foodName: food.name,
                price: subTotal - food.packagingFee,
                chosenChildrenServingSize: selectedChildrenPortion,
                packingFee: food.packagingFee,
                quantity: 1,
                extras: selectedExtras,
                varietyName: myVarietyName,
            })
        );
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <h2>
                {food.name} {myVarietyName}
            </h2>
            {price}
            {hasExtras}
            {hasChildrenPortion}
            <div className={classes.packing}>
                <p>Csomagolás: {numberToPrice(food.packagingFee)}</p>
            </div>
            <div className={classes.subTotal}>
                <p>Ár: {numberToPrice(subTotal)}</p>
            </div>
            <div className={classes.buttons}>
                <button onClick={onClose}>Mégsem</button>
                <button onClick={addToCartHandler}>Kosárba</button>
            </div>
        </Modal>
    );
};

export default Extras;
