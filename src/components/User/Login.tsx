import { useEffect } from "react";
import Modal from "../UI/Modal";
import classes from "./Login.module.css";
import { useForm, Resolver } from "react-hook-form";
import emailjs from "@emailjs/browser";

type FormValues = {
    Email: string;
    Password: string;
    "First name": string;
    "Last name": string;
    "Mobile number": string;
    "Postal Code": string;
    City: string;
    Street: string;
    "Data protection": boolean;
};

const resolver: Resolver<FormValues> = async (values) => {
    const errors: Partial<
        Record<keyof FormValues, { type: string; message: string }>
    > = {};

    if (!values.Email) {
        errors.Email = {
            type: "required",
            message: "Az E-mail megadása kötelező",
        };
    } else if (!values.Email.match(/^\S+@\S+$/i)) {
        errors.Email = {
            type: "pattern",
            message: "Érvénytelen e-mail cím formátum",
        };
    }

    if (!values.Password) {
        errors.Password = {
            type: "required",
            message: "Jelszó megadása kötelező",
        };
    } else if (!values.Password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
        errors.Password = {
            type: "pattern",
            message:
                "A jelszónak tartalmaznia kell legalább egy nagybetűt, egy kisbetűt és egy számot",
        };
    }

    if (!values["First name"]) {
        errors["First name"] = {
            type: "required",
            message: "Név megadása kötelező",
        };
    }

    if (!values["Last name"]) {
        errors["Last name"] = {
            type: "required",
            message: "Név megadása kötelező",
        };
    }

    if (!values["Mobile number"]) {
        errors["Mobile number"] = {
            type: "required",
            message: "Telefonszám megadása kötelező",
        };
    } else if (values["Mobile number"].length < 10) {
        errors["Mobile number"] = {
            type: "range",
            message: "A telefonszám legalább 10 karakterből áll",
        };
    }

    if (!values["Postal Code"]) {
        errors["Postal Code"] = {
            type: "required",
            message: "Irányítószám megadása kötelező",
        };
    } else if (!values["Postal Code"].match(/^\d{4}$/)) {
        errors["Postal Code"] = {
            type: "pattern",
            message: "Az irányítószám négy számjegyből állhat",
        };
    }

    if (!values.City) {
        errors.City = {
            type: "required",
            message: "Település megadása kötelező",
        };
    }

    if (!values.Street) {
        errors.Street = {
            type: "required",
            message: "Közterület és házszám megadása kötelező",
        };
    }

    if (!values["Data protection"]) {
        errors["Data protection"] = {
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
        const loadedUsers = [];
        try {
            const response = await fetch(
                "https://pizzeria-39338-default-rtdb.europe-west1.firebasedatabase.app/users.json"
            );
            if (!response.ok) {
                throw new Error("Something went wrong");
            }
            const data = await response.json();
            for (const key in data) {
                loadedUsers.push({
                    email: data[key].email,
                });
            }
        } catch (error) {
            console.log(error);
        }

        const emailExists = loadedUsers.find(
            (user) => user.email === userData.Email
        );

        if (emailExists) {
            console.log("Email already exists in the database");
            return;
        }

        const activationCode = crypto.randomUUID();

        let templateParams = {
            firstName: userData["First name"],
            email: userData.Email,
            token: activationCode,
        };

        try {
            const response = await fetch(
                "https://pizzeria-39338-default-rtdb.europe-west1.firebasedatabase.app/pendingusers.json",
                {
                    method: "POST",
                    body: JSON.stringify({
                        email: userData.Email,
                        password: userData.Password,
                        firstName: userData["First name"],
                        lastName: userData["Last name"],
                        mobile: userData["Mobile number"],
                        postalCode: userData["Postal Code"],
                        city: userData.City,
                        street: userData.Street,
                        registrationDate: Date(),
                        activationCode: activationCode,
                    }),
                }
            );
            const data = await response.json();

            // if database operation is OK, then send email

            if (true) {
                emailjs
                    .send(
                        "service_5aopvtj",
                        "template_tkqfwuh",
                        templateParams,
                        "spbia2xqnaePNp_0N"
                    )
                    .then(
                        (result) => {
                            console.log(result.text);
                        },
                        (error) => {
                            console.log(error.text);
                        }
                    );
                // the template contains the next actiation structure:
                // http://localhost:3000/activation?email=test@gmail.com&token=de26d857-1cfa-4752-b63f-52dd216e4f05
            }
        } catch (error) {
            console.log(error);
        }
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
                                type="text"
                                className={classes.input}
                                placeholder="E-mail"
                                {...register("Email")}
                            />
                            {errors?.Email && <p>{errors.Email.message}</p>}

                            <input
                                type="password"
                                className={classes.input}
                                placeholder="Password"
                                {...register("Password", {
                                    required: true,
                                    min: 6,
                                })}
                            />
                            {errors?.Password && (
                                <p>{errors.Password.message}</p>
                            )}

                            <input
                                type="text"
                                className={classes.input}
                                placeholder="Vezetéknév"
                                {...register("Last name")}
                            />
                            {errors["Last name"] && (
                                <p>{errors["Last name"].message}</p>
                            )}

                            <input
                                type="text"
                                className={classes.input}
                                placeholder="Keresztnév"
                                {...register("First name")}
                            />
                            {errors["First name"] && (
                                <p>{errors["First name"].message}</p>
                            )}

                            <input
                                type="tel"
                                className={classes.input}
                                placeholder="Telefonszám"
                                {...register("Mobile number")}
                            />
                            {errors["Mobile number"] && (
                                <p>{errors["Mobile number"].message}</p>
                            )}

                            <input
                                type="text"
                                className={classes.input}
                                placeholder="Irányítószám"
                                {...register("Postal Code")}
                            />
                            {errors["Postal Code"] && (
                                <p>{errors["Postal Code"].message}</p>
                            )}

                            <input
                                type="text"
                                className={classes.input}
                                placeholder="Település"
                                {...register("City")}
                            />
                            {errors.City && <p>{errors.City.message}</p>}

                            <input
                                type="text"
                                className={classes.input}
                                placeholder="Közterület és házszám"
                                {...register("Street")}
                            />
                            {errors.Street && <p>{errors.Street.message}</p>}

                            <div>
                                <input
                                    type="checkbox"
                                    id="dataprotection"
                                    placeholder="Adatvédelmi irányelvek"
                                    {...register("Data protection")}
                                />
                                <label htmlFor="dataprotection">
                                    Elolvastam és elfogadom az Adatvédelmi
                                    elveket és az ÁSZF-ben foglaltakat.
                                </label>
                            </div>
                            {errors["Data protection"] && (
                                <p>{errors["Data protection"].message}</p>
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
