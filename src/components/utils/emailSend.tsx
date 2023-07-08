import emailjs from "@emailjs/browser";
import { MY_PUBLIC_KEY, MY_SERVICE_ID } from "./myConsts";

type emailSendProps = {
    firstName: string;
    email: string;
    token: string;
};

export const emailSend = async (
    templateid: string,
    templateParams: emailSendProps
) => {
    try {
        const response = await emailjs.send(
            MY_SERVICE_ID,
            templateid,
            templateParams,
            MY_PUBLIC_KEY
        );
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
};
