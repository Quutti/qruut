import * as React from "react";
import { Link } from "react-router-dom";

const styles: { [key: string]: any } = require("./list-item.css");

export interface ListItemProps {
    to?: string;
    className?: string;
}

export class ListItem extends React.Component<ListItemProps, {}> {

    static defaultProps: Partial<ListItemProps> = {
        className: ""
    }

    public render(): JSX.Element {
        const { className, children } = this.props;
        const classes = [styles.root, ...className.split(" ")].join(" ");
        return <li className={classes}>{this._getInnerContent()}</li>;
    }

    private _getInnerContent(): JSX.Element {
        const { to, children } = this.props;

        return (to)
            ? <Link to={to} className={styles.link}>{children}</Link>
            : <div className={styles.content}>{children}</div>;
    }
}