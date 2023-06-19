import React, { useState } from "react";
import { Collapse } from "react-collapse";
import "./Collapsible.css"; // It needs to have given names of classes and don't allowed module.css to create unique names of classes

interface CollapsibleProps extends React.PropsWithChildren {
    title: string;
}

export const Collapsible = ({ title, children }: CollapsibleProps) => {
    const [isOpen, setIsOpen] = useState(false);

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
