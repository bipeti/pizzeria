import { useForm, Resolver } from "react-hook-form";
import classes from "./User.module.css";
import { userWithEmail } from "../../store/user-actions";
import bcrypt from "bcryptjs";
import { getUserToken, setUserToken } from "../utils/token";

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

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
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
        };
        setUserToken(tokenPayload);
        const myUser = getUserToken();
        console.log(myUser);
    };

    const onSubmit = (data: LoginFormValues) => {
        loginUserHandler(data);
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

                <a href="/">Elfelejtett jelszó</a>
                <div className={classes.buttons}>
                    <input type="submit" value="Belépés"></input>
                </div>
            </form>
        </>
    );
};

export default Login;
