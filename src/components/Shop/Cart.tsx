import { createPortal } from "react-dom";
import classes from "./Cart.module.css";
import { useSelector } from "react-redux";
import {
    CartState,
    cartActions,
    sendOrderDataAsync,
} from "../../store/cart-slice";
import { useDispatch } from "react-redux";
import { numberToPrice } from "../utils/formatNumber";
import { useState } from "react";
import { removeUserTokens } from "../utils/token";
import { AppDispatch } from "../../store";
import FeedbackModal from "../UI/FeedbackModal";
import { AuthState, authActions } from "../../store/auth-slice";

const Cart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [isFullPageCart, setIsFullPageCart] = useState(false);
    const [subCartIsTouched, setSubCartIsTouched] = useState(false);

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
    const orderMessage = useSelector(
        (state: { cart: CartState }) => state.cart.orderMessage
    );
    const isLoading = useSelector(
        (state: { cart: CartState }) => state.cart.isLoading
    );
    const errorMessage = useSelector(
        (state: { cart: CartState }) => state.cart.error
    );
    const userData = useSelector(
        (state: { auth: AuthState }) => state.auth.user
    );
    // const goToLogin = useSelector(
    //     (state: { auth: AuthState }) => state.auth.goToLogin
    // );

    const removeFromCartHandler = (id: string) => {
        dispatch(
            cartActions.removeItemFromCart({
                id,
            })
        );
    };

    const decreaseItemInCartHandler = (id: string) => {
        dispatch(
            cartActions.decreaseItemInCart({
                id,
            })
        );
    };

    const increaseItemInCartHandler = (id: string) => {
        dispatch(
            cartActions.increaseItemInCart({
                id,
            })
        );
    };

    function showCartOnFullPage() {
        if (isFullPageCart) {
            document.body.classList.remove("noScroll");
        } else {
            document.body.classList.add("noScroll");
        }
        setSubCartIsTouched(true);
        setIsFullPageCart(!isFullPageCart);
    }

    const orderHandler = async () => {
        if (!userData) {
            console.log("There is some error with the token.");
            removeUserTokens();
            dispatch(authActions.showLoginHandler());
            return;
        }
        const { password, registrationDate, ...partialUserData } = userData;

        dispatch(
            sendOrderDataAsync({
                orderedItems: cartItems,
                packingFee: packingFee,
                totalPrice: totalPrice,
                userData: partialUserData,
            })
        );
    };

    const feedbackCloseHandler = () => {
        dispatch(cartActions.clearMessages());
    };

    if (cartItems !== undefined && cartItems.length > 0) {
        cart = (
            <div className={classes.content}>
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
                                <div className={classes.buttons}>
                                    <img
                                        alt="trash"
                                        src="trash-can.png"
                                        onClick={removeFromCartHandler.bind(
                                            null,
                                            item.id
                                        )}
                                    />
                                    <img
                                        alt="minus"
                                        src="minus.png"
                                        onClick={decreaseItemInCartHandler.bind(
                                            null,
                                            item.id
                                        )}
                                    />
                                    <p>{item.quantity}</p>
                                    <img
                                        alt="plus"
                                        src="plus.png"
                                        onClick={increaseItemInCartHandler.bind(
                                            null,
                                            item.id
                                        )}
                                    />
                                </div>
                                <div>{numberToPrice(item.price)}</div>
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
                    <div>{numberToPrice(packingFee)}</div>
                </div>
                <div className={classes.totalPrice}>
                    <div>Végösszeg:</div>
                    <div>{numberToPrice(totalPrice)}</div>
                </div>
                <div className={classes.orderButton}>
                    <button onClick={orderHandler} className="globalbuttons">
                        Megrendelés
                    </button>
                </div>
            </div>
        );

        bottomCart = createPortal(
            <div className={classes.subcart}>
                <div
                    className={`${classes.subInner} ${classes.left}`}
                    onClick={showCartOnFullPage}
                >
                    <div className={classes.left_inner}>
                        <img
                            alt="arrow"
                            src="arrow-down.png"
                            className={`${classes.arrow} ${
                                isFullPageCart ? "" : classes.open
                            }`}
                        ></img>
                        <div className={classes.cart_summarize}>
                            <p>{cartItems.length} tétel a kosárban</p>
                            <p>
                                <img alt="cart" src="cart.png" />
                                {numberToPrice(totalPrice)}
                            </p>
                        </div>
                    </div>
                </div>
                <div
                    className={`${classes.subInner} ${classes.right}`}
                    onClick={orderHandler}
                >
                    Megrendelés
                </div>
            </div>,
            document.body
        );
    }
    let subCartClass = "";
    !subCartIsTouched
        ? // Just playing the closing effect, if the subCart was open earlier
          (subCartClass = "")
        : (subCartClass = classes["fullPageCart-closing"]);

    return (
        <>
            {orderMessage && (
                <FeedbackModal
                    onClose={feedbackCloseHandler}
                    message={orderMessage}
                    isLoading={isLoading}
                    errorMessage={errorMessage}
                />
            )}

            <div
                className={`${classes.maincart} ${
                    isFullPageCart
                        ? classes["fullPageCart-opening"]
                        : subCartClass
                }`}
            >
                <h3>Kosár</h3>
                <img
                    alt="close"
                    className={classes.close_img}
                    src="close.png"
                    onClick={showCartOnFullPage}
                />
                {cart}
            </div>
            {bottomCart}
        </>
    );
};

export default Cart;
