import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Details } from "../components/Shop/Foods";

type Items = {
    id: number;
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
    // type CartState = {
    items: Items[];
    packingFee: number;
    totalPrice: number;
    changed: boolean;
};

const initialState: CartState = {
    items: [],
    packingFee: 0,
    totalPrice: 0,
    changed: false,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItemToCart(state, action: PayloadAction<Items>) {
            const newItem = action.payload;
            const newId = state.items.length;
            state.changed = true;
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
        },
        removeItemFromCart(state, action: PayloadAction<{ id: number }>) {
            const id = action.payload.id;
            const existingItem = state.items.find((item) => item.id === id);
            state.changed = true;
            state.totalPrice -=
                existingItem!.price +
                existingItem!.packingFee * existingItem!.quantity;
            state.packingFee -=
                existingItem!.packingFee * existingItem!.quantity;
            state.items = state.items.filter((item) => item.id !== id);
        },
        decreaseItemInCart(state, action: PayloadAction<{ id: number }>) {
            const id = action.payload.id;
            const existingItem = state.items.find((item) => item.id === id);
            state.changed = true;

            if (existingItem!.quantity === 1) {
                cartSlice.caseReducers.removeItemFromCart(state, action);
            } else {
                const unitPrice = existingItem!.price / existingItem!.quantity;
                existingItem!.quantity -= 1;
                existingItem!.price -= unitPrice;
                state.packingFee -= existingItem!.packingFee;
                state.totalPrice -= unitPrice + existingItem!.packingFee;
            }
        },
        increaseItemInCart(state, action: PayloadAction<{ id: number }>) {
            const id = action.payload.id;
            const existingItem = state.items.find((item) => item.id === id);
            state.changed = true;
            const unitPrice = existingItem!.price / existingItem!.quantity;
            existingItem!.quantity += 1;
            existingItem!.price += unitPrice;
            state.packingFee += existingItem!.packingFee;
            state.totalPrice += unitPrice + existingItem!.packingFee;
        },
    },
});

export const cartActions = cartSlice.actions;
export default cartSlice;