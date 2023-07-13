import { useState, useEffect } from "react";
import classes from "../User/User.module.css";
import NewPassword from "../User/NewPassword";
import UserModal from "../User/UserModal";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthState } from "../../store/auth-slice";

type HomePageProps = {
    isPasswordReset: boolean;
};

export default function HomePage({ isPasswordReset }: HomePageProps) {
    const [showModifyPassword, setShowModifyPassword] =
        useState(isPasswordReset);
    const location = useLocation();
    const isLoggedIn = useSelector(
        (state: { auth: AuthState }) => state.auth.isLoggedIn
    );

    useEffect(() => {
        if (isPasswordReset) {
            const urlParams = new URLSearchParams(location.search);
            const token = urlParams.get("token");
            if (!isLoggedIn && !token) {
                setShowModifyPassword(false);
            }
        }
    }, [isPasswordReset, location.search, isLoggedIn]);

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
