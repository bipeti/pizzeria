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
import { DEMO_EMAIL } from "../utils/myConsts";

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
    const [tryDemoPasswordModify, setTryDemoPasswordModify] = useState(false);

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
        if (email === DEMO_EMAIL) {
            setTryDemoPasswordModify(true);
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

    const tryDemoPasswordModifyCloseHandler = () => {
        setTryDemoPasswordModify(false);
    };

    const noEmailInDatabaseCloseHandler = () => {
        setNoEmailInDatabase(false);
    };

    return (
        <div className={classes["content-wrapper"]}>
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
                    message={"Kérünk, hogy először add meg az e-mail címed!"}
                    errorMessage={undefined}
                    messagetype="warning"
                />
            )}
            {tryDemoPasswordModify && (
                <FeedbackModal
                    onClose={tryDemoPasswordModifyCloseHandler}
                    message={
                        "Te kis hamis! A demo felhasználó jelszavát nem engedem megváltoztatni! :)"
                    }
                    errorMessage={undefined}
                    messagetype="warning"
                />
            )}
            {noEmailInDatabase && (
                <FeedbackModal
                    onClose={noEmailInDatabaseCloseHandler}
                    message={
                        "A megadott e-mail cím nem szerepel az adatbázisban!"
                    }
                    errorMessage={undefined}
                    messagetype="warning"
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

            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={classes["error-wrapper"]}>
                    <div className={classes["input-wrapper"]}>
                        <label htmlFor="email">E-mail</label>
                        <input
                            id="email"
                            type="email"
                            className={classes.input}
                            {...register("email")}
                            aria-invalid={errors.email ? "true" : "false"}
                        />
                    </div>
                    {errors?.email && (
                        <p className={classes.error}>{errors.email.message}</p>
                    )}
                </div>
                <div className={classes["error-wrapper"]}>
                    <div className={classes["input-wrapper"]}>
                        <label htmlFor="password">Jelszó</label>
                        <input
                            id="password"
                            type="password"
                            className={classes.input}
                            {...register("password")}
                            aria-invalid={errors.password ? "true" : "false"}
                        />
                    </div>
                    {errors?.password && (
                        <p className={classes.error}>
                            {errors.password.message}
                        </p>
                    )}
                </div>
                <div>
                    <button
                        type="button"
                        className={classes.forgottenPassword}
                        onClick={resetPasswordHandler}
                    >
                        Elfelejtett jelszó?
                    </button>
                </div>
                <div className={classes.buttons}>
                    <button
                        type="submit"
                        className="globalbuttons"
                        value="submitInput"
                    >
                        Belépés
                    </button>
                </div>
            </form>
            <p className={classes.information}>
                A rendeléshez bejelentkezés szükséges. Ha még nem vagy tag,
                kérjük regisztrálj!
            </p>
        </div>
    );
};

export default Login;
