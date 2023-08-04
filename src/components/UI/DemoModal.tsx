import Modal from "./Modal";
import classes from "./DemoModal.module.css";

type DemoModalProps = {
    onClose: () => void;
};

const DemoModal = ({ onClose }: DemoModalProps) => {
    const nothing = () => {
        return;
    };

    return (
        <Modal onClose={nothing} hideCloseIcon>
            <h2 className={classes.title}>Ludas Pizzéria DEMO verzió</h2>
            <div className={classes.content}>
                <p>
                    Ez az oldal kizárólag demonstrációs célokat szolgál!{" "}
                    <u>
                        Az oldalon található valamennyi adat és információ
                        fiktív!
                    </u>
                </p>
                <p>
                    A megrendelés kipróbálásához belépés szükséges, ehhez
                    használja a <u>Leírás menüpontban</u> található útmutatót!
                </p>
                <p>
                    A regisztráció is kipróbálható és működőképes, ennek során
                    kérem, csak fiktív adatokat használjon, ne adja meg saját
                    nevét, címét, vagy telefonszámát! A regisztráció során saját
                    e-mail címét szükséges használnia, mert oda kerül küldésre
                    az aktiváláshoz szükséges token.
                </p>
                <p>
                    A regisztráció során megadott adatok és az e-mail címe nem
                    kerülnek egyéb módon felhasználásra, vagy átadásra harmadik
                    félnek.
                </p>
                <p>Az oldalon a továbbiakban a tegező formát használjuk.</p>
            </div>
            <div className={classes.button}>
                <button className="globalbuttons" onClick={onClose}>
                    Elfogadom
                </button>
            </div>
        </Modal>
    );
};

export default DemoModal;
