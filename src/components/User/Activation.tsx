import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    PendingUserData,
    fetchPendingUserData,
    removeUserFromPending,
    sendUserData,
} from "../../store/user-actions";

let isInitial = true;
const Activation: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        if (!isInitial) {
            return;
        }
        isInitial = false;
        const urlParams = new URLSearchParams(location.search);
        const email = urlParams.get("email");
        const token = urlParams.get("token");

        const fetchPendingUsers = async (): Promise<
            { data: PendingUserData; key: string } | undefined
        > => {
            const loadedPendingUsers = await fetchPendingUserData();
            let foundEntry = undefined;
            console.log(loadedPendingUsers);
            for (const entry of loadedPendingUsers) {
                if (entry.data.email === email) {
                    foundEntry = entry;
                }
            }
            if (foundEntry?.key === undefined) {
                console.log(
                    "Pending adatbázis üres. Kérem, hogy a regisztrációt a fenti menüben kezdeményezze az adatai megadásával!"
                );
                return undefined;
            }
            if (foundEntry.data.activationCode !== token) {
                console.log(
                    "Érvénytelen token! Kérem, hogy kattintson az e-mail-ben kapott linkre!"
                );
                return undefined;
            }
            console.log("Érvényes token!");
            return foundEntry;
        };

        const processUser = async () => {
            const userWithEmail = await fetchPendingUsers();
            console.log(userWithEmail);
            if (userWithEmail !== undefined) {
                try {
                    const sendDataSuccess = await sendUserData({
                        userData: userWithEmail.data,
                    });
                    if (!sendDataSuccess) {
                        console.log("Adatbázisba írás sikertelen.");
                        return;
                    }
                    const removeDataSuccess = await removeUserFromPending(
                        userWithEmail.key
                    );
                    if (!removeDataSuccess) {
                        console.log("Pendingből törlés sikertelen.");
                    }

                    console.log("User processed successfully");
                } catch (error) {
                    console.error("Error processing user:", error);
                }
            }
        };

        processUser();
    }, [location.search]);

    return <div>Activation Page</div>;
};

export default Activation;
