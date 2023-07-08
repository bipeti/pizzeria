import { useForm, Resolver } from "react-hook-form";
import classes from "./User.module.css";
import { sendLostPasswordData, userWithEmail } from "../../store/user-actions";
import bcrypt from "bcryptjs";
import { getUserToken, setUserToken } from "../utils/token";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/user-slice";
import { emailSend } from "../utils/emailSend";
import { MY_LOSTPASSWORD_TEMPLATE_ID } from "../utils/myConsts";

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
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<LoginFormValues>({ resolver });

    const loginUserHandler = async (userData: LoginFormValues) => {
        const user = await userWithEmail(userData.email);
        if (!user) {
            console.log("E-mail, vagy jelszó nem megfelelő.");
            return;
        }
        if (!bcrypt.compareSync(userData.password, user.password)) {
            console.log("E-mail, vagy jelszó nem megfelelő.");
            return;
        }
        console.log("ok");
        const tokenPayload = {
            email: user.email,
            mobile: user.mobile,
            firstName: user.firstName,
        };
        setUserToken(tokenPayload);
        const myUser = getUserToken();
        dispatch(userActions.login());
        console.log(myUser);
        onClose();
    };

    const onSubmit = (data: LoginFormValues) => {
        loginUserHandler(data);
    };

    const resetPasswordHandler = async () => {
        const email = watch("email");
        if (!email) {
            console.log("Please give me your email.");
            return;
        }
        let userData = await userWithEmail(email);
        if (!userData) {
            console.log("Felhasználó nem található.");
            return;
        }
        const token = crypto.randomUUID();
        let sendToDatabaseSuccess = await sendLostPasswordData(email, token);
        if (!sendToDatabaseSuccess) {
            console.log(
                "A jelszó újraküldési token rögzítése során hiba lépett fel."
            );
            return;
        }
        let templateParams = {
            // the template contains the next activation structure:
            // http://localhost:3000/passwordReset?token=4d711b3c-ac83-4ee4-81e1-1f1da6133f6b
            firstName: userData.firstName,
            email: userData.email,
            token,
        };
        const emailSendSuccess = await emailSend(
            MY_LOSTPASSWORD_TEMPLATE_ID,
            templateParams
        );
        if (!emailSendSuccess) {
            console.log("E-mail küldés sikertelen.");
            return;
        }
        console.log("Email küldés eredménye: ", emailSendSuccess);
    };

    return (
        <>
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
