import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import classes from "./MainNavigation.module.css";
import User from "../User/User";
import { useSelector } from "react-redux";
import { UserState, userActions } from "../../store/user-slice";
import { getUserToken, removeUserTokens } from "../utils/token";
import { useDispatch } from "react-redux";

const MainNavigation = () => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(
        (state: { user: UserState }) => state.user.isLoggedIn
    );
    const [firstName, setFirstName] = useState<string | null>();

    const [showLoginModal, setShowLoginModal] = useState(false);
    const hideModalHandler = () => {
        setShowLoginModal(false);
    };

    const showLoginModalHandler = () => {
        setShowLoginModal(true);
    };

    useEffect(() => {
        if (isLoggedIn) {
            const userToken = getUserToken();
            if (userToken) {
                setFirstName(userToken.firstName);
            }
        }
    }, [isLoggedIn]);

    const logoutHandler = () => {
        removeUserTokens();
        dispatch(userActions.logout());
    };

    return (
        <>
            {showLoginModal && <User onClose={hideModalHandler} />}

            <header className={classes.header}>
                <nav>
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
                        <li>
                            <NavLink
                                to="galery"
                                className={({ isActive }) =>
                                    isActive ? classes.active : ""
                                }
                            >
                                Galéria
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="contact"
                                className={({ isActive }) =>
                                    isActive ? classes.active : ""
                                }
                            >
                                Kapcsolat
                            </NavLink>
                        </li>
                        <li>
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
                        </li>
                        {isLoggedIn && (
                            <li>
                                <img
                                    alt="logout"
                                    src="logout.png"
                                    onClick={logoutHandler}
                                />
                            </li>
                        )}
                    </ul>
                </nav>
            </header>
        </>
    );
};

export default MainNavigation;
