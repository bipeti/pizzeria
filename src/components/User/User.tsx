import { useEffect, useState } from "react";
import Modal from "../UI/Modal";
import classes from "./User.module.css";

/* If the user is logged in, his profil is visible, else the login/registration page. */

import Login from "./Login";
import Registration from "./Registration";
import { getUserToken } from "../utils/token";
import { getUserDataByToken } from "../../store/user-actions";
import NewPassword from "./NewPassword";

function openMode(
    evt: React.MouseEvent<HTMLButtonElement> | null,
    mode: string
) {
    const tabcontent = document.getElementsByClassName(
        classes.tabcontent
    ) as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    const tablinks = document.getElementsByClassName(
        classes.tablinks
    ) as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove(classes.active);
    }

    const modeElement = document.getElementById(mode);
    if (modeElement) {
        modeElement.style.display = "block";
    }
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add(classes.active);
    } else {
        const defaultTabLink = document.querySelector("#leftbutton");
        if (defaultTabLink) {
            defaultTabLink.classList.add(classes.active);
        }
    }
}

const User = ({ onClose }: { onClose: () => void }) => {
    const [tabButtons, setTabButtons] = useState<JSX.Element | null>(null);
    const [tabContent, setTabContent] = useState<JSX.Element | null>(null);
    const [defaultOpenMode, setDefaultOpenMode] = useState<string>("login");

    async function filledUserData() {
        const userData = await getUserDataByToken();

        if (!userData) {
            /* It means, the token was valid, but this user can't found in the database. 
            at this point it can just because of sg database error, or external database 
            operation. */
            console.log("Kérem, jelentkezzen be újra!");
            return;
        }
        console.log(userData);
        setDefaultOpenMode("profileData");
        setTabButtons(
            <>
                <button
                    className={`${classes.tablinks} ${classes.active}`}
                    onClick={(e) => openMode(e, "profileData")}
                    id="leftbutton"
                >
                    Saját adatok
                </button>
                <button
                    className={classes.tablinks}
                    onClick={(e) => openMode(e, "passwordModify")}
                >
                    Jelszó módosítás
                </button>
                <button
                    className={classes.tablinks}
                    onClick={(e) => openMode(e, "orders")}
                >
                    Rendelések
                </button>
            </>
        );
        setTabContent(
            <>
                <div id="profileData" className={classes.tabcontent}>
                    <Registration userData={userData} />
                </div>
                <div id="passwordModify" className={classes.tabcontent}>
                    <NewPassword />
                </div>
                <div id="orders" className={classes.tabcontent}>
                    <div>Fejlesztés alatt...</div>
                </div>
            </>
        );
    }

    useEffect(() => {
        if (!getUserToken()) {
            setTabButtons(
                <>
                    <button
                        className={`${classes.tablinks} ${classes.active}`}
                        onClick={(e) => openMode(e, "login")}
                        id="leftbutton"
                    >
                        Belépés
                    </button>
                    <button
                        className={classes.tablinks}
                        onClick={(e) => openMode(e, "registration")}
                    >
                        Regisztráció
                    </button>
                </>
            );
            setTabContent(
                <>
                    <div id="login" className={classes.tabcontent}>
                        <Login onClose={onClose} />
                    </div>
                    <div id="registration" className={classes.tabcontent}>
                        <Registration />
                    </div>
                </>
            );
        } else {
            filledUserData();
        }
    }, [onClose]);

    useEffect(() => {
        openMode(null, defaultOpenMode);
    }, [defaultOpenMode]);

    return (
        <Modal onClose={onClose}>
            <div className={classes.outer}>
                <div className={classes.pizza}>
                    <img src="pizza.jpg" alt="pizza" />
                </div>
                <div className={classes.content}>
                    <div className={classes.tab}>{tabButtons}</div>
                    {/* the next div wrapper is better to stay here and don't move to the inner Component, 
                        due to the openMode function needs its className, etc.*/}
                    {tabContent}
                </div>
            </div>
        </Modal>
    );
};

export default User;
