import React, { useState } from "react";
import { Collapse } from "react-collapse";
import "./Collapsible.css"; // It needs to have given names of classes and don't allowed module.css to create unique names of classes

interface CollapsibleProps extends React.PropsWithChildren {
    title: string;
    isOpened: boolean;
    image?: string;
}

export const Collapsible = ({
    title,
    children,
    isOpened,
    image,
}: CollapsibleProps) => {
    const [isOpen, setIsOpen] = useState(isOpened);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div
                onClick={handleToggle}
                className={`group ${isOpen ? "open" : ""}`}
            >
                <div className="group-left">
                    <div className="group-image-container">
                        {image && (
                            <img
                                alt="groupimage"
                                src={image}
                                className="group-image"
                            />
                        )}
                    </div>
                    <div>{title}</div>
                </div>
                <div className="group-arrow"></div>
            </div>
            <Collapse isOpened={isOpen}>{children}</Collapse>
        </>
    );
};
