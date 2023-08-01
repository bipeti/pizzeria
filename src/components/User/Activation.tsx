import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    GeneralState,
    activateNewUser,
    generalActions,
} from "../../store/general-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import FeedbackModal from "../UI/FeedbackModal";
import { useSelector } from "react-redux";

const Activation: React.FC = () => {
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const generalMessage = useSelector(
        (state: { general: GeneralState }) => state.general.message
    );
    const generalError = useSelector(
        (state: { general: GeneralState }) => state.general.error
    );
    const generalIsLoading = useSelector(
        (state: { general: GeneralState }) => state.general.isLoading
    );

    const [missingData, setMissingData] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const email = urlParams.get("email");
        const token = urlParams.get("token");

        if (!email || !token) {
            setMissingData(true);
            return;
        }
        dispatch(activateNewUser({ email, token }));
    }, [location.search, dispatch]);

    const feedbackCloseHandler = () => {
        setMissingData(false);
        navigate("/");
    };
    const generalFeedbackCloseHandler = () => {
        dispatch(generalActions.clearMessages());
        navigate("/");
    };

    return (
        <>
            <div>Activation Page</div>
            {missingData && (
                <FeedbackModal
                    onClose={feedbackCloseHandler}
                    message={"Az aktiválás nem sikerült!"}
                    errorMessage={
                        "Kérünk, hogy az aktiváláshoz használd a küldött e-mail-ben található linket!"
                    }
                    messagetype="warning"
                />
            )}
            {generalMessage && (
                <FeedbackModal
                    onClose={generalFeedbackCloseHandler}
                    message={generalMessage}
                    errorMessage={generalError}
                    isLoading={generalIsLoading}
                />
            )}
        </>
    );
};

export default Activation;
