import classes from "./Modal.module.css";
import ReactDOM from "react-dom";
import { ReactNode } from "react";

type BackdropProps = {
    onClose: () => void;
};

const Backdrop = ({ onClose }: BackdropProps) => {
    return <div className={classes.backdrop} onClick={onClose} />;
};

type ModalOverlayProps = {
    children: ReactNode;
};

const ModalOverlay = ({ children }: ModalOverlayProps) => {
    return (
        <div className={classes.modal}>
            <div className={classes.content}>{children}</div>
        </div>
    );
};

type ModalProps = {
    onClose: () => void;
    children: ReactNode;
};

const Modal = ({ onClose, children }: ModalProps) => {
    return (
        <>
            {ReactDOM.createPortal(
                <Backdrop onClose={onClose} />,
                document.getElementById("overlays")!
            )}
            {ReactDOM.createPortal(
                <ModalOverlay>{children}</ModalOverlay>,
                document.getElementById("overlays")!
            )}
        </>
    );
};

export default Modal;
