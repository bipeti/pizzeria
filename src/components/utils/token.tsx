export function getTokenDuration() {
    const storedExpirationDate = localStorage.getItem("cart-expiration");
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
