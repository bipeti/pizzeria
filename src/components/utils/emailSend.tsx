import emailjs from "@emailjs/browser";
import { MY_PUBLIC_KEY, MY_SERVICE_ID, MY_TEMPLATE_ID } from "./myConsts";

type emailSendProps = {
    firstName: string;
    email: string;
    token: string;
};

export const emailSend = async (templateParams: emailSendProps) => {
    // the template contains the next activation structure:
    // http://localhost:3000/activation?email=test@gmail.com&token=de26d857-1cfa-4752-b63f-52dd216e4f05
    try {
        const response = await emailjs.send(
            MY_SERVICE_ID,
            MY_TEMPLATE_ID,
            templateParams,
            MY_PUBLIC_KEY
        );
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
};
