// This component is used for forgotten password and logged in users to modify
// their password

import { useForm, Resolver } from "react-hook-form";
import classes from "./User.module.css";
// import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    AuthState,
    authActions,
    modifyUserPassword,
} from "../../store/auth-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { useSelector } from "react-redux";
import FeedbackModal from "../UI/FeedbackModal";
import {
    getLostPasswordData,
    removeLostPasswordData,
} from "../../store/general-slice";
import { SECRET_PASS } from "../utils/myConsts";

interface LoginFormValues {
    newPassword: string;
    reNewPassword: string;
}

const resolver: Resolver<LoginFormValues> = async (values) => {
    const errors: Partial<
        Record<keyof LoginFormValues, { type: string; message: string }>
    > = {};

    if (!values.newPassword) {
        errors.newPassword = {
            type: "required",
            message: "Jelszó megadása kötelező",
        };
    } else if (!values.newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
        errors.newPassword = {
            type: "pattern",
            message:
                "A jelszónak tartalmaznia kell legalább egy nagybetűt, egy kisbetűt és egy számot",
        };
    } else if (values.newPassword.length < 8) {
        errors.newPassword = {
            type: "range",
            message: "A jelszónak legalább 8 karakterből kell állnia",
        };
    }

    if (!values.reNewPassword) {
        errors.reNewPassword = {
            type: "required",
            message: "Jelszó megadása kötelező",
        };
    } else if (!values.reNewPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
        errors.reNewPassword = {
            type: "pattern",
            message:
                "A jelszónak tartalmaznia kell legalább egy nagybetűt, egy kisbetűt és egy számot",
        };
    } else if (values.reNewPassword.length < 8) {
        errors.reNewPassword = {
            type: "range",
            message: "A jelszónak legalább 8 karakterből kell állnia",
        };
    }

    return {
        values,
        errors: Object.keys(errors).length === 0 ? {} : errors,
    };
};

// let salt = bcrypt.genSaltSync(10);

const NewPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({ resolver });
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const tokenInEmail = urlParams.get("token");
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: { auth: AuthState }) => state.auth.user);
    const authMessage = useSelector(
        (state: { auth: AuthState }) => state.auth.message
    );
    const authErrorMessage = useSelector(
        (state: { auth: AuthState }) => state.auth.error
    );
    const isLoading = useSelector(
        (state: { auth: AuthState }) => state.auth.isLoading
    );
    const [passwordsDontMatch, setPasswordsDontMatch] = useState(false);
    const [missingLostPasswordInDatabase, setMissingLostPasswordInDatabase] =
        useState(false);
    const [tryModify, setTryModify] = useState(false);

    useEffect(() => {
        if (!user && !tokenInEmail) {
            //  If he comes from outside (no logged in) and no valid token.
            navigate("/");
        }
    }, [navigate, user, tokenInEmail]);

    const modifyPasswordHandler = async (passwordData: LoginFormValues) => {
        if (passwordData.newPassword !== passwordData.reNewPassword) {
            setPasswordsDontMatch(true);
            return;
        }
        // let hashedPassword = bcrypt.hashSync(passwordData.newPassword, salt);
        let hashedPassword = CryptoJS.AES.encrypt(
            JSON.stringify(passwordData.newPassword),
            SECRET_PASS
        ).toString();
        let relatedEmail: string;

        if (!user) {
            // forgotten password from outside
            let emailFromLostPassword = await getLostPasswordData(
                tokenInEmail!
            );
            if (!emailFromLostPassword) {
                setMissingLostPasswordInDatabase(true);
                return;
            }
            relatedEmail = emailFromLostPassword;
        } else {
            // password modification from inside
            relatedEmail = user.email;
        }
        if (relatedEmail === "demo@ludasmeggyes.hu") {
            setTryModify(true);
            return;
        }

        dispatch(
            modifyUserPassword({
                email: relatedEmail,
                password: hashedPassword,
            })
        );

        if (!user) {
            await removeLostPasswordData(tokenInEmail!);
        }
    };

    const onSubmit = (data: LoginFormValues) => {
        modifyPasswordHandler(data);
    };

    const feedbackCloseHandler = () => {
        dispatch(authActions.clearMessages());
    };

    const passwordsDontMatchCloseHandler = () => {
        setPasswordsDontMatch(false);
    };

    const missingLostPasswordHandler = () => {
        setMissingLostPasswordInDatabase(false);
    };

    const tryModifyCloseHandler = () => {
        setTryModify(false);
    };

    return (
        <div className={classes["content-wrapper"]}>
            {authMessage && (
                <FeedbackModal
                    isLoading={isLoading}
                    onClose={feedbackCloseHandler}
                    message={authMessage}
                    errorMessage={authErrorMessage}
                />
            )}
            {passwordsDontMatch && (
                <FeedbackModal
                    onClose={passwordsDontMatchCloseHandler}
                    message={"A két jelszó nem egyezik!"}
                    errorMessage={undefined}
                    messagetype="warning"
                />
            )}
            {missingLostPasswordInDatabase && (
                <FeedbackModal
                    onClose={missingLostPasswordHandler}
                    message={
                        "Az aktiváló token nem található az adatbázisban. Kérünk, hogy kövesd az e-mail-ben küldött aktiválás menetét!"
                    }
                    errorMessage={undefined}
                    messagetype="warning"
                />
            )}
            {tryModify && (
                <FeedbackModal
                    onClose={tryModifyCloseHandler}
                    message={
                        "Te kis hamis! A demo felhasználó jelszavát nem engedem megváltoztatni! :)"
                    }
                    errorMessage={undefined}
                    messagetype="warning"
                />
            )}

            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={classes["error-wrapper"]}>
                    <div className={classes["input-wrapper"]}>
                        <label htmlFor="newPassword">Új jelszó</label>

                        <input
                            id="newPassword"
                            type="password"
                            className={classes.input}
                            {...register("newPassword")}
                            aria-invalid={errors.newPassword ? "true" : "false"}
                        />
                    </div>
                    {errors?.newPassword && (
                        <p className={classes.error}>
                            {errors.newPassword.message}
                        </p>
                    )}
                </div>
                <div className={classes["error-wrapper"]}>
                    <div className={classes["input-wrapper"]}>
                        <label htmlFor="reNewPassword">
                            Új jelszó még egyszer
                        </label>

                        <input
                            id="reNewPassword"
                            type="password"
                            className={classes.input}
                            {...register("reNewPassword")}
                            aria-invalid={
                                errors.reNewPassword ? "true" : "false"
                            }
                        />
                    </div>
                    {errors?.reNewPassword && (
                        <p className={classes.error}>
                            {errors.reNewPassword.message}
                        </p>
                    )}
                </div>
                <div className={classes.buttons}>
                    <input
                        type="submit"
                        className="globalbuttons"
                        value="Módosítás"
                    ></input>
                </div>
            </form>
        </div>
    );
};

export default NewPassword;
