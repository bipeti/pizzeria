import { NavLink } from "react-router-dom";
import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
    return (
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
                </ul>
            </nav>
        </header>
    );
};

export default MainNavigation;
