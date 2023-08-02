import { useState, useEffect } from "react";
import classes from "./Pages.module.css";
import classesUserModal from "../User/User.module.css";
import NewPassword from "../User/NewPassword";
import UserModal from "../User/UserModal";
import { useLocation, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

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
        navigate("/");
    };

    return (
        <>
            <h1>Ludas Pizzéria</h1>
            <h2>Üdvözlünk megújult honlapunkon!</h2>
            <div className={classes.information}>
                <p>
                    Ludas Pizzéria huszonhárom évvel ezelőtt nyílt meg
                    Ludasmeggyesen és rövid idő alatt a környék kedvenc
                    éttermévé vált a barátságos kiszolgálásnak és a finom
                    ételeknek köszönhetően. A fatüzeléses kemencében sülő pizzák
                    látványa és ízvilága a környező településeken élők számára
                    is népszerűvé tette az éttermünket. Új ötletekkel és
                    hagyományos ételekkel rendszeresen frissítjük a
                    kínálatunkat, miközben az interneten rendelők számára
                    változatos akciókkal tesszük vonzóbbá a rendelést.
                </p>
            </div>
            {showModifyPassword && (
                <UserModal onClose={hideModalHandler}>
                    <div className={classesUserModal.content}>
                        <div id="passwordModify">
                            <NewPassword />
                        </div>
                    </div>
                </UserModal>
            )}
        </>
    );
}
