import { get, ref, set } from "@firebase/database";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../components/utils/firebase";
import {
    DUMMY_FOOD_GROUPS,
    DUMMY_PRODUCTS,
} from "../components/utils/myConsts";

export type Details = {
    id: number;
    name: string;
    price: number;
};

export type Food = {
    id: number;
    name: string;
    description: string; // e.g. ingredients
    group: string; // pizza, soup, etc.
    price?: number;
    hasChildrenServingSize: boolean;
    priceOfChildrenServingSize?: number;
    varieties?: Details[]; // e.g. different sizes of pizzas
    extras?: Details[]; // e.g. topping to pizza, or bread to sg. that is choosable to this
    packagingFee: number;
};

export type FoodGroup = {
    id: number;
    name: string;
    order: number;
    imageURL: string;
};

export type FoodState = {
    items: Food[];
    foodGroups: FoodGroup[];
    isLoading: boolean;
    error: undefined | string;
};

const initialState: FoodState = {
    items: [],
    foodGroups: [],
    isLoading: false,
    error: undefined,
};

export const writeDummyDataToDatabase = createAsyncThunk(
    "food/writeDummyDataToDatabase",

    async () => {
        const foodsRef = ref(db, "foods");
        try {
            const snapshot = await get(foodsRef);

            if (snapshot.exists()) {
                console.log(
                    "Data already exists in Firebase. Skipping write operation."
                );
                return;
            }
            await set(foodsRef, DUMMY_PRODUCTS);
            console.log("Data successfully written to Firebase.");
        } catch (error) {
            throw new Error("Database writing error");
        }
    }
);

export const writeDummyGroupsToDatabase = createAsyncThunk(
    "food/writeDummyGroupsToDatabase",

    async () => {
        const foodsRef = ref(db, "foodGroups");
        try {
            const snapshot = await get(foodsRef);

            if (snapshot.exists()) {
                console.log(
                    "Data already exists in Firebase. Skipping write operation."
                );
                return;
            }
            await set(foodsRef, DUMMY_FOOD_GROUPS);
            console.log("Data successfully written to Firebase.");
        } catch (error) {
            throw new Error("Database writing error");
        }
    }
);

export const getFoods = createAsyncThunk("food/getFoods", async () => {
    const foodsRef = ref(db, "foods");
    try {
        const snapshot = await get(foodsRef);
        const foods: Food[] = [];

        snapshot.forEach((childSnapshot) => {
            const food: Food = childSnapshot.val();
            foods.push(food);
        });
        return foods;
    } catch (error) {
        console.error("Database retrieval error:", error);
        throw error;
    }
});

export const getFoodGroups = createAsyncThunk(
    "food/getFoodGroups",
    async () => {
        const foodsRef = ref(db, "foodGroups");
        try {
            const snapshot = await get(foodsRef);
            const foodGroups: FoodGroup[] = [];

            snapshot.forEach((childSnapshot) => {
                const foodGroup: FoodGroup = childSnapshot.val();
                foodGroups.push(foodGroup);
            });
            return foodGroups;
        } catch (error) {
            console.error("Database retrieval error:", error);
            throw error;
        }
    }
);

const foodSlice = createSlice({
    name: "food",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(writeDummyDataToDatabase.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(writeDummyDataToDatabase.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(writeDummyDataToDatabase.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(getFoods.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getFoods.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(getFoods.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(getFoodGroups.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getFoodGroups.fulfilled, (state, action) => {
                state.isLoading = false;
                state.foodGroups = action.payload;
            })
            .addCase(getFoodGroups.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const foodActions = foodSlice.actions;
export default foodSlice;
