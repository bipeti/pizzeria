import classes from "./Footer.module.css";

export default function Footer() {
    return (
        <div className={classes.footer}>
            <div className={classes.inner}>
                <div className={classes.informations}>
                    <span className={classes["img-container"]}>
                        <img alt="place" src="./footer/place.png" />
                    </span>
                    <p>2842 Ludasmeggyes, Március 15. tér 40.</p>
                </div>
                <div className={classes.informations}>
                    <span className={classes["img-container"]}>
                        <img alt="phone" src="./footer/phone.png" />
                    </span>
                    <p>+36 12 345 6789</p>
                </div>
                <div className={classes.informations}>
                    <span className={classes["img-container"]}>
                        <img alt="mail" src="./footer/mail.png" />
                    </span>
                    <p>pizzeria@ludasmeggyes.hu</p>
                </div>
                <div className={classes.informations}>
                    <span className={classes["img-container"]}>
                        <img alt="open" src="./footer/open.png" />
                    </span>
                    <p>H-V 11:00 - 20:00 </p>
                </div>
            </div>
        </div>
    );
}
