import Modal from "./Modal";
import { ThreeCircles } from "react-loader-spinner";
import classes from "./FeedbackModal.module.css";

/*  This component can be "called" in two ways: 
    1. checking the messages in slices: the messages come from slices 
    2. directly: the messages set "manually" 
*/

type FeedbackModalProps = {
    isLoading?: boolean;
    message: string | undefined;
    errorMessage: string | undefined;
    messagetype?: "success" | "warning";
    onClose: () => void;
};

const FeedbackModal = ({
    isLoading,
    message,
    errorMessage,
    messagetype,
    onClose,
}: FeedbackModalProps) => {
    let myIcon = messagetype ? messagetype : errorMessage ? "error" : "success";

    return (
        <Modal onClose={onClose} feedback>
            <div className={classes.wrapper}>
                <div className={classes.icon}>
                    {isLoading && (
                        <ThreeCircles
                            height="100"
                            width="100"
                            color="#4fa94d"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                            ariaLabel="three-circles-rotating"
                            outerCircleColor="black"
                            innerCircleColor="black"
                            middleCircleColor="black"
                        />
                    )}
                    {!isLoading && (
                        <img
                            alt="information icon"
                            src={myIcon + ".png"}
                            onClick={onClose}
                        />
                    )}
                </div>
                <div className={classes.message}>{message}</div>
                {errorMessage && (
                    <div className={classes.error}>{errorMessage}</div>
                )}
            </div>
        </Modal>
    );
};

export default FeedbackModal;
