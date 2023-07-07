import { useEffect } from "react";
import Modal from "../UI/Modal";
import classes from "./User.module.css";

import Login from "./Login";
import Registration from "./Registration";

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
        const defaultTabLink = document.querySelector("#loginbutton");
        if (defaultTabLink) {
            defaultTabLink.classList.add(classes.active);
        }
    }
}

const User = ({ onClose }: { onClose: () => void }) => {
    useEffect(() => {
        openMode(null, "login");
    }, []);

    return (
        <Modal onClose={onClose}>
            <div className={classes.outer}>
                <div className={classes.pizza}>
                    <img src="pizza.jpg" alt="pizza" />
                </div>
                <div className={classes.content}>
                    <div className={classes.tab}>
                        <button
                            className={`${classes.tablinks} ${classes.active}`}
                            onClick={(e) => openMode(e, "login")}
                            id="loginbutton"
                        >
                            Belépés
                        </button>
                        <button
                            className={classes.tablinks}
                            onClick={(e) => openMode(e, "registration")}
                        >
                            Regisztráció
                        </button>
                    </div>
                    {/* the next div wrapper is better to stay here, because the openMode function needs its
                        className, etc.*/}
                    <div id="login" className={classes.tabcontent}>
                        <Login onClose={onClose} />
                    </div>
                    <div id="registration" className={classes.tabcontent}>
                        <Registration />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default User;
