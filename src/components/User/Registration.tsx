import { useForm, Resolver } from "react-hook-form";
import classes from "./User.module.css";
import {
    PendingUserData,
    UserData,
    fetchPendingUserData,
    modifyUserData,
    removeUserFromPending,
    sendPendingUserData,
    userWithEmail,
} from "../../store/user-actions";
import bcrypt from "bcryptjs";
import { emailSend } from "../utils/emailSend";
import { getUserToken } from "../utils/token";
import { useEffect } from "react";
import { MY_REGISTRATION_TEMPLATE_ID } from "../utils/myConsts";

let salt = bcrypt.genSaltSync(10);

interface RegistrationFormValues extends UserData {
    dataProtection: boolean;
}

const resolver: Resolver<RegistrationFormValues> = async (values) => {
    const errors: Partial<
        Record<keyof RegistrationFormValues, { type: string; message: string }>
    > = {};
    let userLoggedIn = false;

    if (getUserToken()) {
        userLoggedIn = true;
    }
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

    const newUserHandler = async (userData: RegistrationFormValues) => {
        const user = await userWithEmail(userData.email);

        if (user) {
            console.log("Email already exists in the database");
            return;
        }
        const loadedPendingUsers = await fetchPendingUserData();
        console.log(loadedPendingUsers);
        let entryInPendingUsers:
            | {
                  key: string;
                  data: PendingUserData;
              }
            | undefined = undefined;
        for (const entry of loadedPendingUsers) {
            if (entry.data.email === userData.email) {
                entryInPendingUsers = entry;
            }
        }
        if (entryInPendingUsers?.key !== undefined) {
            // if this e-mail exists already in the pending database,
            // remove that
            removeUserFromPending(entryInPendingUsers.key);
        }
        const activationCode = crypto.randomUUID();
        let hashedPassword = bcrypt.hashSync(userData.password, salt);
        const modifiedUserData = { ...userData };
        modifiedUserData.password = hashedPassword;
        console.log(userData.password);
        console.log(hashedPassword);

        const sendPendingSuccess = await sendPendingUserData({
            pendingUserData: modifiedUserData,
            activationCode,
        });
        if (!sendPendingSuccess) {
            console.log("Adatbázisba rögzítés sikertelen.");
            return; // if database operation is OK, only then send email
        }

        let templateParams = {
            // the template contains the next activation structure:
            // http://localhost:3000/activation?email=test@gmail.com&token=de26d857-1cfa-4752-b63f-52dd216e4f05

            firstName: userData.firstName,
            email: userData.email,
            token: activationCode,
        };
        const emailSendSuccess = await emailSend(
            MY_REGISTRATION_TEMPLATE_ID,
            templateParams
        );
        if (!emailSendSuccess) {
            console.log("E-mail küldés sikertelen.");
            return;
        }
        console.log("email küldés eredménye: ", emailSendSuccess);
    };

    const modifyUserHandler = async (userData: RegistrationFormValues) => {
        console.log("mod", userData);
        const modifyUserSuccess = await modifyUserData({ userData });
        if (!modifyUserSuccess) {
            console.log("Módosítás sikertelen.");
        } else {
            console.log("OK");
        }
    };

    const onSubmit = async (data: RegistrationFormValues) => {
        if (!userLoggedIn) {
            newUserHandler(data);
        } else {
            console.log(data.email);
            modifyUserHandler(data);
        }
    };

    useEffect(() => {
        if (userData) {
            setValue("email", userData?.email);
            trigger("email");
        }
    }, [userData, setValue, trigger]);
    console.log(errors);

    return (
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
    );
};

export default Registration;
