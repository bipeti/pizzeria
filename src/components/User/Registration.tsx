// This component is used for new users to registrate and existing users to modify
// their data

import { useForm, Resolver } from "react-hook-form";
import classes from "./User.module.css";
import { getUserToken } from "../utils/token";
import { useEffect } from "react";
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
            message: "Az E-mail megadása kötelező",
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

    const newUserHandler = async (userData: RegistrationFormValues) => {
        dispatch(createNewUser({ userData }));
    };

    const modifyUserHandler = async (userData: RegistrationFormValues) => {
        console.log("mod", userData);
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

    return (
        <>
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
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <input
                    defaultValue={userLoggedIn ? userData!.email : ""}
                    type="text"
                    className={classes.input}
                    placeholder="E-mail"
                    disabled={userLoggedIn}
                    {...register("email")}
                />
                {errors?.email && <p>{errors.email.message}</p>}
                {!userLoggedIn && (
                    <>
                        <input
                            type="password"
                            className={classes.input}
                            placeholder="Jelszó"
                            {...register("password", {
                                required: true,
                                min: 8,
                            })}
                        />
                        {errors?.password && <p>{errors.password.message}</p>}
                    </>
                )}
                <input
                    defaultValue={userLoggedIn ? userData!.lastName : ""}
                    type="text"
                    className={classes.input}
                    placeholder="Vezetéknév"
                    {...register("lastName")}
                />
                {errors.lastName && <p>{errors.lastName.message}</p>}

                <input
                    defaultValue={userLoggedIn ? userData!.firstName : ""}
                    type="text"
                    className={classes.input}
                    placeholder="Keresztnév"
                    {...register("firstName")}
                />
                {errors.firstName && <p>{errors.firstName.message}</p>}

                <input
                    defaultValue={userLoggedIn ? userData!.mobile : ""}
                    type="tel"
                    className={classes.input}
                    placeholder="Telefonszám"
                    {...register("mobile")}
                />
                {errors.mobile && <p>{errors.mobile.message}</p>}

                <input
                    defaultValue={userLoggedIn ? userData!.postalCode : ""}
                    type="text"
                    className={classes.input}
                    placeholder="Irányítószám"
                    {...register("postalCode")}
                />
                {errors.postalCode && <p>{errors.postalCode.message}</p>}

                <input
                    defaultValue={userLoggedIn ? userData!.city : ""}
                    type="text"
                    className={classes.input}
                    placeholder="Település"
                    {...register("city")}
                />
                {errors.city && <p>{errors.city.message}</p>}

                <input
                    defaultValue={userLoggedIn ? userData!.street : ""}
                    type="text"
                    className={classes.input}
                    placeholder="Közterület és házszám"
                    {...register("street")}
                />
                {errors.street && <p>{errors.street.message}</p>}

                {!userLoggedIn && (
                    <div>
                        <input
                            defaultChecked={false}
                            type="checkbox"
                            id="dataprotection"
                            placeholder="Adatvédelmi irányelvek"
                            {...register("dataProtection")}
                        />
                        <label htmlFor="dataprotection">
                            Elolvastam és elfogadom az Adatvédelmi elveket és az
                            ÁSZF-ben foglaltakat.
                        </label>
                        {errors.dataProtection && (
                            <p>{errors.dataProtection.message}</p>
                        )}
                    </div>
                )}

                <input
                    type="submit"
                    value={userLoggedIn ? "Adatok módosítása" : "Regisztráció"}
                />
            </form>
        </>
    );
};

export default Registration;
