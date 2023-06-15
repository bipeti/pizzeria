import React, { useState } from "react";
import { Collapse } from "react-collapse";

interface CollapsibleProps extends React.PropsWithChildren<{}> {
    title: string;
}

export const Collapsible = ({ title, children }: CollapsibleProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <div onClick={handleToggle}>{title}</div>
            <Collapse isOpened={isOpen}>{children}</Collapse>
        </div>
    );
};
