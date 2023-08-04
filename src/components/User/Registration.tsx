// This component is used for new users to registrate and existing users to modify
// their data

import { useForm, Resolver } from "react-hook-form";
import classes from "./User.module.css";
import { getUserToken } from "../utils/token";
import { useEffect, useState } from "react";
import { AuthState, authActions, modifyUserData } from "../../store/auth-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { useSelector } from "react-redux";
import FeedbackModal from "../UI/FeedbackModal";
import {
    GeneralState,
    UserData,
    createNewUser,
    generalActions,
} from "../../store/general-slice";

interface RegistrationFormValues extends UserData {
    dataProtection: boolean;
}

const resolver: Resolver<RegistrationFormValues> = async (values) => {
    const errors: Partial<
        Record<keyof RegistrationFormValues, { type: string; message: string }>
    > = {};
    let userLoggedIn = getUserToken() !== null;

    if (!values.email) {
        errors.email = {
            type: "required",
            message: "E-mail megadása kötelező",
        };
    } else if (!values.email.match(/^\S+@\S+$/i)) {
        errors.email = {
            type: "pattern",
            message: "Érvénytelen e-mail cím formátum",
        };
    }

    if (!userLoggedIn) {
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
        } else if (values.password.length < 8) {
            errors.password = {
                type: "range",
                message: "A jelszónak legalább 8 karakterből kell állnia",
            };
        }

        if (!values.dataProtection) {
            errors.dataProtection = {
                type: "required",
                message: "Az adatvédelmi nyilatkozat elfogadása kötelező.",
            };
        }
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
    } else if (!values.mobile.match(/^[\d+-]{10,}$/)) {
        errors.mobile = {
            type: "pattern",
            message:
                "A telefonszám 10 vagy több számjegyből, + és - jelekből állhat",
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
            message: "A mező kitöltése kötelező",
        };
    }

    return {
        values,
        errors: Object.keys(errors).length === 0 ? {} : errors,
    };
};

const Registration = ({ userData }: { userData?: UserData }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        setValue,
    } = useForm<RegistrationFormValues>({ resolver });
    let userLoggedIn = !!userData;
    const dispatch = useDispatch<AppDispatch>();

    const authMessage = useSelector(
        (state: { auth: AuthState }) => state.auth.message
    );
    const authErrorMessage = useSelector(
        (state: { auth: AuthState }) => state.auth.error
    );
    const authIsLoading = useSelector(
        (state: { auth: AuthState }) => state.auth.isLoading
    );
    const generalMessage = useSelector(
        (state: { general: GeneralState }) => state.general.message
    );
    const generalErrorMessage = useSelector(
        (state: { general: GeneralState }) => state.general.error
    );
    const generalIsLoading = useSelector(
        (state: { general: GeneralState }) => state.general.isLoading
    );
    const [tryModify, setTryModify] = useState(false);

    const newUserHandler = async (userData: RegistrationFormValues) => {
        dispatch(createNewUser({ userData }));
    };

    const modifyUserHandler = async (userData: RegistrationFormValues) => {
        if (userData.email === "demo@ludasmeggyes.hu") {
            setTryModify(true);
            return;
        }

        dispatch(modifyUserData({ userData }));
    };

    const onSubmit = async (data: RegistrationFormValues) => {
        if (!userLoggedIn) {
            newUserHandler(data);
        } else {
            modifyUserHandler(data);
        }
    };

    useEffect(() => {
        if (userData) {
            setValue("email", userData?.email);
            trigger("email");
        }
    }, [userData, setValue, trigger]);

    const authFeedbackCloseHandler = () => {
        dispatch(authActions.clearMessages());
    };

    const generalFeedbackCloseHandler = () => {
        dispatch(generalActions.clearMessages());
    };

    const tryModifyCloseHandler = () => {
        setTryModify(false);
    };

    return (
        <div className={classes["content-wrapper"]}>
            {authMessage && (
                <FeedbackModal
                    isLoading={authIsLoading}
                    onClose={authFeedbackCloseHandler}
                    message={authMessage}
                    errorMessage={authErrorMessage}
                />
            )}
            {generalMessage && (
                <FeedbackModal
                    isLoading={generalIsLoading}
                    onClose={generalFeedbackCloseHandler}
                    message={generalMessage}
                    errorMessage={generalErrorMessage}
                />
            )}
            {tryModify && (
                <FeedbackModal
                    onClose={tryModifyCloseHandler}
                    message={
                        "Te kis hamis! A demo felhasználó adatait nem engedem megváltoztatni! :)"
                    }
                    errorMessage={undefined}
                    messagetype="warning"
                />
            )}
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <p className={classes["demo-info"]}>
                    Az oldal demonstrációs célokat szolgál! Kérem, hogy fiktív
                    adatokat használj!
                </p>
                <div className={classes["error-wrapper"]}>
                    <div className={classes["input-wrapper"]}>
                        <label htmlFor="email">E-mail</label>
                        <input
                            defaultValue={userLoggedIn ? userData!.email : ""}
                            id="email"
                            type="text"
                            className={classes.input}
                            disabled={userLoggedIn}
                            {...register("email")}
                            aria-invalid={errors.email ? "true" : "false"}
                        />
                    </div>
                    {errors?.email && (
                        <p className={classes.error}>{errors.email.message}</p>
                    )}
                </div>
                {!userLoggedIn && (
                    <>
                        <div className={classes["error-wrapper"]}>
                            <div className={classes["input-wrapper"]}>
                                <label htmlFor="password">Jelszó</label>
                                <input
                                    type="password"
                                    id="password"
                                    className={classes.input}
                                    {...register("password", {
                                        required: true,
                                        min: 8,
                                    })}
                                    aria-invalid={
                                        errors.password ? "true" : "false"
                                    }
                                />
                            </div>
                            {errors?.password && (
                                <p className={classes.error}>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </>
                )}
                <div className={classes["error-wrapper"]}>
                    <div className={classes["input-wrapper"]}>
                        <label htmlFor="lastName">Vezetéknév</label>
                        <input
                            defaultValue={
                                userLoggedIn ? userData!.lastName : ""
                            }
                            type="text"
                            id="lastName"
                            className={classes.input}
                            {...register("lastName")}
                            aria-invalid={errors.lastName ? "true" : "false"}
                        />
                    </div>
                    {errors.lastName && (
                        <p className={classes.error}>
                            {errors.lastName.message}
                        </p>
                    )}
                </div>
                <div className={classes["error-wrapper"]}>
                    <div className={classes["input-wrapper"]}>
                        <label htmlFor="firstName">Keresztnév</label>
                        <input
                            defaultValue={
                                userLoggedIn ? userData!.firstName : ""
                            }
                            type="text"
                            id="firstName"
                            className={classes.input}
                            {...register("firstName")}
                            aria-invalid={errors.firstName ? "true" : "false"}
                        />
                    </div>
                    {errors.firstName && (
                        <p className={classes.error}>
                            {errors.firstName.message}
                        </p>
                    )}
                </div>
                <div className={classes["error-wrapper"]}>
                    <div className={classes["input-wrapper"]}>
                        <label htmlFor="mobile">Telefonszám</label>
                        <input
                            defaultValue={userLoggedIn ? userData!.mobile : ""}
                            type="tel"
                            id="mobile"
                            className={classes.input}
                            {...register("mobile")}
                            aria-invalid={errors.mobile ? "true" : "false"}
                        />
                    </div>
                    {errors.mobile && (
                        <p className={classes.error}>{errors.mobile.message}</p>
                    )}
                </div>
                <div className={classes["error-wrapper"]}>
                    <div className={classes["input-wrapper"]}>
                        <label htmlFor="postalCode">Irányítószám</label>
                        <input
                            defaultValue={
                                userLoggedIn ? userData!.postalCode : ""
                            }
                            type="text"
                            id="postalCode"
                            className={classes.input}
                            {...register("postalCode")}
                            aria-invalid={errors.postalCode ? "true" : "false"}
                        />
                    </div>
                    {errors.postalCode && (
                        <p className={classes.error}>
                            {errors.postalCode.message}
                        </p>
                    )}
                </div>
                <div className={classes["error-wrapper"]}>
                    <div className={classes["input-wrapper"]}>
                        <label htmlFor="city">Település</label>
                        <input
                            defaultValue={userLoggedIn ? userData!.city : ""}
                            type="text"
                            id="city"
                            className={classes.input}
                            {...register("city")}
                            aria-invalid={errors.city ? "true" : "false"}
                        />
                    </div>
                    {errors.city && (
                        <p className={classes.error}>{errors.city.message}</p>
                    )}
                </div>
                <div className={classes["error-wrapper"]}>
                    <div className={classes["input-wrapper"]}>
                        <label htmlFor="street">Közterület és házszám</label>
                        <input
                            defaultValue={userLoggedIn ? userData!.street : ""}
                            type="text"
                            id="street"
                            className={classes.input}
                            {...register("street")}
                            aria-invalid={errors.street ? "true" : "false"}
                        />
                    </div>
                    {errors.street && (
                        <p className={classes.error}>{errors.street.message}</p>
                    )}
                </div>
                {!userLoggedIn && (
                    <div className={classes["error-wrapper"]}>
                        <div
                            className={classes["checkbox-wrapper"]}
                            aria-invalid={
                                errors.dataProtection ? "true" : "false"
                            }
                        >
                            <input
                                defaultChecked={false}
                                type="checkbox"
                                id="dataprotection"
                                placeholder="Adatvédelmi irányelvek"
                                {...register("dataProtection")}
                            />
                            <label htmlFor="dataprotection">
                                Elolvastam és elfogadom az Adatvédelmi elveket
                                és az ÁSZF-ben foglaltakat.
                            </label>
                        </div>
                        {errors.dataProtection && (
                            <p className={classes.error}>
                                {errors.dataProtection.message}
                            </p>
                        )}
                    </div>
                )}
                <div className={classes.buttons}>
                    <input
                        type="submit"
                        className="globalbuttons"
                        value={
                            userLoggedIn ? "Adatok módosítása" : "Regisztráció"
                        }
                    />
                </div>
            </form>
        </div>
    );
};

export default Registration;
