import { useEffect } from "react";
import Modal from "../UI/Modal";
import classes from "./Login.module.css";
import { useForm, Resolver } from "react-hook-form";
import {
    PendingUserData,
    UserData,
    fetchPendingUserData,
    fetchUserData,
    removeUserFromPending,
    sendPendingUserData,
} from "../../store/user-actions";

interface FormValues extends UserData {
    dataProtection: boolean;
}

const resolver: Resolver<FormValues> = async (values) => {
    const errors: Partial<
        Record<keyof FormValues, { type: string; message: string }>
    > = {};

    if (!values.email) {
        errors.email = {
            type: "required",
            message: "Az E-mail megadása kötelező",
        };
    } else if (!values.email.match(/^\S+@\S+$/i)) {
        errors.email = {
            type: "pattern",
            message: "Érvénytelen e-mail cím formátum",
        };
    }

    if (!values.password) {
        errors.password = {
            type: "required",
            message: "Jelszó megadása kötelező",
        };
    } else if (!values.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
        errors.password = {
            type: "pattern",
            message:
                "A jelszónak tartalmaznia kell legalább egy nagybetűt, egy kisbetűt és egy számot",
        };
    }

    if (!values.firstName) {
        errors.firstName = {
            type: "required",
            message: "Név megadása kötelező",
        };
    }

    if (!values.lastName) {
        errors.lastName = {
            type: "required",
            message: "Név megadása kötelező",
        };
    }

    if (!values.mobile) {
        errors.mobile = {
            type: "required",
            message: "Telefonszám megadása kötelező",
        };
    } else if (values.mobile.length < 10) {
        errors.mobile = {
            type: "range",
            message: "A telefonszám legalább 10 karakterből áll",
        };
    }

    if (!values.postalCode) {
        errors.postalCode = {
            type: "required",
            message: "Irányítószám megadása kötelező",
        };
    } else if (!values.postalCode.match(/^\d{4}$/)) {
        errors.postalCode = {
            type: "pattern",
            message: "Az irányítószám négy számjegyből állhat",
        };
    }

    if (!values.city) {
        errors.city = {
            type: "required",
            message: "Település megadása kötelező",
        };
    }

    if (!values.street) {
        errors.street = {
            type: "required",
            message: "Közterület és házszám megadása kötelező",
        };
    }

    if (!values.dataProtection) {
        errors.dataProtection = {
            type: "required",
            message: "Az adatvédelmi nyilatkozat elfogadása kötelező.",
        };
    }

    return {
        values,
        errors: Object.keys(errors).length === 0 ? {} : errors,
    };
};

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

const Login = ({ onClose }: { onClose: () => void }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({ resolver });

    const newUserHandler = async (userData: FormValues) => {
        const loadedUsers = await fetchUserData();
        console.log(loadedUsers);

        const emailExists = loadedUsers.find(
            (user) => user.email === userData.email
        );

        if (emailExists) {
            console.log("Email already exists in the database");
            return;
        }
        const loadedPendingUsers = await fetchPendingUserData();
        console.log(loadedPendingUsers);
        let myEntry:
            | {
                  key: string;
                  data: PendingUserData;
              }
            | undefined = undefined;
        for (const entry of loadedPendingUsers) {
            if (entry.data.email === userData.email) {
                myEntry = entry;
            }
        }
        if (myEntry?.key !== undefined) {
            // if this e-mail exists already in the pending database,
            // remove that
            removeUserFromPending(myEntry.key);
        }
        const activationCode = crypto.randomUUID();
        const sendPendingSuccess = await sendPendingUserData({
            pendingUserData: userData,
            activationCode,
        });
        if (!sendPendingSuccess) {
            console.log("Adatbázisba rögzítés sikertelen.");
            return; // if database operation is OK, only then send email
        }

        let templateParams = {
            firstName: userData.firstName,
            email: userData.email,
            token: activationCode,
        };
        // const emailSendSuccess = await emailSend(templateParams);
        // if (!emailSendSuccess) {
        //     console.log("E-mail küldés sikertelen.");
        //     return;
        // }
        // console.log("email küldés eredménye: ", emailSendSuccess);
    };

    const onSubmit = (data: FormValues) => {
        newUserHandler(data);
    };

    console.log(errors);

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
                    <div id="login" className={classes.tabcontent}>
                        {/* <p className={classes.title}>Belépés</p> */}
                        <p className={classes.information}>
                            A rendeléshez bejelentkezés szükséges. Ha még nem
                            vagy tag, kérjük regisztrálj!
                        </p>
                        <form className={classes.form}>
                            <input
                                id="email"
                                type="email"
                                placeholder="E-mail"
                                className={classes.input}
                            ></input>
                            <input
                                id="password"
                                type="password"
                                placeholder="Jelszó"
                                className={classes.input}
                            ></input>
                            <a href="/">Elfelejtett jelszó</a>
                            <div className={classes.buttons}>
                                <input type="submit" value="Belépés"></input>
                            </div>
                        </form>
                    </div>
                    <div id="registration" className={classes.tabcontent}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className={classes.form}
                        >
                            <input
                                defaultValue="ana@gm.hu"
                                type="text"
                                className={classes.input}
                                placeholder="E-mail"
                                {...register("email")}
                            />
                            {errors?.email && <p>{errors.email.message}</p>}

                            <input
                                defaultValue="Qwer1234"
                                type="password"
                                className={classes.input}
                                placeholder="Jelszó"
                                {...register("password", {
                                    required: true,
                                    min: 6,
                                })}
                            />
                            {errors?.password && (
                                <p>{errors.password.message}</p>
                            )}

                            <input
                                defaultValue="Kovács"
                                type="text"
                                className={classes.input}
                                placeholder="Vezetéknév"
                                {...register("lastName")}
                            />
                            {errors.lastName && (
                                <p>{errors.lastName.message}</p>
                            )}

                            <input
                                defaultValue="Géza"
                                type="text"
                                className={classes.input}
                                placeholder="Keresztnév"
                                {...register("firstName")}
                            />
                            {errors.firstName && (
                                <p>{errors.firstName.message}</p>
                            )}

                            <input
                                defaultValue="06301234567"
                                type="tel"
                                className={classes.input}
                                placeholder="Telefonszám"
                                {...register("mobile")}
                            />
                            {errors.mobile && <p>{errors.mobile.message}</p>}

                            <input
                                defaultValue="2600"
                                type="text"
                                className={classes.input}
                                placeholder="Irányítószám"
                                {...register("postalCode")}
                            />
                            {errors.postalCode && (
                                <p>{errors.postalCode.message}</p>
                            )}

                            <input
                                defaultValue="Vác"
                                type="text"
                                className={classes.input}
                                placeholder="Település"
                                {...register("city")}
                            />
                            {errors.city && <p>{errors.city.message}</p>}

                            <input
                                defaultValue="Petőfi u. 7."
                                type="text"
                                className={classes.input}
                                placeholder="Közterület és házszám"
                                {...register("street")}
                            />
                            {errors.street && <p>{errors.street.message}</p>}

                            <div>
                                <input
                                    checked
                                    type="checkbox"
                                    id="dataprotection"
                                    placeholder="Adatvédelmi irányelvek"
                                    {...register("dataProtection")}
                                />
                                <label htmlFor="dataprotection">
                                    Elolvastam és elfogadom az Adatvédelmi
                                    elveket és az ÁSZF-ben foglaltakat.
                                </label>
                            </div>
                            {errors.dataProtection && (
                                <p>{errors.dataProtection.message}</p>
                            )}

                            <input type="submit" value="Regisztráció" />
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Login;
