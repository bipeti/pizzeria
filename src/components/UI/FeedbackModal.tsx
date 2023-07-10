import { useSelector } from "react-redux";
import Modal from "./Modal";
import { CartState } from "../../store/cart-slice";
import { ThreeCircles } from "react-loader-spinner";

type FeedbackModalProps = {
    onClose: () => void;
};

const FeedbackModal = ({ onClose }: FeedbackModalProps) => {
    const isLoading = useSelector(
        (state: { cart: CartState }) => state.cart.isLoading
    );
    const orderMessage = useSelector(
        (state: { cart: CartState }) => state.cart.orderMessage
    );

    return (
        <Modal onClose={onClose}>
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
            {orderMessage}
        </Modal>
    );
};

export default FeedbackModal;
