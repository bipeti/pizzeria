import { HOURS_TO_SAVE_USERS_DATA } from "./myConsts";

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

type UserTokenPayload = {
    email: string;
    mobile: string;
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
