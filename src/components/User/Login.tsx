import { useForm, Resolver } from "react-hook-form";
import classes from "./User.module.css";
import { useDispatch } from "react-redux";
import {
    AuthState,
    authActions,
    getUserWithEmail,
    loginHandler,
} from "../../store/auth-slice";
import { AppDispatch } from "../../store";
import { useSelector } from "react-redux";
import FeedbackModal from "../UI/FeedbackModal";
import { useEffect, useState } from "react";
import {
    GeneralState,
    generalActions,
    sendLostPasswordData,
} from "../../store/general-slice";

interface LoginFormValues {
    email: string;
    password: string;
}

const resolver: Resolver<LoginFormValues> = async (values) => {
    const errors: Partial<
        Record<keyof LoginFormValues, { type: string; message: string }>
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
    }

    return {
        values,
        errors: Object.keys(errors).length === 0 ? {} : errors,
    };
};

const Login = ({ onClose }: { onClose: () => void }) => {
    const dispatch = useDispatch<AppDispatch>();
    const authMessage = useSelector(
        (state: { auth: AuthState }) => state.auth.message
    );
    const authErrorMessage = useSelector(
        (state: { auth: AuthState }) => state.auth.error
    );
    const isLoggedIn = useSelector(
        (state: { auth: AuthState }) => state.auth.isLoggedIn
    );
    const generalMessage = useSelector(
        (state: { general: GeneralState }) => state.general.message
    );
    const generalError = useSelector(
        (state: { general: GeneralState }) => state.general.error
    );
    const generalIsLoading = useSelector(
        (state: { general: GeneralState }) => state.general.isLoading
    );
    const [missingEmailInput, setMissingEmailInput] = useState(false);
    const [noEmailInDatabase, setNoEmailInDatabase] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<LoginFormValues>({ resolver });

    useEffect(() => {
        if (isLoggedIn) {
            onClose();
        }
    }, [isLoggedIn, onClose]);

    const loginUserHandler = async (userData: LoginFormValues) => {
        dispatch(
            loginHandler({
                email: userData.email,
                password: userData.password,
            })
        );
    };

    const onSubmit = (data: LoginFormValues) => {
        loginUserHandler(data);
    };

    const resetPasswordHandler = async () => {
        const email = watch("email");
        if (!email) {
            setMissingEmailInput(true);
            return;
        }
        const userData = await getUserWithEmail(email);
        if (!userData) {
            setNoEmailInDatabase(true);
            return;
        }
        const token = crypto.randomUUID();
        await dispatch(
            sendLostPasswordData({
                email,
                token,
                firstName: userData.firstName,
            })
        );
    };

    const authFeedbackCloseHandler = () => {
        dispatch(authActions.clearMessages());
    };

    const generalFeedbackCloseHandler = () => {
        dispatch(generalActions.clearMessages());
    };

    const missingEmailInputCloseHandler = () => {
        setMissingEmailInput(false);
    };

    const noEmailInDatabaseCloseHandler = () => {
        setNoEmailInDatabase(false);
    };

    return (
        <>
            {authMessage && (
                <FeedbackModal
                    onClose={authFeedbackCloseHandler}
                    message={authMessage}
                    errorMessage={authErrorMessage}
                />
            )}
            {missingEmailInput && (
                <FeedbackModal
                    onClose={missingEmailInputCloseHandler}
                    message={"Kérem, hogy először adja meg az e-mail címét!"}
                    errorMessage={undefined}
                />
            )}
            {noEmailInDatabase && (
                <FeedbackModal
                    onClose={noEmailInDatabaseCloseHandler}
                    message={
                        "A megadott e-mail cím nem szerepel az adatbázisban!"
                    }
                    errorMessage={undefined}
                />
            )}
            {generalMessage && (
                <FeedbackModal
                    onClose={generalFeedbackCloseHandler}
                    message={generalMessage}
                    errorMessage={generalError}
                    isLoading={generalIsLoading}
                />
            )}

            <p className={classes.information}>
                A rendeléshez bejelentkezés szükséges. Ha még nem vagy tag,
                kérjük regisztrálj!
            </p>
            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <input
                    id="email"
                    type="email"
                    placeholder="E-mail"
                    className={classes.input}
                    {...register("email")}
                />
                {errors?.email && <p>{errors.email.message}</p>}
                <input
                    id="password"
                    type="password"
                    placeholder="Jelszó"
                    className={classes.input}
                    {...register("password")}
                />
                {errors?.password && <p>{errors.password.message}</p>}

                <div className={classes.buttons}>
                    <button type="button" onClick={resetPasswordHandler}>
                        Elfelejtett jelszó
                    </button>
                    <button type="submit" value="submitInput">
                        Belépés
                    </button>
                </div>
            </form>
        </>
    );
};

export default Login;
