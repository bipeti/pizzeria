import Modal from "../UI/Modal";
import { Food } from "./Foods";
import { Collapsible } from "../Layout/Collapsible";
import classes from "./Extras.module.css";
import { useState } from "react";

type ExtrasProps = {
    food: Food;
    priceId: number | undefined;
    onClose: () => void;
};

const Extras = ({ onClose, food, priceId }: ExtrasProps) => {
    let myPrice = 0;
    let havePrice;
    let havePrices;

    if (food.price !== undefined) {
        havePrice = <h3>Alapár: {food.price}</h3>;
        myPrice = food.price;
    }

    if (food.prices !== undefined && food.prices.length > 0) {
        let myElement = food.prices!.find((element) => element.id === priceId);
        havePrices = (
            <h3>
                Alapár: {myElement!.name} {myElement!.price}
            </h3>
        );
        myPrice = myElement!.price;
    }

    const [subTotal, setSubTotal] = useState(myPrice + food.packigingFee);

    const extraHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.checked
            ? setSubTotal(subTotal + Number(event.target.value))
            : setSubTotal(subTotal - Number(event.target.value));
    };

    const childrenHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.checked
            ? setSubTotal(subTotal - myPrice + Number(event.target.value))
            : setSubTotal(subTotal + myPrice - Number(event.target.value));
    };

    let haveExtras = food.extras !== undefined && food.extras.length > 0 && (
        <Collapsible title="Milyen extrát kérsz hozzá?" isOpened={true}>
            <div className={classes.inner}>
                {food.extras.map((extra) => (
                    <p>
                        <input
                            type="checkbox"
                            name={extra.name}
                            key={extra.name}
                            id={extra.name}
                            value={extra.price}
                            onChange={extraHandler}
                        ></input>
                        <label
                            htmlFor={extra.name}
                            className={classes.extraName}
                        >
                            {extra.name + " "}
                        </label>
                        <label
                            htmlFor={extra.name}
                            className={classes.extraPrice}
                        >
                            {extra.price}
                        </label>
                    </p>
                ))}
            </div>
        </Collapsible>
    );

    let haveChildrenPortion = food.haveChildrenServingSize && (
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
                        {food.priceOfChildrenServingSize}
                    </label>
                </p>
            </div>
        </Collapsible>
    );

    return (
        <Modal onClose={onClose}>
            <h2>{food.name}</h2>
            {havePrice}
            {havePrices}
            {haveExtras}
            {haveChildrenPortion}
            <h4>Csomagolás: {food.packigingFee}</h4>
            <h3>Ár: {subTotal}</h3>
            <button>Kosárba</button>
        </Modal>
    );
};

export default Extras;
