import Modal from "./Modal";
import { ThreeCircles } from "react-loader-spinner";

type FeedbackModalProps = {
    isLoading?: boolean;
    message: string | undefined;
    errorMessage: string | undefined;
    onClose: () => void;
};

const FeedbackModal = ({
    isLoading,
    message,
    errorMessage,
    onClose,
}: FeedbackModalProps) => {
    return (
        <Modal onClose={onClose}>
            <div>
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
                        innerCircleColor="red"
                        middleCircleColor="green"
                    />
                )}
            </div>
            <div>{message}</div>
            {errorMessage && <div>{errorMessage}</div>}
        </Modal>
    );
};

export default FeedbackModal;
