import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Details } from "../components/Shop/Foods";
import {
    getCartFromLocalStorage,
    onCartOperations,
    removeCartTokens,
    userExpirationTokenValidation,
} from "../components/utils/token";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserData } from "./user-actions";
import { push, ref, set } from "@firebase/database";
import { db } from "../components/utils/firebase";

export type Items = {
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

export interface CartLocalStorage {
    items: Items[];
    packingFee: number;
    totalPrice: number;
}

export interface CartState extends CartLocalStorage {
    isLoading: boolean;
    error: undefined | string;
    orderMessage: undefined | string;
}

const getInitialState = (): CartState => {
    const cartData = getCartFromLocalStorage();

    if (cartData) {
        return {
            ...cartData,
            isLoading: false,
            error: undefined,
            orderMessage: undefined,
        };
    }

    return {
        items: [],
        packingFee: 0,
        totalPrice: 0,
        isLoading: false,
        error: undefined,
        orderMessage: undefined,
    };
};

const initialState = getInitialState();

export interface PartialUserData
    extends Omit<UserData, "registrationDate" | "password"> {}

type OrderData = {
    orderedItems: Items[];
    packingFee: number;
    totalPrice: number;
    userData: PartialUserData;
};

export const sendOrderDataAsync = createAsyncThunk(
    "cart/sendOrderData",
    async ({ orderedItems, packingFee, totalPrice, userData }: OrderData) => {
        try {
            const ordersRef = ref(db, "orders");
            const newOrderRef = push(ordersRef);
            const newOrderData = {
                orderedItems,
                packingFee,
                totalPrice,
                date: Date(),
                userData,
            };
            await set(newOrderRef, newOrderData);
        } catch (error) {
            throw new Error("Database writing error");
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItemToCart(state, action: PayloadAction<Items>) {
            const newItem = action.payload;
            const newId = crypto.randomUUID();
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
            onCartOperations(state);
        },
        removeItemFromCart(state, action: PayloadAction<{ id: string }>) {
            const id = action.payload.id;
            const existingItem = state.items.find((item) => item.id === id);
            state.totalPrice -=
                existingItem!.price +
                existingItem!.packingFee * existingItem!.quantity;
            state.packingFee -=
                existingItem!.packingFee * existingItem!.quantity;
            state.items = state.items.filter((item) => item.id !== id);
            onCartOperations(state);
        },
        decreaseItemInCart(state, action: PayloadAction<{ id: string }>) {
            const id = action.payload.id;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem!.quantity === 1) {
                cartSlice.caseReducers.removeItemFromCart(state, action);
            } else {
                const unitPrice = existingItem!.price / existingItem!.quantity;
                existingItem!.quantity -= 1;
                existingItem!.price -= unitPrice;
                state.packingFee -= existingItem!.packingFee;
                state.totalPrice -= unitPrice + existingItem!.packingFee;
            }
            onCartOperations(state);
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
            onCartOperations(state);
        },
        clearMessages(state) {
            state.orderMessage = undefined;
            state.error = undefined;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendOrderDataAsync.pending, (state) => {
                state.isLoading = true;
                state.orderMessage =
                    "A megrendelés rögzítése folyamatban van...";
            })
            .addCase(sendOrderDataAsync.fulfilled, (state) => {
                removeCartTokens();
                state.items = [];
                state.packingFee = 0;
                state.totalPrice = 0;
                state.isLoading = false;
                state.orderMessage = "A megrendelés rögzítése sikerült!";
                userExpirationTokenValidation();
            })
            .addCase(sendOrderDataAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.orderMessage = "A megrendelés rögzítése nem sikerült!";
                state.error = action.error.message;
            });
    },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
