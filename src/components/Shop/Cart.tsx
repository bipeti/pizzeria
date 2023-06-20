import { createPortal } from "react-dom";
import classes from "./Cart.module.css";

const Cart = () => {
    return (
        <>
            <div className={classes.maincart}>
                <h3>Kosár</h3>
                <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Eligendi quaerat doloremque voluptate nesciunt reprehenderit
                    inventore labore, in aliquam atque, animi, culpa dolorem
                    nisi fuga. Labore dignissimos saepe rem soluta ipsam?
                </p>
            </div>
            {createPortal(
                <div className={classes.subcart}>
                    KisKosár - Nem írom át a Kinga kérésére
                </div>,
                document.body
            )}
        </>
    );
};

export default Cart;
