import { useForm, Resolver } from "react-hook-form";
import classes from "./User.module.css";
import bcrypt from "bcryptjs";
import {
    getLostPasswordData,
    modifyUserPassword,
    removeLostPasswordData,
} from "../../store/user-actions";
import { getUserToken } from "../utils/token";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

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

let salt = bcrypt.genSaltSync(10);

const NewPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({ resolver });
    const location = useLocation();
    let userToken = getUserToken();
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!userToken && !token) {
            console.log("nothing");
            navigate("/");
        }
    }, [navigate, userToken, token]);
    const modifyPasswordHandler = async (passwordData: LoginFormValues) => {
        if (passwordData.newPassword !== passwordData.reNewPassword) {
            console.log("A két jelszó nem egyezik.");
            return;
        }
        let hashedPassword = bcrypt.hashSync(passwordData.newPassword, salt);
        let relatedEmail: string;

        if (!userToken) {
            // forgotten password from out
            if (!token) {
                // nem az e-mail-ből jött.
                //redirect
                return;
            }
            let emailFromLostPassword = await getLostPasswordData(token);
            if (!emailFromLostPassword) {
                console.log("Nincs az adatbázisban ez a token.");
                return;
            }
            relatedEmail = emailFromLostPassword;
        } else {
            // password modification from inside
            relatedEmail = userToken.email;
        }

        let modifySuccess = await modifyUserPassword(
            relatedEmail,
            hashedPassword
        );
        if (!modifySuccess) {
            console.log("Jelszó módosítás sikertelen!");
            return;
        }
        console.log("Jelszó módosítás sikeres!");
        if (!userToken) {
            const removeSuccess = removeLostPasswordData(token!);
            if (!removeSuccess) {
                console.log(
                    "Jelszóvisszaállító token törlése az adatbázisból sikertelen."
                );
                return;
            }
            console.log("Jelszóvisszaállító token törlése sikeres.");
        }
    };

    const onSubmit = (data: LoginFormValues) => {
        modifyPasswordHandler(data);
    };

    return (
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <input
                id="newPassword"
                type="password"
                placeholder="Új jelszó"
                className={classes.input}
                {...register("newPassword")}
            />
            {errors?.newPassword && <p>{errors.newPassword.message}</p>}
            <input
                id="reNewPassword"
                type="password"
                placeholder="Új jelszó még egyszer"
                className={classes.input}
                {...register("reNewPassword")}
            />
            {errors?.reNewPassword && <p>{errors.reNewPassword.message}</p>}

            <div className={classes.buttons}>
                <input type="submit" value="Módosítás"></input>
            </div>
        </form>
    );
};

export default NewPassword;
