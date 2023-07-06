import { DB_PATH } from "../components/utils/myConsts";
import { Items } from "./cart-slice";
import { UserData } from "./user-actions";

export interface PartialUserData
    extends Omit<UserData, "registrationDate" | "password"> {}
type OrderData = {
    orderedItems: Items[];
    packingFee: number;
    totalPrice: number;
    userData: PartialUserData;
};

export const sendOrderData = async ({
    orderedItems,
    packingFee,
    totalPrice,
    userData,
}: OrderData) => {
    try {
        const response = await fetch(DB_PATH + "/orders.json", {
            method: "POST",
            body: JSON.stringify({
                orderedItems: orderedItems,
                packingFee: packingFee,
                totalPrice: totalPrice,
                date: Date(),
                userData: userData,
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
