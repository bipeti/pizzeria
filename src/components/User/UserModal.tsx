import Modal from "../UI/Modal";
import classes from "./User.module.css";
import { ReactNode } from "react";

type ModalProps = {
    onClose: () => void;
    children: ReactNode;
};

const UserModal = ({ onClose, children }: ModalProps) => {
    return (
        <Modal onClose={onClose}>
            <div className={classes.outer}>
                <div className={classes.pizza}>
                    <img src="pizza.jpg" alt="pizza" />
                </div>
                {children}
            </div>
        </Modal>
    );
};

export default UserModal;
