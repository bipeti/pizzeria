import { CartState } from "../../store/cart-slice";
import { HOURS_TO_SAVE_CARTS_DATA, HOURS_TO_SAVE_USERS_DATA } from "./myConsts";

type UserTokenPayload = {
    email: string;
    mobile: string;
    firstName: string;
};

export function getTokenDuration(token: string) {
    const storedExpirationDate = localStorage.getItem(token);
    if (!storedExpirationDate) {
        return null;
    }
    const expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();
    return duration;
}

export function setTokenHours(number: number) {
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + number);
    return expiration;
}

export const removeCartTokens = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("cart-expiration");
};

export const getCartFromLocalStorage = (): CartState | null => {
    const cartData = localStorage.getItem("cart");
    const cartExpirationData = localStorage.getItem("cart-expiration");
    if (!cartExpirationData || !cartData) {
        return null;
    }

    if (getTokenDuration("cart-expiration")! < 0) {
        removeCartTokens();
        return null;
    }
    localStorage.setItem(
        "cart-expiration",
        setTokenHours(HOURS_TO_SAVE_CARTS_DATA).toString()
    );
    return JSON.parse(cartData);
};

export const saveCartToLocalStorage = (cartState: CartState) => {
    localStorage.setItem("cart", JSON.stringify(cartState));
    localStorage.setItem(
        "cart-expiration",
        setTokenHours(HOURS_TO_SAVE_CARTS_DATA).toString()
    );
};

export const onCartOperations = (cartState: CartState) => {
    saveCartToLocalStorage(cartState);
    userExpirationTokenValidation();
};

export function setUserToken(tokenPayload: UserTokenPayload) {
    const encodedPayload = btoa(JSON.stringify(tokenPayload));

    const token = `Bearer ${encodedPayload}`;
    localStorage.setItem("user", token);
    localStorage.setItem(
        "user-expiration",
        setTokenHours(HOURS_TO_SAVE_USERS_DATA).toString()
    );
}

export function getUserToken() {
    const userData = localStorage.getItem("user");
    const userExpirationData = localStorage.getItem("user-expiration");

    if (!userExpirationData || !userData) {
        return null;
    }
    if (getTokenDuration("user-expiration")! < 0) {
        removeUserTokens();
        return null;
    }
    localStorage.setItem(
        "user-expiration",
        setTokenHours(HOURS_TO_SAVE_USERS_DATA).toString()
    );

    const encodedPayload = userData.split(" ")[1];
    const decodedPayload = atob(encodedPayload);

    const payloadObject: UserTokenPayload = JSON.parse(decodedPayload);
    return payloadObject;
}

export function removeUserTokens() {
    localStorage.removeItem("user");
    localStorage.removeItem("user-expiration");
}

export function userExpirationTokenValidation() {
    // it is called frequently, so we don't perform database operation, just longer expiration
    if (getTokenDuration("user-expiration")! < 0) {
        removeUserTokens();
        return null;
    }
    localStorage.setItem(
        "user-expiration",
        setTokenHours(HOURS_TO_SAVE_USERS_DATA).toString()
    );
}
