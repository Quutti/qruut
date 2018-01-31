import * as React from "react";
import * as classNames from "classnames";

const styles: { [key: string]: any } = require("./button.css");

export interface ButtonProps {
    text: string;
    className?: string;
    disabled?: boolean;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>, props: ButtonProps) => {
    event.preventDefault();
    if (!props.disabled) {
        props.onClick(event);
    }
}

/**
 * Button component
 */
export const Button: React.SFC<ButtonProps> = (props) => {
    const { text, disabled, className } = props;
    const classes = classNames(styles.root, className, {
        [styles.disabled]: disabled
    });

    return (
        <button
            className={classes}
            onClick={(event) => handleButtonClick(event, props)}
            disabled={disabled}>
            <span className={styles.text}>{text}</span>
        </button>
    );
}

Button.defaultProps = {
    className: ""
}

export default Button;