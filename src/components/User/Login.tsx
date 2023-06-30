import Modal from "../UI/Modal";
import classes from "./Login.module.css";

const Login = ({ onClose }: { onClose: () => void }) => {
    return (
        <Modal onClose={onClose}>
            <div className={classes.outer}>
                <div className={classes.pizza}>
                    <img src="pizza.jpg" alt="pizza" />
                </div>
                <div className={classes.content}>
                    <p className={classes.title}>Belépés</p>
                    <p className={classes.information}>
                        A rendeléshez bejelentkezés szükséges. Ha még nem vagy
                        tag, kérjük regisztrálj!
                    </p>
                    <form action="" className={classes.form}>
                        <input type="email" className={classes.input}></input>
                        <input
                            type="password"
                            className={classes.input}
                        ></input>
                        <a href="/">Elfelejtett jelszó</a>
                        <div className={classes.buttons}>
                            <input type="submit" value="Belépés"></input>
                            <button>Regisztráció</button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default Login;
