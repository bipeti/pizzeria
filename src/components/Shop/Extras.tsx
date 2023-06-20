import Modal from "../UI/Modal";
// import classes from "./Extras.module.css";

type ExtrasProps = {
    onClose: () => void;
};

const Extras = ({ onClose }: ExtrasProps) => {
    return (
        <Modal onClose={onClose}>
            <p>teszt</p>
        </Modal>
    );
};

export default Extras;
