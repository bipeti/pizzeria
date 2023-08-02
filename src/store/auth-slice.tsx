import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getUserToken,
    removeUserTokens,
    setTokenHours,
    setUserToken,
} from "../components/utils/token";
import {
    DB_PATH,
    HOURS_TO_SAVE_USERS_DATA,
    SECRET_PASS,
} from "../components/utils/myConsts";
// import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";

import {
    equalTo,
    get,
    limitToFirst,
    orderByChild,
    query,
    ref,
    update,
} from "@firebase/database";
import { db } from "../components/utils/firebase";
import { UserData } from "./general-slice";

type UserTokenPayload = {
    email: string;
    mobile: string;
    firstName: string;
};

export interface AuthState {
    user: UserData | null;
    isLoggedIn: boolean;
    goToLogin: boolean;
    accessToken: UserTokenPayload | null;
    expirationTime: string | null;
    error: undefined | string;
    message: undefined | string;
    isLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    isLoggedIn: false,
    goToLogin: false,
    accessToken: null,
    expirationTime: null,
    error: undefined,
    message: undefined,
    isLoading: false,
};

export const initializeAuthState = createAsyncThunk(
    // we need this asyncthunk, because user data comes from an async function.

    "auth/initializeAuthState",
    async (_, { rejectWithValue }) => {
        try {
            let userTokenInLocal = getUserToken();
            let userExpTimeInLocal = null;
            let user = null;

            if (userTokenInLocal) {
                userExpTimeInLocal = localStorage.getItem("user-expiration");
                user = await getUserWithEmail(userTokenInLocal.email);
            }

            if (user === undefined) {
                // there was userToken, but email was not in the database
                user = null;
                userTokenInLocal = null;
                userExpTimeInLocal = null;
            }

            return {
                user,
                isLoggedIn: userTokenInLocal !== null,
                goToLogin: false,
                accessToken: userTokenInLocal,
                expirationTime: userExpTimeInLocal,
                error: undefined,
                message: undefined,
                isLoading: false,
            };
        } catch (error: any) {
            // Handle error if necessary
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserData = async () => {
    try {
        const response = await fetch(DB_PATH + "/users.json");
        if (!response.ok) {
            throw new Error("Something went wrong");
        }
        const data: Record<string, UserData> = await response.json();
        if (!response.ok) {
            throw new Error("Database reading error");
        }
        const loadedUsers: UserData[] = Object.entries(data).map(
            ([key, data]) => data
            // We only need the data, not the keys.
        );
        return loadedUsers;
    } catch (error) {
        // return [];
        throw error;
    }
};

export const getUserWithEmail = async (email: string) => {
    try {
        const loadedUsers = await fetchUserData();
        const userWithEmail = loadedUsers.find((user) => user.email === email);
        return userWithEmail;
    } catch (error) {
        throw new Error("Database fetching error.");
    }
};

export const loginHandler = createAsyncThunk(
    "auth/loginHandler",
    async ({ email, password }: { email: string; password: string }) => {
        try {
            const user = await getUserWithEmail(email);
            if (!user) {
                throw new Error("E-mail, vagy jelszó nem megfelelő.");
            }
            const passwordInBytes = CryptoJS.AES.decrypt(
                user.password,
                SECRET_PASS
            );
            const decryptedPassword = JSON.parse(
                passwordInBytes.toString(CryptoJS.enc.Utf8)
            );

            if (password !== decryptedPassword) {
                throw new Error("E-mail, vagy jelszó nem megfelelő.");
            }

            // if (!bcrypt.compareSync(password, user.password)) {
            //     throw new Error("E-mail, vagy jelszó nem megfelelő.");
            // }
            return user;
        } catch (error) {
            if ((error as Error).message === "DATABASE_UNREACHABLE") {
                throw new Error(
                    "Database is currently unreachable. Please try again later."
                );
            }

            throw error;
        }
    }
);

export const modifyUserData = createAsyncThunk(
    "auth/modifyUserData",
    async ({ userData }: { userData: UserData }) => {
        const { email, ...updatedData } = userData;

        try {
            const queryRef = query(
                ref(db, "users"),
                orderByChild("email"),
                equalTo(email),
                limitToFirst(1)
            );

            const snapshot = await get(queryRef);

            if (snapshot.exists()) {
                const key = Object.keys(snapshot.val())[0]; // There is only one matching record
                await update(ref(db, `users/${key}`), updatedData);
                return userData;
            } else {
                throw new Error("Nem található az e-mail az adatbázisban.");
            }
        } catch (error) {
            throw error;
        }
    }
);

export const modifyUserPassword = createAsyncThunk(
    "",
    async ({ email, password }: { email: string; password: string }) => {
        try {
            const queryRef = query(
                ref(db, "users"),
                orderByChild("email"),
                equalTo(email),
                limitToFirst(1)
            );

            const snapshot = await get(queryRef);

            if (snapshot.exists()) {
                const key = Object.keys(snapshot.val())[0]; // There is only one matching record
                await update(ref(db, `users/${key}`), { password: password });
            } else {
                throw new Error("Nem található az e-mail az adatbázisban.");
            }
        } catch (error) {
            throw error;
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: () => {
            removeUserTokens();
            return { ...initialState };
        },
        clearMessages: (state) => {
            return { ...state, error: undefined, message: undefined };
        },
        showLoginHandler: (state) => {
            state.goToLogin = true;
        },
        hideLoginHandler: (state) => {
            state.goToLogin = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginHandler.fulfilled, (state, action) => {
                state.user = action.payload;
                state.error = undefined;
                state.isLoggedIn = true;
                const tokenPayload = {
                    email: state.user.email,
                    mobile: state.user.mobile,
                    firstName: state.user.firstName,
                };
                state.accessToken = tokenPayload;
                state.expirationTime = setTokenHours(
                    HOURS_TO_SAVE_USERS_DATA
                ).toString();
                setUserToken(tokenPayload);
            })
            .addCase(loginHandler.rejected, (state, action) => {
                state.message = "Hiba a bejelentkezés során.";
                state.error = action.error.message;
            })
            .addCase(initializeAuthState.fulfilled, (state, action) => {
                const {
                    user,
                    isLoggedIn,
                    accessToken,
                    expirationTime,
                    error,
                    message,
                    isLoading,
                } = action.payload;
                state.user = user;
                state.isLoggedIn = isLoggedIn;
                state.accessToken = accessToken;
                state.expirationTime = expirationTime;
                state.error = error;
                state.message = message;
                state.isLoading = isLoading;
            })
            .addCase(initializeAuthState.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(modifyUserData.pending, (state) => {
                state.isLoading = true;
                state.message = "A módosítások rögzítése folyamatban van...";
            })
            .addCase(modifyUserData.fulfilled, (state, action) => {
                state.user!.firstName = action.payload!.firstName;
                state.user!.lastName = action.payload!.lastName;
                state.user!.mobile = action.payload!.mobile;
                state.user!.postalCode = action.payload!.postalCode;
                state.user!.city = action.payload!.city;
                state.user!.street = action.payload!.street;
                state.message = "A módosításokat rögzítettük!";
                state.isLoading = false;

                // Important! The token contains both the name and the number so it needs to recreate
                // it after modification.
                setUserToken({
                    email: action.payload!.email,
                    mobile: action.payload!.mobile,
                    firstName: action.payload!.firstName,
                });
            })
            .addCase(modifyUserData.rejected, (state, action) => {
                state.isLoading = false;
                state.message = "A módosítás rögzítése nem sikerült!";
                state.error = action.error.message;
            })
            .addCase(modifyUserPassword.pending, (state) => {
                state.isLoading = true;
                state.message = "A módosítások rögzítése folyamatban van...";
            })
            .addCase(modifyUserPassword.fulfilled, (state, action) => {
                state.message = "A módosításokat rögzítettük!";
                state.isLoading = false;
            })
            .addCase(modifyUserPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.message = "A módosítás rögzítése nem sikerült!";
                state.error = action.error.message;
            });
    },
});

export const authActions = authSlice.actions;
export default authSlice;
