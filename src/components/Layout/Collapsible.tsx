import React, { useState } from "react";
import { Collapse } from "react-collapse";
import "./Collapsible.css"; // It needs to have given names of classes and don't allowed module.css to create unique names of classes

interface CollapsibleProps extends React.PropsWithChildren {
    title: string;
    isOpened: boolean;
}

export const Collapsible = ({
    title,
    children,
    isOpened,
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
                {title}
                <div className="arrow"></div>
            </div>
            <Collapse isOpened={isOpen}>{children}</Collapse>
        </>
    );
};
