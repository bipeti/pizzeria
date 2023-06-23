import { createPortal } from "react-dom";
import classes from "./Cart.module.css";
import { useSelector } from "react-redux";
import { CartState } from "../../store/cart-slice";

const Cart = () => {
    let cart = <p>A kosarad üres.</p>;
    let bottomCart;
    const cartItems = useSelector(
        (state: { cart: CartState }) => state.cart.items
    );
    const packingFee = useSelector(
        (state: { cart: CartState }) => state.cart.packingFee
    );
    const totalPrice = useSelector(
        (state: { cart: CartState }) => state.cart.totalPrice
    );

    if (cartItems !== undefined && cartItems.length > 0) {
        cart = (
            <div>
                <ul className={classes.list}>
                    {cartItems.map((item) => (
                        <li key={item.id} className={classes.element}>
                            <div className={classes.foodName}>
                                {item.foodName}{" "}
                                {item.varietyName === "" ||
                                item.varietyName === undefined
                                    ? ""
                                    : " - " + item.varietyName}
                                {item.chosenChildrenServingSize
                                    ? " - Gyerekadag"
                                    : ""}{" "}
                            </div>
                            <div className={classes.smallbuttons}>
                                <div>X + {item.quantity} - E</div>
                                <div>{item.price}</div>
                            </div>
                            {item.extras !== undefined &&
                                item.extras.length > 0 && (
                                    <>
                                        <p>Extrák:</p>
                                        <ul>
                                            {item.extras?.map((extra) => (
                                                <li
                                                    key={extra.id}
                                                    className={
                                                        classes.extrasList
                                                    }
                                                >
                                                    {extra.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                        </li>
                    ))}
                </ul>
                <div className={classes.packing}>
                    <div>Csomagolás:</div>
                    <div>{packingFee}</div>
                </div>
                <div className={classes.totalPrice}>
                    <div>Végösszeg:</div>
                    <div>{totalPrice}</div>
                </div>
            </div>
        );

        bottomCart = createPortal(
            <div className={classes.subcart}>
                {cartItems.length} tétel a kosárban
                {totalPrice}
            </div>,
            document.body
        );
    }

    return (
        <>
            <div className={classes.maincart}>
                <h3>Kosár</h3>
                {cart}
            </div>
            {bottomCart}
        </>
    );
};

export default Cart;
