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
    hideCloseIcon?: boolean;
};

const ModalOverlay = ({
    children,
    feedback,
    onClose,
    hideCloseIcon,
}: ModalOverlayProps) => {
    return (
        <div className={`${classes.modal} ${feedback ? classes.feedback : ""}`}>
            <div className={classes.contentWrapper}>
                <div className={classes.content}>{children}</div>
                {!hideCloseIcon && (
                    <img
                        alt="close"
                        className={classes.close_img}
                        src="close.png"
                        onClick={onClose}
                    />
                )}
            </div>
        </div>
    );
};

type ModalProps = {
    onClose: () => void;
    children: ReactNode;
    feedback?: boolean;
    hideCloseIcon?: boolean;
};

const Modal = ({ onClose, children, feedback, hideCloseIcon }: ModalProps) => {
    return (
        <>
            {ReactDOM.createPortal(
                <Backdrop onClose={onClose} feedback={feedback} />,
                document.getElementById("overlays")!
            )}
            {ReactDOM.createPortal(
                <ModalOverlay
                    feedback={feedback}
                    onClose={onClose}
                    hideCloseIcon={hideCloseIcon}
                >
                    {children}
                </ModalOverlay>,
                document.getElementById("overlays")!
            )}
        </>
    );
};

export default Modal;
