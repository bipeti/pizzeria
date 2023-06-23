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
            <>
                <ul>
                    {cartItems.map((item) => (
                        <li key={item.id}>
                            X + {item.quantity} - E {item.foodName}
                            {item.varietyName === "" ||
                            item.varietyName === undefined
                                ? ""
                                : " - " + item.varietyName}
                            {item.chosenChildrenServingSize
                                ? " - Gyerekadag"
                                : ""}{" "}
                            {item.price}
                            {item.extras !== undefined &&
                                item.extras.length > 0 && (
                                    <>
                                        <p>Extrák:</p>
                                        <ul>
                                            {item.extras?.map((extra) => (
                                                <li>{extra.name}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                        </li>
                    ))}
                </ul>
                <p className={classes.packing}>Csomagolás: {packingFee}</p>
                <p className={classes.totalPrice}>Végösszeg: {totalPrice}</p>
            </>
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
