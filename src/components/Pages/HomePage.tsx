import { useState, useEffect } from "react";
import classes from "../User/User.module.css";
import NewPassword from "../User/NewPassword";
import UserModal from "../User/UserModal";
import { useLocation } from "react-router-dom";
import { getUserToken } from "../utils/token";

type HomePageProps = {
    isPasswordReset: boolean;
};

export default function HomePage({ isPasswordReset }: HomePageProps) {
    const [showModifyPassword, setShowModifyPassword] =
        useState(isPasswordReset);
    const location = useLocation();

    useEffect(() => {
        if (isPasswordReset) {
            let userToken = getUserToken();
            const urlParams = new URLSearchParams(location.search);
            const token = urlParams.get("token");
            if (!userToken && !token) {
                setShowModifyPassword(false);
            }
        }
    }, [isPasswordReset, location.search]);

    const hideModalHandler = () => {
        setShowModifyPassword(false);
    };

    return (
        <>
            <h1>My Home Page</h1>
            {showModifyPassword && (
                <UserModal onClose={hideModalHandler}>
                    <div className={classes.content}>
                        <div
                            id="passwordModify"
                            // className={classes.tabcontent2}
                        >
                            <NewPassword />
                        </div>
                    </div>
                </UserModal>
            )}
        </>
    );
}
