import * as React from "react";
import * as classNames from "classnames";

const styles: { [key: string]: any } = require("./card.css");

export interface CardProps {
    heading?: string;
    className?: string;
    style?: { [key: string]: any };
}

export const Card: React.SFC<CardProps> = (props) => {
    const { heading, children, className, style } = props;
    const rootClasses = classNames(styles.root, className);

    return (
        <div className={rootClasses} style={style}>
            {heading && <div className={styles.heading}><h2 className={styles.headingText}>{heading}</h2></div>}
            <div className={styles.body}>
                {children}
            </div>
        </div>
    );
}

Card.defaultProps = {
    className: "",
    style: {}
}