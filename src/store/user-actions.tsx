import { DB_PATH } from "../components/utils/myConsts";
import { getUserToken } from "../components/utils/token";

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
        const response = await fetch(DB_PATH + "/pendingusers.json", {
            method: "POST",
            body: JSON.stringify({
                email: pendingUserData.email,
                password: pendingUserData.password,
                firstName: pendingUserData.firstName,
                lastName: pendingUserData.lastName,
                mobile: pendingUserData.mobile,
                postalCode: pendingUserData.postalCode,
                city: pendingUserData.city,
                street: pendingUserData.street,
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
