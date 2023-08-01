import classes from "./Modal.module.css";
import ReactDOM from "react-dom";
import { ReactNode } from "react";

type BackdropProps = {
    onClose: () => void;
    feedback?: boolean;
};

const Backdrop = ({ onClose, feedback }: BackdropProps) => {
    return (
        <div
            className={`${classes.backdrop} ${
                feedback ? classes.feedback : ""
            }`}
            onClick={onClose}
        />
    );
};

type ModalOverlayProps = {
    children: ReactNode;
    feedback?: boolean;
    onClose: () => void;
};

const ModalOverlay = ({ children, feedback, onClose }: ModalOverlayProps) => {
    return (
        <div className={`${classes.modal} ${feedback ? classes.feedback : ""}`}>
            <div className={classes.contentWrapper}>
                <div className={classes.content}>{children}</div>
                <img
                    alt="close"
                    className={classes.close_img}
                    src="close.png"
                    onClick={onClose}
                />
            </div>
        </div>
    );
};

type ModalProps = {
    onClose: () => void;
    children: ReactNode;
    feedback?: boolean;
};

const Modal = ({ onClose, children, feedback }: ModalProps) => {
    return (
        <>
            {ReactDOM.createPortal(
                <Backdrop onClose={onClose} feedback={feedback} />,
                document.getElementById("overlays")!
            )}
            {ReactDOM.createPortal(
                <ModalOverlay feedback={feedback} onClose={onClose}>
                    {children}
                </ModalOverlay>,
                document.getElementById("overlays")!
            )}
        </>
    );
};

export default Modal;
