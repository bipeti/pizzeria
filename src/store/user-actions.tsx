import { DB_PATH } from "../components/utils/myConsts";
import { getUserToken, setUserToken } from "../components/utils/token";
import { db } from "../components/utils/firebase";
import {
    equalTo,
    get,
    limitToFirst,
    orderByChild,
    push,
    query,
    ref,
    remove,
    set,
    update,
} from "@firebase/database";

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

export const fetchPendingUserData = async () => {
    try {
        const response = await fetch(DB_PATH + "/pendingusers.json");
        if (!response.ok) {
            throw new Error("Database read fetching error");
        }
        const data: Record<string, PendingUserData> = await response.json();
        const loadedPendingUsers: { key: string; data: PendingUserData }[] =
            Object.entries(data).map(([key, data]) => ({ key, data }));
        return loadedPendingUsers;
    } catch (error) {
        console.log(error);
        return [];
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
        console.log(error);
        return null;
    }
};

export const modifyUserData = async ({ userData }: { userData: UserData }) => {
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
            console.log("User data modified successfully!");
            // Important! The token contains both the name and the number so it needs to recreate
            // it after modification.
            setUserToken({
                email: email,
                mobile: userData.mobile,
                firstName: userData.firstName,
            });
            return true;
        } else {
            console.error("No matching record found for the given email.");
            return null;
        }
    } catch (error) {
        console.error("Error modifying user data:", error);
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
        console.log(error);
        return [];
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

export const userWithEmail = async (email: string) => {
    const loadedUsers = await fetchUserData();
    const userWithEmail = loadedUsers.find((user) => user.email === email);
    return userWithEmail;
};

export const getUserDataByToken = async () => {
    const userToken = getUserToken();
    if (!userToken) {
        return false;
    }
    const user = await userWithEmail(userToken.email);
    if (!user) {
        return false;
    }
    if (user.mobile !== userToken.mobile) {
        return false;
    }
    return user;
};

export const modifyUserPassword = async (email: string, password: string) => {
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
            console.log("User data modified successfully!");
            return true;
        } else {
            console.error("No matching record found for the given email.");
            return null;
        }
    } catch (error) {
        console.error("Error modifying user data:", error);
        return null;
    }
};

export const sendLostPasswordData = async (email: string, token: string) => {
    try {
        const lostPasswordsRef = ref(db, "lostPasswords");
        const newLostPasswordRef = push(lostPasswordsRef);

        const newLostPasswordData = {
            email,
            token,
        };

        await set(newLostPasswordRef, newLostPasswordData);
        console.log("New lost password record added successfully!");
        return true;
    } catch (error) {
        console.error("Error adding new lost password record:", error);
        return null;
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
