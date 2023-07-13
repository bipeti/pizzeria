// This file is a collection point for those functions, which don't belong to states. It is easier to manage their
// different states uniformly. (pending, fulfilled, rejected).

import {
    push,
    ref,
    set,
    equalTo,
    get,
    limitToFirst,
    orderByChild,
    query,
    remove,
} from "@firebase/database";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../components/utils/firebase";
import emailjs from "@emailjs/browser";
import {
    DB_PATH,
    MY_LOSTPASSWORD_TEMPLATE_ID,
    MY_PUBLIC_KEY,
    MY_REGISTRATION_TEMPLATE_ID,
    MY_SERVICE_ID,
} from "../components/utils/myConsts";
import { getUserWithEmail } from "./auth-slice";
import bcrypt from "bcryptjs";

export interface UserData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    mobile: string;
    postalCode: string;
    city: string;
    street: string;
    registrationDate: Date;
}

export interface PendingUserData extends UserData {
    activationCode: string;
}

export interface GeneralState {
    error: undefined | string;
    message: undefined | string;
    isLoading: boolean;
}

const initialState: GeneralState = {
    error: undefined,
    message: undefined,
    isLoading: false,
};

type emailSendProps = {
    firstName: string;
    email: string;
    token: string;
};

let salt = bcrypt.genSaltSync(10);

export const emailSend = async (
    templateid: string,
    templateParams: emailSendProps
) => {
    try {
        const response = await emailjs.send(
            MY_SERVICE_ID,
            templateid,
            templateParams,
            MY_PUBLIC_KEY
        );
        return response;
    } catch (error) {
        throw error;
    }
};

export const fetchPendingUserData = async () => {
    try {
        const response = await fetch(DB_PATH + "/pendingusers.json");
        if (!response.ok) {
            throw new Error("Database read fetching error");
        }
        const data: Record<string, PendingUserData> = await response.json();
        if (!data) {
            return [];
        }
        const loadedPendingUsers: { key: string; data: PendingUserData }[] =
            Object.entries(data).map(([key, data]) => ({ key, data }));
        return loadedPendingUsers;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const sendPendingUserData = async ({
    pendingUserData,
    activationCode,
}: {
    pendingUserData: UserData;
    activationCode: string;
}) => {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            mobile,
            postalCode,
            city,
            street,
        } = pendingUserData;

        const response = await fetch(DB_PATH + "/pendingusers.json", {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
                firstName,
                lastName,
                mobile,
                postalCode,
                city,
                street,
                registrationDate: Date(),
                activationCode: activationCode,
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error("Database writing error");
        }
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const removeUserFromPending = async (key: string) => {
    try {
        const url = DB_PATH + `/pendingusers/${key}.json`;
        const response = await fetch(url, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Database deleting error");
        }
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const fetchPendingUsers = async (email: string, token: string) => {
    try {
        let foundEntry = undefined;
        const loadedPendingUsers = await fetchPendingUserData();
        for (const entry of loadedPendingUsers) {
            if (entry.data.email === email) {
                foundEntry = entry;
            }
        }
        if (foundEntry?.key === undefined) {
            throw new Error(
                // email is not in pending
                "Kérem, hogy a regisztrációt a fenti menüben kezdeményezze az adatai megadásával!"
            );
        }
        if (foundEntry.data.activationCode !== token) {
            // email is ok, token is not ok
            throw new Error(
                "Érvénytelen token! Kérem, hogy kattintson az e-mail-ben kapott linkre!"
            );
        }
        return foundEntry;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const sendUserData = async ({ userData }: { userData: UserData }) => {
    try {
        const response = await fetch(DB_PATH + "/users.json", {
            method: "POST",
            body: JSON.stringify({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
                lastName: userData.lastName,
                mobile: userData.mobile,
                postalCode: userData.postalCode,
                city: userData.city,
                street: userData.street,
                registrationDate: userData.registrationDate,
            }),
        });
        if (!response.ok) {
            throw new Error("Database writing error");
        }
        return response;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const getLostPasswordData = async (token: string) => {
    try {
        const queryRef = query(
            ref(db, "lostPasswords"),
            orderByChild("token"),
            equalTo(token),
            limitToFirst(1)
        );

        const snapshot = await get(queryRef);

        if (snapshot.exists()) {
            const lostPasswordData = snapshot.val();
            const email: string =
                lostPasswordData[Object.keys(lostPasswordData)[0]].email;
            console.log("Email getting is successful!");
            return email;
        } else {
            console.error("No matching record found for the given token.");
            return null;
        }
    } catch (error) {
        console.error("Error getting lost password's data:", error);
        return null;
    }
};

export const removeLostPasswordData = async (token: string) => {
    try {
        const queryRef = query(
            ref(db, "lostPasswords"),
            orderByChild("token"),
            equalTo(token),
            limitToFirst(1)
        );

        const snapshot = await get(queryRef);

        if (snapshot.exists()) {
            const lostPasswordKey = Object.keys(snapshot.val())[0];
            await remove(ref(db, `lostPasswords/${lostPasswordKey}`));
            console.log("Lost password data removed successfully!");
            return true;
        } else {
            console.error("No matching record found for the given token.");
            return false;
        }
    } catch (error) {
        console.error("Error removing lost password data:", error);
        return false;
    }
};

export const sendLostPasswordData = createAsyncThunk(
    "general/sendLostPasswordData",
    async ({
        email,
        token,
        firstName,
    }: {
        email: string;
        token: string;
        firstName: string;
    }) => {
        try {
            const lostPasswordsRef = ref(db, "lostPasswords");
            const newLostPasswordRef = push(lostPasswordsRef);

            const newLostPasswordData = {
                email,
                token,
            };

            await set(newLostPasswordRef, newLostPasswordData);
        } catch (error) {
            throw new Error(
                "Hiba történt az adatok mentése közben: " +
                    (error as Error).message
            );
        }
        try {
            const templateParams = {
                // the template contains the next activation structure:
                // http://localhost:3000/passwordReset?token=4d711b3c-ac83-4ee4-81e1-1f1da6133f6b
                firstName,
                email,
                token,
            };
            await emailSend(MY_LOSTPASSWORD_TEMPLATE_ID, templateParams);
        } catch (error) {
            throw new Error(
                "Hiba történt az e-mail küldése közben: " +
                    (error as Error).message
            );
        }
    }
);

export const createNewUser = createAsyncThunk(
    "general/createNewUser",
    async ({ userData }: { userData: UserData }) => {
        try {
            const user = await getUserWithEmail(userData.email);
            if (user) {
                throw new Error("Ez az e-mail már szerepel az adatbázisban!");
            }
        } catch (error) {
            throw new Error((error as Error).message);
        }
        try {
            const loadedPendingUsers = await fetchPendingUserData();
            let entryInPendingUsers:
                | {
                      key: string;
                      data: PendingUserData;
                  }
                | undefined = undefined;
            for (const entry of loadedPendingUsers) {
                if (entry.data.email === userData.email) {
                    entryInPendingUsers = entry;
                }
            }
            if (entryInPendingUsers?.key !== undefined) {
                // if this e-mail exists already in the pending database,
                // remove that
                removeUserFromPending(entryInPendingUsers.key);
            }
        } catch (error) {
            throw new Error((error as Error).message);
        }

        const activationCode = crypto.randomUUID();
        let hashedPassword = bcrypt.hashSync(userData.password, salt);
        const modifiedUserData = { ...userData };
        modifiedUserData.password = hashedPassword;

        try {
            await sendPendingUserData({
                pendingUserData: modifiedUserData,
                activationCode,
            });
        } catch {
            throw new Error("Adatbázisba rögzítés sikertelen.");
        }

        let templateParams = {
            // the template contains the next activation structure:
            // http://localhost:3000/activation?email=test@gmail.com&token=de26d857-1cfa-4752-b63f-52dd216e4f05

            firstName: userData.firstName,
            email: userData.email,
            token: activationCode,
        };
        try {
            await emailSend(MY_REGISTRATION_TEMPLATE_ID, templateParams);
        } catch {
            throw new Error("E-mail küldés sikertelen!");
        }
    }
);

export const activateNewUser = createAsyncThunk(
    "general/activateNewUser",
    async ({ email, token }: { email: string; token: string }) => {
        try {
            const userWithEmail = await fetchPendingUsers(email, token);
            await sendUserData({
                userData: userWithEmail.data,
            });
            await removeUserFromPending(userWithEmail.key);
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
);

const generalSlice = createSlice({
    name: "general",
    initialState,
    reducers: {
        clearMessages: (state) => {
            return { isLoading: false, error: undefined, message: undefined };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendLostPasswordData.pending, (state) => {
                state.isLoading = true;
                state.message =
                    "Az új jelszó beállításához szükséges token rögzítése folyamatban van...";
            })
            .addCase(sendLostPasswordData.fulfilled, (state) => {
                state.message =
                    "Az új jelszó beállításához szükséges e-mailt elküldtük, kérjük ellenőrizze a postafiókját!";
                state.error = undefined;
                state.isLoading = false;
            })
            .addCase(sendLostPasswordData.rejected, (state, action) => {
                state.message =
                    "Az új jelszó beállításához szükséges folyamat sikertelen volt.";
                state.error = action.error.message;
                state.isLoading = false;
            })
            .addCase(createNewUser.pending, (state) => {
                state.isLoading = true;
                state.message =
                    "Az új felhasználó rögzítése folyamatban van...";
            })
            .addCase(createNewUser.fulfilled, (state) => {
                state.message =
                    "A felhasználó aktiválásához szükséges e-mailt elküldtük, kérjük ellenőrizze a postafiókját!";
                state.error = undefined;
                state.isLoading = false;
            })
            .addCase(createNewUser.rejected, (state, action) => {
                state.message =
                    "Az új felhasználó rögzítése során hiba lépett fel!";
                state.error = action.error.message;
                state.isLoading = false;
            })
            .addCase(activateNewUser.pending, (state) => {
                state.isLoading = true;
                state.message =
                    "Az új felhasználó aktiválása folyamatban van...";
            })
            .addCase(activateNewUser.fulfilled, (state) => {
                state.message =
                    "A felhasználó aktiválása sikerült! A fenti menüben tud bejelentkezni.";
                state.error = undefined;
                state.isLoading = false;
            })
            .addCase(activateNewUser.rejected, (state, action) => {
                state.message =
                    "A felhasználó aktiválása során hiba lépett fel!";
                state.error = action.error.message;
                state.isLoading = false;
            });
    },
});

export const generalActions = generalSlice.actions;
export default generalSlice;
