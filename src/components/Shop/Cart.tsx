import { createPortal } from "react-dom";
import classes from "./Cart.module.css";

const Cart = () => {
    return (
        <>
            <div className={classes.maincart}>Kosár</div>
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
