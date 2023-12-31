import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import classes from "./MainNavigation.module.css";
import User from "../User/User";
import { useSelector } from "react-redux";
import { AuthState, authActions } from "../../store/auth-slice";
import { useDispatch } from "react-redux";

const MainNavigation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(
        (state: { auth: AuthState }) => state.auth.isLoggedIn
    );
    const firstName = useSelector(
        (state: { auth: AuthState }) => state.auth.user?.firstName
    );
    const goToLogin = useSelector(
        (state: { auth: AuthState }) => state.auth.goToLogin
    );

    const [showLoginModal, setShowLoginModal] = useState(false);
    const hideModalHandler = () => {
        setShowLoginModal(false);
        dispatch(authActions.hideLoginHandler());
    };

    const showLoginModalHandler = () => {
        setShowLoginModal(true);
    };

    const logoutHandler = () => {
        dispatch(authActions.logout());
    };

    const gotoHome = () => {
        navigate("/");
    };

    return (
        <>
            {(showLoginModal || goToLogin) && (
                <User onClose={hideModalHandler} />
            )}

            <header className={classes.header}>
                <nav>
                    <img
                        alt="logo"
                        src="logo.png"
                        className={classes.logo}
                        onClick={gotoHome}
                    />

                    <ul className={classes.list}>
                        <li>
                            <NavLink
                                to=""
                                className={({ isActive }) =>
                                    isActive ? classes.active : ""
                                }
                            >
                                Főoldal
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="foods"
                                className={({ isActive }) =>
                                    isActive ? classes.active : ""
                                }
                            >
                                Ételeink
                            </NavLink>
                        </li>
                        {/* <li>
                            <NavLink
                                to="galery"
                                className={({ isActive }) =>
                                    isActive ? classes.active : ""
                                }
                            >
                                Galéria
                            </NavLink>
                        </li> */}
                        {/* <li>
                            <NavLink
                                to="contact"
                                className={({ isActive }) =>
                                    isActive ? classes.active : ""
                                }
                            >
                                Kapcsolat
                            </NavLink>
                        </li> */}
                        <li>
                            <NavLink
                                to="description"
                                className={({ isActive }) =>
                                    isActive ? classes.active : ""
                                }
                            >
                                Leírás
                            </NavLink>
                        </li>
                        <li>
                            <span
                                className={classes["img-container"]}
                                onClick={showLoginModalHandler}
                            >
                                <img
                                    alt="login"
                                    src="profile.png"
                                    onClick={showLoginModalHandler}
                                    title={
                                        isLoggedIn
                                            ? `Fiókom (${firstName})`
                                            : "Belépés / Regisztráció"
                                    }
                                />
                            </span>
                        </li>
                        {isLoggedIn && (
                            <li>
                                <span
                                    className={`${classes["img-container"]} ${classes["logout-image"]}`}
                                    onClick={logoutHandler}
                                >
                                    <img
                                        alt="logout"
                                        src="logout.png"
                                        onClick={logoutHandler}
                                    />
                                </span>
                            </li>
                        )}
                    </ul>
                </nav>
            </header>
        </>
    );
};

export default MainNavigation;
