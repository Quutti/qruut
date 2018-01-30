import * as React from "react";
import * as classNames from "classnames";
import { Link } from "react-router-dom";

const styles: { [key: string]: any } = require("./list-item.css");

export interface ListItemProps {
    /**
     * If defined, item will be presented as link
     */
    to?: string;
    className?: string;
}

export const ListItem: React.SFC<ListItemProps> = (props) => {
    const classes = classNames(styles.root, props.className);

    return (
        <li className={classes}>
            {
                (props.to)
                    ? <Link to={props.to} className={styles.link}>{props.children}</Link>
                    : <div className={styles.content}>{props.children}</div>
            }
        </li>
    );
}

ListItem.defaultProps = {
    className: ""
}

export default ListItem;