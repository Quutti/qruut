import * as React from "react";

const styles: { [key: string]: any } = require("./card.css");

export interface CardProps {
    heading?: string;
    className?: string;
    style?: { [key: string]: any };
}

export class Card extends React.Component<CardProps, {}> {

    static defaultProps: Partial<CardProps> = {
        className: "",
        style: {}
    }

    public render(): JSX.Element {
        const { heading, children, className, style } = this.props;

        const rootClasses = [
            styles.root,
            ...className.split(" ")
        ].join(" ");

        return (
            <div className={rootClasses} style={style}>
                {heading && <div className={styles.heading}><h2 className={styles.headingText}>{heading}</h2></div>}
                <div className={styles.body}>
                    {children}
                </div>
            </div>
        )
    }

}