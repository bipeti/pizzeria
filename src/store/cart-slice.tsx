import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Details } from "../components/Shop/Foods";
import { getTokenDuration, setTokenHours } from "../components/utils/token";

const HOURS_TO_SAVE_CARTS_DATA = 2;

type Items = {
    id: string;
    foodId: number;
    foodName: string;
    varietyName?: string;
    price: number; // the price in the cart contains the sum of all of
    // extras, or children portion, except the packagingFee.
    chosenChildrenServingSize: boolean;
    extras?: Details[];
    quantity: number;
    packingFee: number;
};

export type CartState = {
    items: Items[];
    packingFee: number;
    totalPrice: number;
    // changed: boolean;
};

const removeCartTokens = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("cart-expiration");
};
const getCartFromLocalStorage = (): CartState | null => {
    const cartData = localStorage.getItem("cart");
    const cartExpirationData = localStorage.getItem("cart-expiration");
    if (!cartExpirationData || !cartData) {
        return null;
    }

    if (getTokenDuration()! < 0) {
        removeCartTokens();
        return null;
    }
    localStorage.setItem(
        "cart-expiration",
        setTokenHours(HOURS_TO_SAVE_CARTS_DATA).toString()
    );
    return JSON.parse(cartData);
};

const saveCartToLocalStorage = (cartState: CartState) => {
    localStorage.setItem("cart", JSON.stringify(cartState));
    localStorage.setItem(
        "cart-expiration",
        setTokenHours(HOURS_TO_SAVE_CARTS_DATA).toString()
    );
};

const initialState: CartState = getCartFromLocalStorage() || {
    items: [],
    packingFee: 0,
    totalPrice: 0,
    // changed: false,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItemToCart(state, action: PayloadAction<Items>) {
            const newItem = action.payload;
            const newId = crypto.randomUUID();
            // state.changed = true;
            state.items.push({
                id: newId,
                foodId: newItem.foodId,
                foodName: newItem.foodName,
                price: newItem.price,
                chosenChildrenServingSize: newItem.chosenChildrenServingSize,
                quantity: 1,
                varietyName: newItem.varietyName,
                extras: newItem.extras,
                packingFee: newItem.packingFee,
            });
            state.packingFee += newItem.packingFee;
            state.totalPrice += newItem.price + newItem.packingFee;
            saveCartToLocalStorage(state);
        },
        removeItemFromCart(state, action: PayloadAction<{ id: string }>) {
            const id = action.payload.id;
            const existingItem = state.items.find((item) => item.id === id);
            // state.changed = true;
            state.totalPrice -=
                existingItem!.price +
                existingItem!.packingFee * existingItem!.quantity;
            state.packingFee -=
                existingItem!.packingFee * existingItem!.quantity;
            state.items = state.items.filter((item) => item.id !== id);
            saveCartToLocalStorage(state);
        },
        decreaseItemInCart(state, action: PayloadAction<{ id: string }>) {
            const id = action.payload.id;
            const existingItem = state.items.find((item) => item.id === id);
            // state.changed = true;

            if (existingItem!.quantity === 1) {
                cartSlice.caseReducers.removeItemFromCart(state, action);
            } else {
                const unitPrice = existingItem!.price / existingItem!.quantity;
                existingItem!.quantity -= 1;
                existingItem!.price -= unitPrice;
                state.packingFee -= existingItem!.packingFee;
                state.totalPrice -= unitPrice + existingItem!.packingFee;
            }
            saveCartToLocalStorage(state);
        },
        increaseItemInCart(state, action: PayloadAction<{ id: string }>) {
            const id = action.payload.id;
            const existingItem = state.items.find((item) => item.id === id);
            // state.changed = true;
            const unitPrice = existingItem!.price / existingItem!.quantity;
            existingItem!.quantity += 1;
            existingItem!.price += unitPrice;
            state.packingFee += existingItem!.packingFee;
            state.totalPrice += unitPrice + existingItem!.packingFee;
            saveCartToLocalStorage(state);
        },
        emptyCart(state) {
            state.items = [];
            state.packingFee = 0;
            state.totalPrice = 0;
            removeCartTokens();
        },
    },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
