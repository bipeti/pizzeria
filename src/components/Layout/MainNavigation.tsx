import { NavLink } from "react-router-dom";
import { useState } from "react";
import classes from "./MainNavigation.module.css";
import Login from "../User/Login";

const MainNavigation = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const hideModalHandler = () => {
        setShowLoginModal(false);
    };

    const showModalHandler = () => {
        setShowLoginModal(true);
    };

    return (
        <>
            {showLoginModal && <Login onClose={hideModalHandler} />}

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
                                alt="profil"
                                src="profile.png"
                                onClick={showModalHandler}
                            />
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    );
};

export default MainNavigation;
