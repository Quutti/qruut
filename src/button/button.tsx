import * as React from "react";
import * as classNames from "classnames";

const styles: { [key: string]: any } = require("./button.css");

export type ButtonClickHandler = () => void;

export interface ButtonProps {
    /**
     * Text in a button
     */
    text: string;
    className?: string;
    disabled?: boolean;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Button component
 */
export class Button extends React.Component<ButtonProps, {}> {

    static defaultProps: Partial<ButtonProps> = {
        className: ""
    }

    constructor(props) {
        super(props);

        this._handleClick = this._handleClick.bind(this);
    }

    public render(): JSX.Element {
        const { text, disabled, className } = this.props;
        const classes = [styles.root, ...className.split(" ")];

        if (disabled) {
            classes.push(styles.disabled);
        }

        return (
            <button
                className={classes.join(" ")}
                onClick={this._handleClick}
                disabled={disabled}>
                <span className={styles.text}>{text}</span>
            </button>
        );
    }


    private _handleClick(evt: React.MouseEvent<HTMLButtonElement>) {
        evt.preventDefault();
        if (!this.props.disabled) {
            this.props.onClick(evt);
        }
    }

}

export default Button;